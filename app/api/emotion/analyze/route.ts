/**
 * 감정 분석 API
 * AI 기반 감정 분석 및 패턴 모델링
 */

import { NextResponse } from "next/server";
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

    // 라이프 로그 수집
    let lifeLogs: any[] = [];
    if (validated.includeLifeLog) {
      const targetDate = validated.date || new Date().toISOString().split("T")[0];
      
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
    const targetDate = validated.date || new Date().toISOString().split("T")[0];
    try {
      await saveEmotionAnalysis(actualUserId, targetDate, analysis);
      console.log("💾 감정 분석 결과 저장 완료");
    } catch (saveError) {
      console.warn("⚠️ 감정 분석 결과 저장 실패:", saveError);
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
