/**
 * 질문 답변 저장소
 * 질문 답변 결과를 월별로 저장하고 조회합니다.
 */

import { QuestionAnswer } from "@/lib/contracts/question";
import { getSupabaseServerClient } from "@/lib/db/supabase";

// 메모리 저장소 (폴백)
const memoryStore = new Map<string, { date: string; userId: string; category: string; answer: QuestionAnswer }>();

/**
 * 날짜를 월의 첫 날로 변환 (YYYY-MM-01)
 */
function getMonthStartDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
}

/**
 * 질문 답변 저장 (월 단위)
 * 날짜를 월의 첫 날로 변환하여 저장합니다.
 */
export async function saveQuestionAnswer(
  userId: string,
  date: string,
  category: string,
  answer: QuestionAnswer,
  questionText?: string,
  templateId?: string
): Promise<void> {
  // 날짜를 월의 첫 날로 변환
  const monthStartDate = getMonthStartDate(date);
  
  // Supabase 저장 시도
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    try {
      const actualUserId = userId.includes("-") && userId.length === 36 
        ? userId 
        : userId;

      const { error } = await supabase
        .from("question_answers")
        .upsert({
          user_id: actualUserId,
          date: monthStartDate, // 월의 첫 날로 저장
          category: category,
          question_text: questionText || null,
          template_id: templateId || null,
          answer_json: answer,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "user_id,date,category",
        });

      if (error) {
        console.warn("Supabase save error, falling back to memory store:", error);
      } else {
        // 성공하면 메모리 저장소에도 저장 (일관성 유지)
        const key = `${userId}-${monthStartDate}-${category}`;
        memoryStore.set(key, { date: monthStartDate, userId, category, answer });
        return;
      }
    } catch (error) {
      console.warn("Supabase save error, falling back to memory store:", error);
    }
  }

  // 메모리 저장소에 저장 (폴백)
  const key = `${userId}-${monthStartDate}-${category}`;
  memoryStore.set(key, { date: monthStartDate, userId, category, answer });
}

/**
 * 질문 답변 조회 (월 단위)
 * 날짜를 월의 첫 날로 변환하여 조회합니다.
 */
export async function getQuestionAnswer(
  userId: string,
  date: string,
  category: string
): Promise<QuestionAnswer | null> {
  // 날짜를 월의 첫 날로 변환
  const monthStartDate = getMonthStartDate(date);
  
  // Supabase 조회 시도
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    try {
      const actualUserId = userId.includes("-") && userId.length === 36 
        ? userId 
        : userId;

      const { data, error } = await supabase
        .from("question_answers")
        .select("*")
        .eq("user_id", actualUserId)
        .eq("date", monthStartDate) // 월의 첫 날로 조회
        .eq("category", category)
        .single();

      if (!error && data) {
        return data.answer_json as QuestionAnswer;
      }
    } catch (error) {
      console.warn("Supabase get error, falling back to memory store:", error);
    }
  }

  // 메모리 저장소에서 조회 (폴백)
  const key = `${userId}-${monthStartDate}-${category}`;
  const stored = memoryStore.get(key);
  return stored ? stored.answer : null;
}

/**
 * 오늘 날짜가 속한 월의 질문 답변 조회
 */
export async function getTodayQuestionAnswer(
  userId: string,
  category: string
): Promise<QuestionAnswer | null> {
  const today = new Date();
  return getQuestionAnswer(userId, today.toISOString().split("T")[0], category);
}

/**
 * 현재 월의 질문 답변 조회 (명시적)
 */
export async function getCurrentMonthQuestionAnswer(
  userId: string,
  category: string
): Promise<QuestionAnswer | null> {
  return getTodayQuestionAnswer(userId, category);
}
