/**
 * 프롬프트 템플릿 유틸리티
 * 프롬프트를 조합하고 커스터마이징하는 유틸리티 함수
 */

export interface PromptConfig {
  systemPrompt: string;
  userPrompt: string;
  responseFormat?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * 프롬프트 조합
 * userPrompt와 responseFormat을 결합합니다.
 */
export function combinePrompt(
  userPrompt: string,
  responseFormat: string
): string {
  return userPrompt + "\n\n" + responseFormat;
}

/**
 * 프롬프트에 변수 치환
 */
export function replaceVariables(
  template: string,
  variables: Record<string, string | number>
): string {
  let result = template;
  
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(regex, String(value));
  }
  
  return result;
}

/**
 * 프롬프트 섹션 추가
 */
export function addSection(
  prompt: string,
  sectionTitle: string,
  sectionContent: string
): string {
  return `${prompt}\n\n**${sectionTitle}**\n${sectionContent}`;
}
