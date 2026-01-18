import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ruleEngine } from "@/lib/engine/ruleEngine";
import { getSajuProfile } from "@/lib/engine/sajuEngine";
import { HybridRecommendationRequestSchema, LifeLogRequest } from "@/lib/contracts/lifelog";
import { lifelogStore } from "@/lib/storage/lifelogStore";

/**
 * 하이브리드 추천 API
 * 사주 + 라이프 로그를 결합한 추천을 제공합니다.
 */

export async function GET(request: Request) {
  const cookieStore = cookies();
  const userSaju = cookieStore.get("user_saju");

  if (!userSaju) {
    return NextResponse.json({ error: "No user info" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
    const includeLifeLog = searchParams.get("includeLifeLog") !== "false";

    const userData = JSON.parse(userSaju.value);
    const { birthDate, birthTime, fiveElements: cachedFiveElements } = userData;

    // 사주 프로필 재계산 (정확성을 위해)
    const sajuProfile = getSajuProfile(birthDate, birthTime);
    
    // 사주 기반 운세 계산
    const sajuFortune = ruleEngine.today(sajuProfile.fiveElements);

    // 라이프 로그 조회
    let lifeLog: LifeLogRequest | null = null;
    if (includeLifeLog) {
      // userData에 userId가 있으면 사용, 없으면 birthDate 사용
      const lookupId = userData.userId || birthDate;
      const storedLog = await lifelogStore.get(lookupId, date);
      if (storedLog) {
        lifeLog = {
          date: storedLog.date,
          mood: storedLog.mood,
          condition: storedLog.condition,
          sleep: storedLog.sleep,
          schedule: storedLog.schedule,
          notes: storedLog.notes,
        };
      }
    }

    // 하이브리드 추천 생성
    const hybridRecommendation = ruleEngine.hybrid(
      sajuProfile.fiveElements,
      sajuFortune.globalScore,
      sajuFortune.mainMessage,
      lifeLog
    );

    return NextResponse.json(hybridRecommendation);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
