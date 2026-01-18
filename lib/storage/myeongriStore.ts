/**
 * 명리학 분석 저장소
 * 명리학 분석 결과를 저장하고 조회합니다.
 * 사용자별로 한 번만 분석하고 결과를 재사용합니다.
 */

import { getSupabaseServerClient } from "@/lib/db/supabase";
import { MyeongriAnalysisResponse } from "@/lib/contracts/myeongri";

// 메모리 저장소 (폴백)
const memoryStore = new Map<string, MyeongriAnalysisResponse>();

/**
 * 명리학 분석 결과 저장
 * @param userId - 사용자 UUID
 * @param analysis - 명리학 분석 결과
 */
export async function saveMyeongriAnalysis(
  userId: string,
  analysis: MyeongriAnalysisResponse
): Promise<MyeongriAnalysisResponse> {
  const supabase = await getSupabaseServerClient();
  
  if (supabase && userId && userId.length === 36) { // UUID 형식 확인
    try {
      const { data, error } = await supabase
        .from("myeongri_analyses")
        .upsert({
          user_id: userId,
          analysis_result: analysis,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "user_id",
        })
        .select("analysis_result")
        .single();

      if (!error && data) {
        return data.analysis_result as MyeongriAnalysisResponse;
      }
    } catch (error) {
      console.warn("Supabase save myeongri analysis error, falling back to memory store:", error);
    }
  }

  // 메모리 저장소에 저장 (폴백)
  memoryStore.set(userId, analysis);
  return analysis;
}

/**
 * 명리학 분석 결과 조회
 * @param userId - 사용자 UUID
 */
export async function getMyeongriAnalysis(
  userId: string
): Promise<MyeongriAnalysisResponse | null> {
  const supabase = await getSupabaseServerClient();
  
  if (supabase && userId && userId.length === 36) { // UUID 형식 확인
    try {
      const { data, error } = await supabase
        .from("myeongri_analyses")
        .select("analysis_result")
        .eq("user_id", userId)
        .single();

      if (!error && data) {
        return data.analysis_result as MyeongriAnalysisResponse;
      }
    } catch (error) {
      console.warn("Supabase get myeongri analysis error, falling back to memory store:", error);
    }
  }

  // 메모리 저장소에서 조회 (폴백)
  return memoryStore.get(userId) || null;
}

/**
 * 명리학 분석 결과 존재 여부 확인
 * @param userId - 사용자 UUID
 */
export async function hasMyeongriAnalysis(userId: string): Promise<boolean> {
  const result = await getMyeongriAnalysis(userId);
  return !!result;
}

/**
 * 명리학 분석 결과 삭제 (재분석을 위해)
 * @param userId - 사용자 UUID
 */
export async function deleteMyeongriAnalysis(userId: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  
  if (supabase && userId && userId.length === 36) {
    try {
      const { error } = await supabase
        .from("myeongri_analyses")
        .delete()
        .eq("user_id", userId);

      if (error) throw error;
    } catch (error) {
      console.warn("Supabase delete myeongri analysis error, falling back to memory store:", error);
    }
  }

  // 메모리 저장소에서 삭제 (폴백)
  memoryStore.delete(userId);
}
