/**
 * 감정 분석 저장소
 * 감정 분석 결과를 저장하고 조회합니다.
 */

import { EmotionAnalysisResponse, EmotionArchive } from "@/lib/contracts/emotion";
import { getSupabaseServerClient } from "@/lib/db/supabase";

// 메모리 저장소 (폴백)
const memoryStore = new Map<string, EmotionArchive>();

/**
 * 감정 분석 결과 저장
 */
export async function saveEmotionAnalysis(
  userId: string,
  date: string,
  analysis: EmotionAnalysisResponse
): Promise<EmotionArchive | null> {
  const archive: EmotionArchive = {
    id: `${userId}-${date}`,
    userId,
    date,
    analysis,
    createdAt: new Date().toISOString(),
  };

  // Supabase 저장 시도
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    try {
      // userId가 UUID 형식인지 확인
      const actualUserId = userId.includes("-") && userId.length === 36 
        ? userId 
        : userId; // UUID가 아니면 그대로 사용 (추후 수정 필요)

      const { data, error } = await supabase
        .from("emotion_analyses")
        .upsert({
          user_id: actualUserId,
          date: date,
          emotion_wave: analysis.emotionWave,
          pattern_type: analysis.patternType,
          pattern_confidence: analysis.patternConfidence,
          behavior_correlations: analysis.behaviorCorrelations,
          language_pattern: analysis.languagePattern || null,
          ai_comment: analysis.aiComment,
          future_rhythm: analysis.futureRhythm,
          feedback: analysis.feedback,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "user_id,date",
        })
        .select()
        .single();

      if (!error && data) {
        console.log(`[emotionStore] 저장 성공: id=${data.id}, user_id=${actualUserId}, date=${date}`);
        
        // 감정 파형 포인트 저장
        if (analysis.emotionWave.points.length > 0) {
          // 기존 포인트 삭제
          const { error: deleteError } = await supabase
            .from("emotion_wave_points")
            .delete()
            .eq("analysis_id", data.id);

          if (deleteError) {
            console.warn(`[emotionStore] 기존 파형 포인트 삭제 오류:`, deleteError);
          }

          // 새 포인트 삽입
          const points = analysis.emotionWave.points.map(point => ({
            analysis_id: data.id,
            timestamp: point.timestamp,
            emotion: point.emotion,
            intensity: point.intensity,
            context: point.context || null,
          }));

          const { error: insertError } = await supabase
            .from("emotion_wave_points")
            .insert(points);

          if (insertError) {
            console.warn(`[emotionStore] 파형 포인트 삽입 오류:`, insertError);
          } else {
            console.log(`[emotionStore] 파형 포인트 ${points.length}개 저장 완료`);
          }
        }

        return {
          id: data.id,
          userId: actualUserId,
          date: data.date,
          analysis: {
            emotionWave: data.emotion_wave as any,
            patternType: data.pattern_type as any,
            patternConfidence: data.pattern_confidence,
            behaviorCorrelations: data.behavior_correlations as any,
            languagePattern: data.language_pattern as any,
            aiComment: data.ai_comment,
            futureRhythm: data.future_rhythm as any,
            feedback: data.feedback as any,
          },
          createdAt: data.created_at,
        };
      }
    } catch (error) {
      console.warn("Supabase save error, falling back to memory store:", error);
    }
  }

  // 메모리 저장소에 저장 (폴백)
  const key = `${userId}-${date}`;
  memoryStore.set(key, archive);
  return archive;
}

/**
 * 감정 분석 결과 조회
 */
