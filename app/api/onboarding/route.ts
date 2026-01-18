import { NextResponse } from "next/server";
import { OnboardingRequestSchema } from "../../../lib/contracts/user";
import { getSajuProfile } from "../../../lib/engine/sajuEngine";
import { getOrCreateUserId } from "@/lib/storage/userStore";
import { getSupabaseServerClient } from "@/lib/db/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = OnboardingRequestSchema.parse(body);
    
    const profile = getSajuProfile(validated.birthDate, validated.birthTime);
    
    // Supabase에 사용자 저장 (또는 조회)
    const userId = await getOrCreateUserId(validated.birthDate, validated.birthTime, validated.gender);
    
    // 사주 차트 저장 (선택사항)
    const supabase = await getSupabaseServerClient();
    if (supabase && userId && userId.length === 36) {
      try {
        await supabase
          .from("saju_charts")
          .upsert({
            user_id: userId,
            pillars: profile.pillars,
            five_elements: profile.fiveElements,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: "user_id",
          });
      } catch (error) {
        // 사주 차트 저장 실패해도 계속 진행
        console.warn("Failed to save saju chart:", error);
      }
    }
    
    const response = NextResponse.json({ success: true, profile });
    response.cookies.set("user_saju", JSON.stringify({
      birthDate: validated.birthDate,
      birthTime: validated.birthTime,
      gender: validated.gender,
      fiveElements: profile.fiveElements,
      pillars: profile.pillars, // 사주 4주 저장
      dayMaster: profile.dayMaster, // 일간 저장
      userId: userId, // UUID 저장
    }), { path: "/", maxAge: 60 * 60 * 24 * 7 });
    
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
