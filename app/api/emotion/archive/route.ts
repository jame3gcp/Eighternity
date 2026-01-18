/**
 * 감정 아카이브 API
 * 저장된 감정 분석 결과 조회
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getEmotionAnalysis, getEmotionAnalysesByPeriod } from "@/lib/storage/emotionStore";
import { getOrCreateUserId } from "@/lib/storage/userStore";

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const actualUserId = userId || await getOrCreateUserId(birthDate, userData.birthTime || null, userData.gender || "O");
    if (!actualUserId) {
      return NextResponse.json({ error: "Failed to get user ID" }, { status: 500 });
    }

    // 특정 날짜 조회
    if (date) {
      const archive = await getEmotionAnalysis(actualUserId, date);
      if (!archive) {
        return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
      }
      return NextResponse.json(archive);
    }

    // 기간별 조회
    if (startDate && endDate) {
      const archives = await getEmotionAnalysesByPeriod(actualUserId, startDate, endDate);
      return NextResponse.json({ archives });
    }

    // 오늘 날짜 조회 (기본값)
    const today = new Date().toISOString().split("T")[0];
    const archive = await getEmotionAnalysis(actualUserId, today);
    
    if (!archive) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }
    
    return NextResponse.json(archive);
  } catch (error: any) {
    console.error("Emotion archive error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
