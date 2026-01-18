/**
 * 감정 분석 API
 * AI 기반 감정 분석 및 패턴 모델링
 */

import { NextResponse } from "next/server";

// 동적 라우트로 명시 (cookies 사용)
export const dynamic = 'force-dynamic';
import { cookies } from "next/headers";
import { analyzeEmotion } from "@/lib/ai/openai";
import { EmotionAnalysisRequestSchema } from "@/lib/contracts/emotion";
import { lifelogStore } from "@/lib/storage/lifelogStore";
import { getOrCreateUserId } from "@/lib/storage/userStore";
import { LifeLogRequest } from "@/lib/contracts/lifelog";
import { saveEmotionAnalysis } from "@/lib/storage/emotionStore";

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const userSaju = cookieStore.get("user_saju");

    if (!userSaju) {
      return NextResponse.json({ error: "No user info" }, { status: 401 });
    }

    const userData = JSON.parse(userSaju.value);
    const { birthDate, userId } = userData;

    if (!birthDate) {
      return NextResponse.json({ error: "Birth date required" }, { status: 400 });
    }

    const body = await request.json();
    const validated = EmotionAnalysisRequestSchema.parse(body);

    // 사용자 ID 확인
    const actualUserId = userId || await getOrCreateUserId(birthDate, userData.birthTime || null, userData.gender || "O");
    if (!actualUserId) {
      return NextResponse.json({ error: "Failed to get user ID" }, { status: 500 });
    }

    console.log("📊 감정 분석 시작...");
    console.log("  - 사용자 ID:", actualUserId);
    console.log("  - 분석 기간:", validated.period);
    console.log("  - 분석 날짜:", validated.date || "오늘");

    // 오늘 날짜 확인
    const targetDate = validated.date || new Date().toISOString().split("T")[0];
    
    console.log("🔍 캐시 확인 중...");
    console.log("  - 사용자 ID:", actualUserId);
    console.log("  - 대상 날짜:", targetDate);
    
    // 같은 날짜에 이미 분석 결과가 있는지 확인
    const { getEmotionAnalysis } = await import("@/lib/storage/emotionStore");
    let existingAnalysis = null;
    
    try {
      existingAnalysis = await getEmotionAnalysis(actualUserId, targetDate);
      
      if (existingAnalysis) {
        console.log("✅ 기존 분석 결과 발견, DB에서 반환");
        console.log("  - 분석 ID:", existingAnalysis.id);
        console.log("  - 생성일:", existingAnalysis.createdAt);
        return NextResponse.json(existingAnalysis.analysis);
      } else {
        console.log("❌ 기존 분석 결과 없음, 새로 분석 필요");
      }
    } catch (cacheError: any) {
      console.warn("⚠️ 캐시 조회 중 오류 발생, 새로 분석 수행:", cacheError.message);
      // 캐시 조회 실패해도 계속 진행
    }

    console.log("🔄 새로운 분석 수행");

    // 라이프 로그 수집
    let lifeLogs: any[] = [];
    if (validated.includeLifeLog) {
      if (validated.period === "day") {
        // 하루치 데이터
        const log = await lifelogStore.get(actualUserId, targetDate);
        if (log) {
          lifeLogs.push({
            date: log.date,
            mood: log.mood,
            condition: log.condition,
            sleep: log.sleep,
            schedule: log.schedule,
            notes: log.notes,
          });
        }
      } else if (validated.period === "week") {
        // 일주일치 데이터
        const today = new Date(targetDate);
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];
          const log = await lifelogStore.get(actualUserId, dateStr);
          if (log) {
            lifeLogs.push({
              date: log.date,
              mood: log.mood,
              condition: log.condition,
              sleep: log.sleep,
              schedule: log.schedule,
              notes: log.notes,
            });
          }
        }
      } else if (validated.period === "month") {
        // 한 달치 데이터 (최근 30일)
        const today = new Date(targetDate);
        for (let i = 0; i < 30; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];
          const log = await lifelogStore.get(actualUserId, dateStr);
          if (log) {
            lifeLogs.push({
              date: log.date,
              mood: log.mood,
              condition: log.condition,
              sleep: log.sleep,
              schedule: log.schedule,
              notes: log.notes,
            });
          }
        }
      }
    }

    // 메모 수집
    const notes: string[] = [];
    if (validated.includeNotes) {
      lifeLogs.forEach(log => {
        if (log.notes) {
          notes.push(log.notes);
        }
      });
    }

    console.log("📋 수집된 데이터:");
    console.log("  - 라이프 로그:", lifeLogs.length, "개");
    console.log("  - 메모:", notes.length, "개");

    // AI 감정 분석
    const analysis = await analyzeEmotion(validated, lifeLogs, notes);

    if (!analysis) {
      console.error("❌ 감정 분석 실패");
      return NextResponse.json(
        { error: "AI analysis failed. Please check OpenAI API key." },
        { status: 500 }
      );
    }

    console.log("✅ 감정 분석 완료!");
    
    // 분석 결과 저장
    try {
      console.log("💾 감정 분석 결과 저장 시도...");
      const saved = await saveEmotionAnalysis(actualUserId, targetDate, analysis);
      if (saved) {
        console.log("✅ 감정 분석 결과 저장 완료:", saved.id);
      } else {
        console.warn("⚠️ 감정 분석 결과 저장 실패: null 반환");
      }
    } catch (saveError: any) {
      console.error("❌ 감정 분석 결과 저장 중 오류:", saveError.message);
      // 저장 실패해도 분석 결과는 반환
    }
    
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Emotion analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET: 캐시된 분석 결과 조회 (추후 구현)
 */
export async function GET() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
