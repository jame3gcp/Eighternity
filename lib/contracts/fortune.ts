import { z } from "zod";

export const FortuneLevelSchema = z.enum(["good", "normal", "bad"]);
export type FortuneLevel = z.infer<typeof FortuneLevelSchema>;

export const QuestionCategorySchema = z.enum(["meeting", "love", "money", "contact", "move"]);
export type QuestionCategory = z.infer<typeof QuestionCategorySchema>;

export const FortuneScoreSchema = z.number().int().min(0).max(100);
export type FortuneScore = z.infer<typeof FortuneScoreSchema>;

export const TodayFortuneResponseSchema = z.object({
  globalScore: FortuneScoreSchema,
  work: FortuneScoreSchema,
  love: FortuneScoreSchema,
  money: FortuneScoreSchema,
  health: FortuneScoreSchema,
  mainMessage: z.string().min(1),
  recommend: z.string().min(1),
  avoid: z.string().min(1),
});

export type TodayFortuneResponse = z.infer<typeof TodayFortuneResponseSchema>;

export const QuestionResponseSchema = z.object({
  answer: z.string().min(1),
});

export type QuestionResponse = z.infer<typeof QuestionResponseSchema>;

export const CalendarFortuneItemSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형식이 아닙니다."),
  level: FortuneLevelSchema,
});

export type CalendarFortuneItem = z.infer<typeof CalendarFortuneItemSchema>;

export const CalendarFortuneResponseSchema = z.object({
  items: z.array(CalendarFortuneItemSchema).min(1),
});

export type CalendarFortuneResponse = z.infer<typeof CalendarFortuneResponseSchema>;

export const QuestionRequestSchema = z.object({
  category: QuestionCategorySchema,
});

export type QuestionRequest = z.infer<typeof QuestionRequestSchema>;
