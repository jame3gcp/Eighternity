/**
 * 명리학 종합 분석 API
 * OpenAI를 사용하여 전통 명리학 원리에 따른 종합 분석 제공
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSajuProfile } from "@/lib/engine/sajuEngine";
import { analyzeTenGods } from "@/lib/engine/tenGods";
import { calculateDaeun, calculateSeun, calculateRelationships } from "@/lib/engine/luck";
import { analyzeMyeongri, MyeongriAnalysisRequest } from "@/lib/ai/openai";
import { getMyeongriAnalysis, saveMyeongriAnalysis } from "@/lib/storage/myeongriStore";
import { getOrCreateUserId } from "@/lib/storage/userStore";

// 동적 라우트로 명시 (cookies 사용)
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const userSaju = cookieStore.get("user_saju");

    if (!userSaju) {
      return NextResponse.json({ error: "No user info" }, { status: 401 });
    }

    const userData = JSON.parse(userSaju.value);
    const { birthDate, birthTime, gender, userId } = userData;

    if (!birthDate) {
      return NextResponse.json({ error: "Birth date required" }, { status: 400 });
    }

    // 사용자 ID 확인 또는 생성
    const actualUserId = userId || await getOrCreateUserId(birthDate, birthTime || null, gender || "O");
    if (!actualUserId) {
      return NextResponse.json({ error: "Failed to get user ID" }, { status: 500 });
    }

    // 저장된 분석 결과 조회 시도
    console.log("🔍 저장된 명리학 분석 결과 조회 중...");
    const cachedAnalysis = await getMyeongriAnalysis(actualUserId);
    
    if (cachedAnalysis) {
      console.log("✅ 저장된 분석 결과 발견! 재사용합니다.");
      return NextResponse.json(cachedAnalysis);
    }

    console.log("📊 새로운 명리학 분석 시작...");
    console.log("📊 사주 기본 계산 시작...");
    // 사주 기본 계산
    const sajuProfile = getSajuProfile(birthDate, birthTime);
    const [year, month, day] = birthDate.split("-").map(Number);
    console.log("✅ 사주 계산 완료:", sajuProfile.pillars);

    console.log("🔮 십성 분석 시작...");
    // 십성 분석
    const tenGods = analyzeTenGods(sajuProfile.dayMaster, sajuProfile.pillars);
    console.log("✅ 십성 분석 완료");

    console.log("⚡ 형충회합 분석 시작...");
    // 형충회합 분석
    const relationships = calculateRelationships(sajuProfile.pillars);
    console.log("✅ 형충회합 분석 완료");

    console.log("🌟 대운·세운 계산 시작...");
    // 대운·세운 계산
    const daeun = calculateDaeun(year, month, day, gender || "M");
    const seun = calculateSeun();
    console.log("✅ 대운·세운 계산 완료");

    // OpenAI 분석 요청
    const analysisRequest: MyeongriAnalysisRequest = {
      birthDate,
      birthTime,
      gender: gender || "M",
      pillars: sajuProfile.pillars,
      fiveElements: sajuProfile.fiveElements,
      dayMaster: sajuProfile.dayMaster,
      tenGods: tenGods,
      relationships: relationships,
      daeun: daeun,
      seun: seun,
    };

    console.log("🤖 OpenAI 분석 요청 시작...");
    const analysis = await analyzeMyeongri(analysisRequest);

    if (!analysis) {
      console.error("❌ OpenAI 분석 실패");
      return NextResponse.json(
        { error: "AI analysis failed. Please check OpenAI API key." },
        { status: 500 }
      );
    }

    // 분석 결과 저장
    console.log("💾 분석 결과 저장 중...");
    await saveMyeongriAnalysis(actualUserId, analysis);
    console.log("✅ 분석 결과 저장 완료!");

    console.log("✅ 명리학 분석 완료!");
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Myeongri analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET: 저장된 분석 결과 조회
 */
export async function GET() {
  try {
    const cookieStore = cookies();
    const userSaju = cookieStore.get("user_saju");

    if (!userSaju) {
      return NextResponse.json({ error: "No user info" }, { status: 401 });
    }

    const userData = JSON.parse(userSaju.value);
    const { birthDate, birthTime, gender, userId } = userData;

    if (!birthDate) {
      return NextResponse.json({ error: "Birth date required" }, { status: 400 });
    }

    // 사용자 ID 확인 또는 생성
    const actualUserId = userId || await getOrCreateUserId(birthDate, birthTime || null, gender || "O");
    if (!actualUserId) {
      return NextResponse.json({ error: "Failed to get user ID" }, { status: 500 });
    }

    // 저장된 분석 결과 조회
    const analysis = await getMyeongriAnalysis(actualUserId);
    
    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Myeongri analysis GET error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
