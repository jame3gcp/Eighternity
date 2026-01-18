/**
 * 라이프 로그 저장소
 * Supabase 우선 사용, 없으면 메모리 저장소 사용
 */

import { LifeLogResponse, LifeLogRequest } from "@/lib/contracts/lifelog";
import { getSupabaseServerClient } from "@/lib/db/supabase";
import { dbQuery } from "@/lib/db/client";
import { getOrCreateUserId } from "./userStore";

// 메모리 기반 저장소 (DB가 없을 때 사용)
const memoryStore = new Map<string, LifeLogResponse>();

/**
 * 사용자 ID와 날짜로 키 생성
 */
function getKey(userId: string, date: string): string {
  return `${userId}-${date}`;
}

export const lifelogStore = {
  /**
   * 라이프 로그 조회
   * @param userId - birthDate 또는 UUID
   * @param date - 날짜 (YYYY-MM-DD)
   */
  async get(userId: string, date: string): Promise<LifeLogResponse | undefined> {
    // Supabase 사용 시도
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      try {
        // userId가 UUID 형식인지 확인, 아니면 users 테이블에서 조회
        const actualUserId = userId.includes("-") && userId.length === 36 
          ? userId 
          : await getOrCreateUserId(userId);
        
        if (!actualUserId) {
          throw new Error("Failed to get user ID");
        }

        const { data, error } = await supabase
          .from("life_logs")
          .select("*")
          .eq("user_id", actualUserId)
          .eq("date", date)
          .single();

        if (!error && data) {
          return {
            id: data.id,
            date: data.date,
            mood: data.mood,
            condition: data.condition,
            sleep: data.sleep,
            schedule: data.schedule,
            notes: data.notes,
            createdAt: data.created_at,
          } as LifeLogResponse;
        }
      } catch (error) {
        console.warn("Supabase query error, falling back to memory store:", error);
      }
    }

    // PostgreSQL 직접 연결 시도
    const dbResult = await dbQuery<LifeLogResponse>(
      `SELECT id, date, mood, condition, sleep, schedule, notes, created_at as "createdAt"
       FROM life_logs 
       WHERE user_id = $1 AND date = $2`,
      [userId, date]
    );

    if (dbResult && dbResult.length > 0) {
      return dbResult[0];
    }

    // 메모리 저장소 확인
    const key = getKey(userId, date);
    return memoryStore.get(key);
  },

  /**
   * 라이프 로그 저장
   * @param userId - birthDate 또는 UUID
   * @param value - 라이프 로그 데이터
   */
  async set(userId: string, value: LifeLogRequest): Promise<LifeLogResponse> {
    const response: LifeLogResponse = {
      ...value,
      id: `${userId}-${value.date}`,
      createdAt: new Date().toISOString(),
    };

    // Supabase 사용 시도
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      try {
        // userId가 UUID 형식인지 확인, 아니면 users 테이블에서 조회/생성
        const actualUserId = userId.includes("-") && userId.length === 36 
          ? userId 
          : await getOrCreateUserId(userId);
        
        if (!actualUserId) {
          throw new Error("Failed to get user ID");
        }

        const { data, error } = await supabase
          .from("life_logs")
          .upsert({
            user_id: actualUserId,
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

        if (!error && data) {
          return {
            id: data.id,
            date: data.date,
            mood: data.mood,
            condition: data.condition,
            sleep: data.sleep,
            schedule: data.schedule,
            notes: data.notes,
            createdAt: data.created_at,
          } as LifeLogResponse;
        }
      } catch (error) {
        console.warn("Supabase upsert error, falling back to memory store:", error);
      }
    }

    // PostgreSQL 직접 연결 시도
    const dbResult = await dbQuery(
      `INSERT INTO life_logs (user_id, date, mood, condition, sleep, schedule, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id, date) 
       DO UPDATE SET mood = $3, condition = $4, sleep = $5, schedule = $6, notes = $7, updated_at = NOW()
       RETURNING id, date, mood, condition, sleep, schedule, notes, created_at as "createdAt"`,
      [userId, value.date, value.mood, value.condition, value.sleep, value.schedule, value.notes || null]
    );

    if (dbResult && dbResult.length > 0) {
      return dbResult[0] as LifeLogResponse;
    }

    // 메모리 저장소에 저장
    const key = getKey(userId, value.date);
    memoryStore.set(key, response);
    return response;
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
    // Supabase 사용 시도
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      try {
        const actualUserId = userId.includes("-") && userId.length === 36 
          ? userId 
          : await getOrCreateUserId(userId);
        
        if (!actualUserId) {
          throw new Error("Failed to get user ID");
        }

        const { error } = await supabase
          .from("life_logs")
          .delete()
          .eq("user_id", actualUserId)
          .eq("date", date);

        if (!error) {
          return true;
        }
      } catch (error) {
        console.warn("Supabase delete error, falling back to memory store:", error);
      }
    }

    // PostgreSQL 직접 연결 시도
    const dbResult = await dbQuery(
      `DELETE FROM life_logs WHERE user_id = $1 AND date = $2`,
      [userId, date]
    );

    if (dbResult !== null) {
      return true;
    }

    // 메모리 저장소에서 삭제
    const key = getKey(userId, date);
    return memoryStore.delete(key);
  },

  /**
   * 모든 라이프 로그 조회 (특정 사용자)
   */
  async getAll(userId: string): Promise<LifeLogResponse[]> {
    // Supabase 사용 시도
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      try {
        const actualUserId = userId.includes("-") && userId.length === 36 
          ? userId 
          : await getOrCreateUserId(userId);
        
        if (!actualUserId) {
          throw new Error("Failed to get user ID");
        }

        const { data, error } = await supabase
          .from("life_logs")
          .select("*")
          .eq("user_id", actualUserId)
          .order("date", { ascending: false });

        if (!error && data) {
          return data.map((item: {
            id: string;
            date: string;
            mood: string;
            condition: string;
            sleep: string;
            schedule: string;
            notes: string | null;
            created_at: string;
          }) => ({
            id: item.id,
            date: item.date,
            mood: item.mood,
            condition: item.condition,
            sleep: item.sleep,
            schedule: item.schedule,
            notes: item.notes,
            createdAt: item.created_at,
          })) as LifeLogResponse[];
        }
      } catch (error) {
        console.warn("Supabase query error, falling back to memory store:", error);
      }
    }

    // PostgreSQL 직접 연결 시도
    const dbResult = await dbQuery<LifeLogResponse>(
      `SELECT id, date, mood, condition, sleep, schedule, notes, created_at as "createdAt"
       FROM life_logs 
       WHERE user_id = $1 
       ORDER BY date DESC`,
      [userId]
    );

    if (dbResult) {
      return dbResult;
    }

    // 메모리 저장소에서 조회
    return Array.from(memoryStore.values()).filter(
      (log) => log.id?.startsWith(`${userId}-`)
    );
  },
};
