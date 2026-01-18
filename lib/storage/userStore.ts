/**
 * 사용자 저장소
 * Supabase users 테이블과 연동
 */

import { getSupabaseServerClient } from "@/lib/db/supabase";

/**
 * birthDate를 기반으로 사용자 ID 조회 또는 생성
 */
export async function getOrCreateUserId(
  birthDate: string, 
  birthTime: string | null = null,
  gender: string | null = null
): Promise<string | null> {
  const supabase = await getSupabaseServerClient();
  
  if (!supabase) {
    // Supabase가 없으면 birthDate를 그대로 사용 (임시)
    return birthDate;
  }

  try {
    // 기존 사용자 조회 (birth_time이 null인 경우도 고려)
    let query = supabase
      .from("users")
      .select("id")
      .eq("birth_date", birthDate);
    
    if (birthTime) {
      query = query.eq("birth_time", birthTime);
    } else {
      query = query.is("birth_time", null);
    }

    const { data: existingUsers, error: selectError } = await query;

    if (!selectError && existingUsers && existingUsers.length > 0) {
      return existingUsers[0].id;
    }

    // 사용자가 없으면 생성
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        birth_date: birthDate,
        birth_time: birthTime || null,
        gender: gender || null,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Failed to create user:", insertError);
      // 실패 시 birthDate 반환 (폴백)
      return birthDate;
    }

    return newUser.id;
  } catch (error) {
    console.error("User store error:", error);
    // 에러 발생 시 birthDate 반환 (폴백)
    return birthDate;
  }
}
