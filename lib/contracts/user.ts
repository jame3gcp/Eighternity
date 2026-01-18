import { z } from "zod";

export const OnboardingRequestSchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형식이 아닙니다."),
  birthTime: z.string().nullable(),
  gender: z.enum(["M", "F", "O"]), // 필수로 변경
});

export type OnboardingRequest = z.infer<typeof OnboardingRequestSchema>;

export const FiveElementsSchema = z.object({
  wood: z.number().int().min(0).max(100),
  fire: z.number().int().min(0).max(100),
  earth: z.number().int().min(0).max(100),
  metal: z.number().int().min(0).max(100),
  water: z.number().int().min(0).max(100),
});

export type FiveElements = z.infer<typeof FiveElementsSchema>;

export const SajuPillarsSchema = z.object({
  year: z.string(),
  month: z.string(),
  day: z.string(),
  hour: z.string(),
});

export type SajuPillars = z.infer<typeof SajuPillarsSchema>;

export const UserSajuCookieSchema = z.object({
  birthDate: z.string(),
  birthTime: z.string().nullable(),
  gender: z.enum(["M", "F", "O"]).optional(),
  fiveElements: FiveElementsSchema,
  userId: z.string().optional(),
});

export type UserSajuCookie = z.infer<typeof UserSajuCookieSchema>;

export const TenGodsSchema = z.record(z.string(), z.number());

export const ProfileResponseSchema = z.object({
  fiveElements: FiveElementsSchema,
  pillars: SajuPillarsSchema,
  dayMaster: z.string().optional(),
  tenGods: TenGodsSchema.optional(),
  strengths: z.array(z.string()),
  cautions: z.array(z.string()),
});

export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;

export const OnboardingSuccessResponseSchema = z.object({
  success: z.literal(true),
  profile: ProfileResponseSchema,
});

export type OnboardingSuccessResponse = z.infer<typeof OnboardingSuccessResponseSchema>;

export const ErrorResponseSchema = z.object({
  error: z.string(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
