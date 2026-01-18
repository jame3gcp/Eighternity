import { z } from "zod";

// 질문 카테고리 (프론트엔드와 API 모두 지원)
export const QuestionCategorySchema = z.enum([
  "love",      // 애정운
  "money",     // 재물운
  "work",      // 직업운
  "health",    // 건강운
  "move",      // 이동수
  "meeting",   // 만남
  "contact",   // 연락
]);

export type QuestionCategory = z.infer<typeof QuestionCategorySchema>;

// 질문 템플릿
export const QuestionTemplateSchema = z.object({
  id: z.string(),
  category: QuestionCategorySchema,
  question: z.string().min(1),
  icon: z.string().optional(),
});

export type QuestionTemplate = z.infer<typeof QuestionTemplateSchema>;

// 질문 요청
export const QuestionRequestSchema = z.object({
  category: QuestionCategorySchema.optional(),
  question: z.string().min(1).optional(),
  templateId: z.string().optional(),
}).refine(
  (data) => data.category || data.question || data.templateId,
  {
    message: "카테고리, 질문, 또는 템플릿 ID 중 하나는 필수입니다.",
  }
);

export type QuestionRequest = z.infer<typeof QuestionRequestSchema>;

// 3단계 답변 구조
export const QuestionAnswerSchema = z.object({
  summary: z.string().min(1),        // 요약 (한 문장)
  reasoning: z.string().min(1),      // 이유 (사주 기반 설명)
  actionPlan: z.string().min(1),      // 액션 플랜 (구체적 행동 제안)
  category: QuestionCategorySchema,
  confidence: z.number().min(0).max(100).optional(), // 답변 신뢰도
});

export type QuestionAnswer = z.infer<typeof QuestionAnswerSchema>;

// 질문 응답
export const QuestionResponseSchema = z.object({
  answer: QuestionAnswerSchema,
  timestamp: z.string().optional(),
});

export type QuestionResponse = z.infer<typeof QuestionResponseSchema>;