export async function getEmotionAnalysis(
  userId: string,
  date: string
): Promise<EmotionArchive | null> {
  console.log(`[emotionStore] getEmotionAnalysis 호출: userId=${userId}, date=${date}`);
  
  // Supabase 조회 시도
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    try {
      const actualUserId = userId.includes("-") && userId.length === 36 
        ? userId 
        : userId;

      console.log(`[emotionStore] Supabase 조회 시도: user_id=${actualUserId}, date=${date}`);

      const { data, error } = await supabase
        .from("emotion_analyses")
        .select(`
          *,
          emotion_wave_points (*)
        `)
        .eq("user_id", actualUserId)
        .eq("date", date)
        .single();

      if (error) {
        // 406 에러는 "no rows returned"를 의미하므로 null 반환
        if (error.code === "PGRST116") {
          console.log(`[emotionStore] 분석 결과 없음 (PGRST116): user_id=${actualUserId}, date=${date}`);
          // 메모리 스토어도 확인
        } else {
          console.warn(`[emotionStore] Supabase 조회 오류:`, error);
          throw error;
        }
      } else if (data) {
        console.log(`[emotionStore] 분석 결과 발견: id=${data.id}`);
        
        // 감정 파형 포인트 조회
        const { data: points, error: pointsError } = await supabase
          .from("emotion_wave_points")
          .select("*")
          .eq("analysis_id", data.id)
          .order("timestamp", { ascending: true });

        if (pointsError) {
          console.warn(`[emotionStore] 파형 포인트 조회 오류:`, pointsError);
        }

        const result = {
          id: data.id,
          userId: actualUserId,
          date: data.date,
          analysis: {
            emotionWave: {
              date: data.date,
              points: points?.map((p: any) => ({
                timestamp: p.timestamp,
                emotion: p.emotion,
                intensity: p.intensity,
                context: p.context,
              })) || [],
              summary: (data.emotion_wave as any)?.summary || "",
            },
            patternType: data.pattern_type as any,
            patternConfidence: data.pattern_confidence,
            behaviorCorrelations: data.behavior_correlations as any,
            languagePattern: data.language_pattern as any,
            aiComment: data.ai_comment,
            futureRhythm: data.future_rhythm as any,
            feedback: data.feedback as any,
          },
          createdAt: data.created_at,
        };
        
        console.log(`[emotionStore] 분석 결과 반환 성공`);
        return result;
      }
    } catch (error: any) {
      console.warn(`[emotionStore] Supabase 조회 중 예외 발생:`, error.message);
      // 에러가 발생해도 메모리 스토어 확인 계속 진행
    }
  } else {
    console.log(`[emotionStore] Supabase 클라이언트 없음, 메모리 스토어 확인`);
  }

  // 메모리 저장소에서 조회 (폴백)
  const key = `${userId}-${date}`;
  const memoryResult = memoryStore.get(key);
  if (memoryResult) {
    console.log(`[emotionStore] 메모리 스토어에서 발견: key=${key}`);
    return memoryResult;
  }
  
  console.log(`[emotionStore] 분석 결과 없음: key=${key}`);
  return null;
}

/**
 * 기간별 감정 분석 조회
 */
export async function getEmotionAnalysesByPeriod(
  userId: string,
  startDate: string,
  endDate: string
): Promise<EmotionArchive[]> {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    try {
      const actualUserId = userId.includes("-") && userId.length === 36 
        ? userId 
        : userId;

      const { data, error } = await supabase
        .from("emotion_analyses")
        .select("*")
        .eq("user_id", actualUserId)
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: false });

      if (!error && data) {
        return data.map((item: any) => ({
          id: item.id,
          userId: actualUserId,
          date: item.date,
          analysis: {
            emotionWave: item.emotion_wave as any,
            patternType: item.pattern_type as any,
            patternConfidence: item.pattern_confidence,
            behaviorCorrelations: item.behavior_correlations as any,
            languagePattern: item.language_pattern as any,
            aiComment: item.ai_comment,
            futureRhythm: item.future_rhythm as any,
            feedback: item.feedback as any,
          },
          createdAt: item.created_at,
        }));
      }
    } catch (error) {
      console.warn("Supabase get period error:", error);
    }
  }

  // 메모리 저장소에서 조회 (폴백)
  const archives: EmotionArchive[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Array.from()을 사용하여 MapIterator를 배열로 변환
  for (const [key, archive] of Array.from(memoryStore.entries())) {
    if (key.startsWith(`${userId}-`)) {
      const archiveDate = new Date(archive.date);
      if (archiveDate >= start && archiveDate <= end) {
        archives.push(archive);
      }
    }
  }
  
  return archives.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
