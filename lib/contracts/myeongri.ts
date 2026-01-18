/**
 * 명리학 분석 관련 스키마
 */

import { z } from "zod";

// 사주 주(柱) 상세 정보
export const PillarDetailSchema = z.object({
  gan: z.string(), // 천간
  zhi: z.string(), // 지지
  explanation: z.string(), // 설명
});

// 사주 기본 구성
export const PillarsDetailSchema = z.object({
  year: PillarDetailSchema,
  month: PillarDetailSchema,
  day: PillarDetailSchema,
  hour: PillarDetailSchema,
});

// 오행 분포 상세
export const FiveElementsDetailSchema = z.object({
  distribution: z.object({
    wood: z.number(),
    fire: z.number(),
    earth: z.number(),
    metal: z.number(),
    water: z.number(),
  }),
  balance: z.string(),
  dominant: z.array(z.string()),
  weak: z.array(z.string()),
});

// 십성 상세
export const TenGodsDetailSchema = z.object({
  distribution: z.record(z.number()),
  characteristics: z.record(z.string()),
  flow: z.string(),
});

// 형충회합 관계
export const RelationshipSchema = z.object({
  pillar: z.string().optional(),
  pillars: z.array(z.string()).optional(),
  type: z.string(),
  explanation: z.string(),
});

export const RelationshipsSchema = z.object({
  conflicts: z.array(RelationshipSchema),
  combinations: z.array(RelationshipSchema),
  punishments: z.array(RelationshipSchema),
  harms: z.array(RelationshipSchema),
});

// 대운·세운
export const LuckPeriodSchema = z.object({
  age: z.string().optional(),
  year: z.number().optional(),
  pillar: z.string(),
  explanation: z.string(),
});

export const LuckSchema = z.object({
  daeun: z.array(LuckPeriodSchema),
  seun: z.array(LuckPeriodSchema),
  current: z.object({
    daeun: z.string(),
    seun: z.string(),
    overall: z.string(),
  }),
});

// 종합 분석
export const AnalysisSchema = z.object({
  personality: z.string(),
  career: z.string(),
  wealth: z.string(),
  health: z.string(),
  relationships: z.string(),
});

// 전체 명리학 분석 응답
export const MyeongriAnalysisResponseSchema = z.object({
  pillars: PillarsDetailSchema,
  fiveElements: FiveElementsDetailSchema,
  tenGods: TenGodsDetailSchema,
  relationships: RelationshipsSchema,
  luck: LuckSchema,
  analysis: AnalysisSchema,
  summary: z.string(),
});

export type MyeongriAnalysisResponse = z.infer<typeof MyeongriAnalysisResponseSchema>;
export type PillarDetail = z.infer<typeof PillarDetailSchema>;
export type FiveElementsDetail = z.infer<typeof FiveElementsDetailSchema>;
export type TenGodsDetail = z.infer<typeof TenGodsDetailSchema>;
export type Relationships = z.infer<typeof RelationshipsSchema>;
export type Luck = z.infer<typeof LuckSchema>;
export type Analysis = z.infer<typeof AnalysisSchema>;
