import { z } from "zod";

/**
 * 라이프 로그 데이터 스키마
 * 사용자의 실제 생활 데이터를 기록하여 사주와 결합한 추천을 제공합니다.
 */

export const MoodLevelSchema = z.enum(["excellent", "good", "normal", "bad", "terrible"]);
export type MoodLevel = z.infer<typeof MoodLevelSchema>;

export const ConditionLevelSchema = z.enum(["excellent", "good", "normal", "bad", "terrible"]);
export type ConditionLevel = z.infer<typeof ConditionLevelSchema>;

export const SleepQualitySchema = z.enum(["excellent", "good", "normal", "bad", "terrible"]);
export type SleepQuality = z.infer<typeof SleepQualitySchema>;

export const ScheduleIntensitySchema = z.enum(["very_busy", "busy", "normal", "light", "free"]);
export type ScheduleIntensity = z.infer<typeof ScheduleIntensitySchema>;

/**
 * 라이프 로그 입력 스키마
 */
export const LifeLogRequestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형식이 아닙니다."),
  mood: MoodLevelSchema,
  condition: ConditionLevelSchema,
  sleep: SleepQualitySchema,
  schedule: ScheduleIntensitySchema,
  notes: z.string().optional(), // 추가 메모
});

export type LifeLogRequest = z.infer<typeof LifeLogRequestSchema>;

/**
 * 라이프 로그 응답 스키마
 */
export const LifeLogResponseSchema = z.object({
  id: z.string().optional(),
  date: z.string(),
  mood: MoodLevelSchema,
  condition: ConditionLevelSchema,
  sleep: SleepQualitySchema,
  schedule: ScheduleIntensitySchema,
  notes: z.string().optional(),
  createdAt: z.string().optional(),
});

export type LifeLogResponse = z.infer<typeof LifeLogResponseSchema>;

/**
 * 하이브리드 추천 요청 스키마
 */
export const HybridRecommendationRequestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형식이 아닙니다.").optional(),
  includeLifeLog: z.boolean().default(true),
});

export type HybridRecommendationRequest = z.infer<typeof HybridRecommendationRequestSchema>;

/**
 * 하이브리드 추천 응답 스키마
 */
export const HybridRecommendationResponseSchema = z.object({
  // 사주 기반 운세
  sajuScore: z.number().int().min(0).max(100),
  sajuMessage: z.string(),
  
  // 라이프 로그 기반 분석
  lifeLogAnalysis: z.object({
    hasData: z.boolean(),
    riskFactors: z.array(z.string()), // 위험 요인
    positiveFactors: z.array(z.string()), // 긍정 요인
    overallCondition: z.enum(["excellent", "good", "normal", "bad", "terrible"]),
  }),
  
  // 결합된 추천
  hybridRecommendation: z.object({
    mainMessage: z.string(),
    recommend: z.string(),
    avoid: z.string(),
    priority: z.enum(["high", "medium", "low"]), // 추천 우선순위
    reasoning: z.string(), // 추천 이유
  }),
  
  // 도메인별 점수 (사주 + 라이프 로그 조정)
  adjustedScores: z.object({
    work: z.number().int().min(0).max(100),
    love: z.number().int().min(0).max(100),
    money: z.number().int().min(0).max(100),
    health: z.number().int().min(0).max(100),
  }),
});

export type HybridRecommendationResponse = z.infer<typeof HybridRecommendationResponseSchema>;
