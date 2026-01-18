/**
 * Supabase 기반 라이프 로그 저장소
 * Supabase를 사용할 때의 구현 예시
 */

import { LifeLogResponse, LifeLogRequest } from "@/lib/contracts/lifelog";
import { getSupabaseServerClient } from "@/lib/db/supabase";

// 메모리 기반 저장소 (Supabase가 없을 때 사용)
const memoryStore = new Map<string, LifeLogResponse>();

function getKey(userId: string, date: string): string {
  return `${userId}-${date}`;
}

export const supabaseLifelogStore = {
  /**
   * 라이프 로그 조회
   */
  async get(userId: string, date: string): Promise<LifeLogResponse | undefined> {
    const supabase = getSupabaseServerClient();
    
    if (!supabase) {
      // Supabase가 없으면 메모리 저장소 사용
      const key = getKey(userId, date);
      return memoryStore.get(key);
    }

    try {
      const { data, error } = await supabase
        .from("life_logs")
        .select("*")
        .eq("user_id", userId)
        .eq("date", date)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // 데이터 없음
          return undefined;
        }
        throw error;
      }

      return data as LifeLogResponse;
    } catch (error) {
      console.error("Supabase query error:", error);
      // 에러 발생 시 메모리 저장소 확인
      const key = getKey(userId, date);
      return memoryStore.get(key);
    }
  },

  /**
   * 라이프 로그 저장
   */
  async set(userId: string, value: LifeLogRequest): Promise<LifeLogResponse> {
    const supabase = getSupabaseServerClient();
    
    const response: LifeLogResponse = {
      ...value,
      id: `${userId}-${value.date}`,
      createdAt: new Date().toISOString(),
    };

    if (!supabase) {
      // Supabase가 없으면 메모리 저장소 사용
      const key = getKey(userId, value.date);
      memoryStore.set(key, response);
      return response;
    }

    try {
      const { data, error } = await supabase
        .from("life_logs")
        .upsert({
          user_id: userId,
          date: value.date,
          mood: value.mood,
          condition: value.condition,
          sleep: value.sleep,
          schedule: value.schedule,
          notes: value.notes || null,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "user_id,date",
        })
        .select()
        .single();

      if (error) throw error;

      return data as LifeLogResponse;
    } catch (error) {
      console.error("Supabase upsert error:", error);
      // 에러 발생 시 메모리 저장소에 저장
      const key = getKey(userId, value.date);
      memoryStore.set(key, response);
      return response;
    }
  },

  /**
   * 라이프 로그 존재 여부 확인
   */
  async has(userId: string, date: string): Promise<boolean> {
    const result = await this.get(userId, date);
    return result !== undefined;
  },

  /**
   * 라이프 로그 삭제
   */
  async delete(userId: string, date: string): Promise<boolean> {
    const supabase = getSupabaseServerClient();
    
    if (!supabase) {
      const key = getKey(userId, date);
      return memoryStore.delete(key);
    }

    try {
      const { error } = await supabase
        .from("life_logs")
        .delete()
        .eq("user_id", userId)
        .eq("date", date);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Supabase delete error:", error);
      const key = getKey(userId, date);
      return memoryStore.delete(key);
    }
  },

  /**
   * 모든 라이프 로그 조회 (특정 사용자)
   */
  async getAll(userId: string): Promise<LifeLogResponse[]> {
    const supabase = getSupabaseServerClient();
    
    if (!supabase) {
      return Array.from(memoryStore.values()).filter(
        (log) => log.id?.startsWith(`${userId}-`)
      );
    }

    try {
      const { data, error } = await supabase
        .from("life_logs")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (error) throw error;
      return (data || []) as LifeLogResponse[];
    } catch (error) {
      console.error("Supabase query error:", error);
      return Array.from(memoryStore.values()).filter(
        (log) => log.id?.startsWith(`${userId}-`)
      );
    }
  },
};
