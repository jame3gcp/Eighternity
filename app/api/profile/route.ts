import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSajuProfile } from "@/lib/engine/sajuEngine";
import { analyzeTenGods } from "@/lib/engine/tenGods";

export async function GET() {
  try {
    const cookieStore = cookies();
    const userSaju = cookieStore.get("user_saju");

    if (!userSaju) {
      return NextResponse.json({ 
        fiveElements: { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 },
        strengths: ["온보딩이 필요합니다"],
        cautions: ["데이터가 없습니다"],
        needsOnboarding: true 
      });
    }

    const userData = JSON.parse(userSaju.value);
    const { birthDate, birthTime, fiveElements } = userData;
    
    if (!fiveElements || !birthDate) {
      return NextResponse.json({ 
        fiveElements: { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 },
        strengths: ["온보딩이 필요합니다"],
        cautions: ["데이터가 없습니다"],
        needsOnboarding: true 
      });
    }
    
    // 사주 프로필 재계산
    const sajuProfile = getSajuProfile(birthDate, birthTime);
    
    // 십성 분석
    const tenGods = analyzeTenGods(sajuProfile.dayMaster, sajuProfile.pillars);
    
    return NextResponse.json({
      fiveElements,
      pillars: sajuProfile.pillars,
      dayMaster: sajuProfile.dayMaster,
      tenGods,
      strengths: ["끈기가 강함", "창의적인 사고", "타인을 배려하는 마음"],
      cautions: ["고집이 셀 수 있음", "결정 장애", "체력 관리 유의"],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
