import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { QuestionRequestSchema } from "@/lib/contracts/question";
import { analyzeQuestion } from "@/lib/ai/openai";
import { getSajuProfile } from "@/lib/engine/sajuEngine";
import { analyzeTenGods } from "@/lib/engine/tenGods";
import { getTodayQuestionAnswer, saveQuestionAnswer } from "@/lib/storage/questionStore";
import { getOrCreateUserId } from "@/lib/storage/userStore";

// 동적 라우트로 명시 (cookies 사용)
export const dynamic = 'force-dynamic';

/**
 * 질문 답변 API
 * OpenAI를 활용한 AI 기반 개인화된 답변 제공
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = QuestionRequestSchema.parse(body);
    
    // 사용자 정보 가져오기
    const cookieStore = cookies();
    const userSaju = cookieStore.get("user_saju");
    
    if (!userSaju) {
      return NextResponse.json({ error: "No user info" }, { status: 401 });
    }
    
    const userData = JSON.parse(userSaju.value);
    const { birthDate, userId } = userData;
    
    // 사용자 ID 확인
    const actualUserId = userId || await getOrCreateUserId(
      birthDate, 
      userData.birthTime || null, 
      userData.gender || "O"
    );
    
    if (!actualUserId) {
      return NextResponse.json({ error: "Failed to get user ID" }, { status: 500 });
    }
    
    // 카테고리 확인 (필수)
    const category = validated.category || "love";
    
    // 현재 월의 기존 답변 확인
    const today = new Date();
    const existingAnswer = await getTodayQuestionAnswer(actualUserId, category);
    
    if (existingAnswer) {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
      console.log(`✅ 현재 월(${monthStart})의 기존 질문 답변 발견, DB에서 반환`);
      return NextResponse.json({
        answer: existingAnswer,
        timestamp: new Date().toISOString(),
        cached: true,
      });
    }
    
    console.log("🔄 새로운 질문 답변 생성 (이번 달 첫 질문)");
    
    // 사용자 사주 정보 가져오기
    
    let sajuInfo: {
      pillars?: any;
      fiveElements?: any;
      dayMaster?: string;
      tenGods?: Record<string, number>;
    } | undefined = undefined;
    
    if (userSaju) {
      try {
        const sajuData = JSON.parse(userSaju.value);
        
        // 쿠키에 저장된 pillars가 있으면 사용, 없으면 재계산
        let pillars: any;
        let dayMaster: string;
        let fiveElements: any;
        
        if (sajuData.pillars && sajuData.dayMaster) {
          // 쿠키에 저장된 정확한 사주 정보 사용
          console.log("✅ 쿠키에서 사주 정보 사용:", sajuData.pillars);
          pillars = sajuData.pillars;
          dayMaster = sajuData.dayMaster;
          fiveElements = sajuData.fiveElements;
        } else {
          // 쿠키에 pillars가 없으면 재계산 (하위 호환성)
          console.log("⚠️ 쿠키에 pillars 정보 없음, 재계산 수행");
          const profile = getSajuProfile(sajuData.birthDate, sajuData.birthTime);
          pillars = profile.pillars;
          dayMaster = profile.dayMaster;
          fiveElements = profile.fiveElements;
        }
        
        // pillars와 dayMaster 유효성 검사
        if (!pillars || !dayMaster) {
          throw new Error("사주 정보가 유효하지 않습니다");
        }
        
        // pillars 구조 검증
        if (!pillars.year || !pillars.month || !pillars.day || !pillars.hour) {
          throw new Error("사주 기둥 정보가 불완전합니다");
        }
        
        const tenGods = analyzeTenGods(dayMaster, pillars);
        
        sajuInfo = {
          pillars: pillars,
          fiveElements: fiveElements,
          dayMaster: dayMaster,
          tenGods: tenGods.distribution,
        };
        
        console.log("📋 전송될 사주 정보:", {
          pillars: `${pillars.year} ${pillars.month} ${pillars.day} ${pillars.hour}`,
          dayMaster: dayMaster,
        });
      } catch (error) {
        console.warn("사주 정보 파싱 실패, 일반 답변 제공:", error);
      }
    }
    
    // 질문 템플릿에서 질문 가져오기 (템플릿 ID가 있는 경우)
    let question: string | undefined = validated.question;
    if (validated.templateId && !question) {
      const { questionTemplates } = await import("@/lib/ai/prompts/question");
      const template = questionTemplates.find(t => t.id === validated.templateId);
      if (template) {
        question = template.question;
      }
    }
    
    // OpenAI를 사용한 AI 답변 생성
    const answer = await analyzeQuestion({
      category: category,
      question: question,
      sajuInfo: sajuInfo,
    });
    
    if (!answer) {
      // AI 답변 실패 시 폴백: ruleEngine 사용
      const { ruleEngine } = await import("@/lib/engine/ruleEngine");
      const fallbackAnswer = ruleEngine.ask(
        category,
        sajuInfo?.fiveElements,
        "ko"
      );
      
      const fallbackAnswerObj = {
        summary: fallbackAnswer,
        reasoning: "사주 기반 일반적인 조언입니다.",
        actionPlan: "오늘 하루를 신중하게 보내시기 바랍니다.",
        category: category,
        confidence: 50,
      };
      
      // 폴백 답변도 저장 (월 단위)
      try {
        await saveQuestionAnswer(
          actualUserId,
          today.toISOString().split("T")[0],
          category,
          fallbackAnswerObj,
          question,
          validated.templateId
        );
      } catch (saveError) {
        console.warn("⚠️ 폴백 답변 저장 실패:", saveError);
      }
      
      return NextResponse.json({
        answer: fallbackAnswerObj,
        timestamp: new Date().toISOString(),
      });
    }
    
    // AI 답변 저장 (월 단위)
    try {
      await saveQuestionAnswer(
        actualUserId,
        today.toISOString().split("T")[0],
        category,
        answer,
        question,
        validated.templateId
      );
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
      console.log(`💾 질문 답변 저장 완료 (${monthStart} 월 단위)`);
    } catch (saveError) {
      console.warn("⚠️ 질문 답변 저장 실패:", saveError);
      // 저장 실패해도 답변은 반환
    }
    
    return NextResponse.json({
      answer,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("질문 답변 API 오류:", error);
    return NextResponse.json(
      { error: error.message || "질문 답변 생성 중 오류가 발생했습니다." },
      { status: 400 }
    );
  }
}
