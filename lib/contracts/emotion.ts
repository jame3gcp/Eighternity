/**
 * 감정 분석 데이터 스키마
 * AI 기반 감정 분석 및 패턴 모델링을 위한 타입 정의
 */

import { z } from "zod";

/**
 * 감정 타입
 */
export const EmotionTypeSchema = z.enum([
  "joy",        // 기쁨
  "sadness",    // 슬픔
  "anger",      // 분노
  "fear",       // 두려움
  "anxiety",    // 불안
  "calm",       // 평온
  "excitement", // 흥분
  "fatigue",    // 피로
  "focus",      // 집중
  "confusion",  // 혼란
  "satisfaction", // 만족
  "disappointment", // 실망
]);

export type EmotionType = z.infer<typeof EmotionTypeSchema>;

/**
 * 감정 강도 (0-100)
 */
export const EmotionIntensitySchema = z.number().int().min(0).max(100);

/**
 * 감정 파형 데이터 포인트
 */
export const EmotionWavePointSchema = z.object({
  timestamp: z.string(), // ISO 8601 형식
  emotion: EmotionTypeSchema,
  intensity: EmotionIntensitySchema,
  context: z.string().optional(), // 상황 설명
});

export type EmotionWavePoint = z.infer<typeof EmotionWavePointSchema>;

/**
 * 감정 파형 (시간별 감정 변화)
 */
export const EmotionWaveSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  points: z.array(EmotionWavePointSchema),
  summary: z.string(), // 하루 요약
});

export type EmotionWave = z.infer<typeof EmotionWaveSchema>;

/**
 * 패턴 분류 타입
 */
export const PatternTypeSchema = z.enum([
  "emotional",  // 정서형: 감정 변화가 크고 표현이 풍부
  "analytical", // 사고형: 논리적이고 분석적
  "avoidant",   // 회피형: 감정 회피 경향
  "immersive",  // 몰입형: 깊이 몰입하는 경향
  "empathetic", // 공감형: 타인 감정에 민감
]);

export type PatternType = z.infer<typeof PatternTypeSchema>;

/**
 * 행동 상관 매트릭스
 */
export const BehaviorCorrelationSchema = z.object({
  behavior: z.string(), // 행동 (예: "운동", "독서", "대화")
  emotion: EmotionTypeSchema,
  frequency: z.number().int().min(0), // 빈도
  correlation: z.number().min(-1).max(1), // 상관계수 (-1 ~ 1)
});

export type BehaviorCorrelation = z.infer<typeof BehaviorCorrelationSchema>;

/**
 * 언어 패턴 분석
 */
export const LanguagePatternSchema = z.object({
  tone: z.enum(["positive", "neutral", "negative", "mixed"]),
  sentiment: z.number().min(-1).max(1), // 감정 점수 (-1: 부정, 1: 긍정)
  keywords: z.array(z.string()), // 주요 키워드
  emotionClusters: z.array(z.object({
    emotion: EmotionTypeSchema,
    words: z.array(z.string()),
    weight: z.number().min(0).max(1),
  })),
});

export type LanguagePattern = z.infer<typeof LanguagePatternSchema>;

/**
 * 감정 분석 요청
 */
export const EmotionAnalysisRequestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // 특정 날짜 (없으면 오늘)
  period: z.enum(["day", "week", "month"]).optional().default("day"), // 분석 기간
  includeLifeLog: z.boolean().default(true),
  includeNotes: z.boolean().default(true),
});

export type EmotionAnalysisRequest = z.infer<typeof EmotionAnalysisRequestSchema>;

/**
 * 감정 분석 응답
 */
export const EmotionAnalysisResponseSchema = z.object({
  // 감정 파형
  emotionWave: EmotionWaveSchema,
  
  // 패턴 분류
  patternType: PatternTypeSchema,
  patternConfidence: z.number().min(0).max(1), // 패턴 일치도
  
  // 행동 상관 매트릭스
  behaviorCorrelations: z.array(BehaviorCorrelationSchema),
  
  // 언어 패턴
  languagePattern: LanguagePatternSchema.optional(),
  
  // AI 코멘트
  aiComment: z.string(),
  
  // 미래 리듬 예측
  futureRhythm: z.object({
    nextPhase: z.string(), // 다음 단계 예측 (예: "몰입기", "휴식기")
    predictedEmotions: z.array(z.object({
      emotion: EmotionTypeSchema,
      probability: z.number().min(0).max(1),
    })),
    recommendation: z.string(),
  }),
  
  // 조언 피드백
  feedback: z.object({
    insights: z.array(z.string()), // 인사이트
    suggestions: z.array(z.string()), // 제안
    growthDirection: z.string(), // 성장 방향
  }),
});

export type EmotionAnalysisResponse = z.infer<typeof EmotionAnalysisResponseSchema>;

/**
 * 감정 아카이브 (저장용)
 */
export const EmotionArchiveSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  analysis: EmotionAnalysisResponseSchema,
  createdAt: z.string().optional(),
});

export type EmotionArchive = z.infer<typeof EmotionArchiveSchema>;

/**
 * 패턴 추적기 응답 (주/월 단위)
 */
export const PatternTrackerResponseSchema = z.object({
  period: z.enum(["week", "month"]),
  startDate: z.string(),
  endDate: z.string(),
  trends: z.array(z.object({
    date: z.string(),
    dominantEmotion: EmotionTypeSchema,
    averageIntensity: z.number().min(0).max(100),
    patternType: PatternTypeSchema,
  })),
  summary: z.string(),
  insights: z.array(z.string()),
});

export type PatternTrackerResponse = z.infer<typeof PatternTrackerResponseSchema>;
