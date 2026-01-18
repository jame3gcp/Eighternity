/**
 * 프롬프트 모듈 통합
 * 모든 프롬프트를 한 곳에서 관리하고 조합
 */

import { MYEONGRI_SYSTEM_PROMPT } from "./system";
import { buildMyeongriPrompt, MYEONGRI_RESPONSE_FORMAT } from "./myeongri";
import { buildEmotionAnalysisPrompt, EMOTION_SYSTEM_PROMPT } from "./emotion";
import { combinePrompt, PromptConfig } from "./templates";
import { MyeongriAnalysisRequest } from "../openai";
import { EmotionAnalysisRequest } from "@/lib/contracts/emotion";
import { LifeLogRequest } from "@/lib/contracts/lifelog";

/**
 * 명리학 분석 프롬프트 생성
 */
export function createMyeongriPrompt(
  request: MyeongriAnalysisRequest
): PromptConfig {
  const userPrompt = buildMyeongriPrompt(request);
  const fullUserPrompt = combinePrompt(userPrompt, MYEONGRI_RESPONSE_FORMAT);

  return {
    systemPrompt: MYEONGRI_SYSTEM_PROMPT,
    userPrompt: fullUserPrompt,
    responseFormat: "json_object",
    temperature: 0.7,
    maxTokens: 8000, // 더 긴 응답을 위해 토큰 수 증가 (4000 -> 8000)
  };
}

/**
 * 감정 분석 프롬프트 생성
 */
export function createEmotionAnalysisPrompt(
  request: EmotionAnalysisRequest,
  lifeLogs: LifeLogRequest[],
  notes: string[]
): PromptConfig {
  const userPrompt = buildEmotionAnalysisPrompt(request, lifeLogs, notes);

  return {
    systemPrompt: EMOTION_SYSTEM_PROMPT,
    userPrompt: userPrompt,
    responseFormat: "json_object",
    temperature: 0.7,
  };
}

/**
 * 프롬프트 타입
 */
export type PromptType = "myeongri" | "emotion" | "fortune" | "career" | "custom";

/**
 * 프롬프트 팩토리
 * 추후 다른 프롬프트 타입 추가 시 확장 가능
 */
export function createPrompt(
  type: PromptType,
  data: any,
  ...args: any[]
): PromptConfig {
  switch (type) {
    case "myeongri":
      return createMyeongriPrompt(data as MyeongriAnalysisRequest);
    
    case "emotion":
      return createEmotionAnalysisPrompt(
        data as EmotionAnalysisRequest,
        args[0] as LifeLogRequest[],
        args[1] as string[]
      );
    
    // 추후 확장 가능
    // case "fortune":
    //   return createFortunePrompt(data);
    // case "career":
    //   return createCareerPrompt(data);
    
    default:
      throw new Error(`Unknown prompt type: ${type}`);
  }
}

// 시스템 프롬프트 export
export { MYEONGRI_SYSTEM_PROMPT, FORTUNE_SYSTEM_PROMPT, CAREER_SYSTEM_PROMPT } from "./system";

// 명리학 프롬프트 export
export { buildMyeongriPrompt, MYEONGRI_RESPONSE_FORMAT } from "./myeongri";

// 감정 분석 프롬프트 export
export { buildEmotionAnalysisPrompt, EMOTION_SYSTEM_PROMPT } from "./emotion";

// 질문 답변 프롬프트 export
export { getQuestionSystemPrompt, createQuestionPrompt, questionTemplates } from "./question";

// 템플릿 유틸리티 export
export { combinePrompt, replaceVariables, addSection } from "./templates";
