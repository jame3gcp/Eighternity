/**
 * OpenAI API 클라이언트
 * 명리학 분석을 위한 AI 연동
 */

// 동적 import로 패키지 로드 (패키지가 없어도 빌드 실패 방지)
let openaiClient: any = null;
let isInitialized = false;

async function initializeOpenAI() {
  if (isInitialized) return;
  isInitialized = true;

  try {
    // 서버 사이드에서만 동적 import
    if (typeof window === "undefined") {
      console.log("🔍 OpenAI 초기화 시작...");
      
      // @ts-ignore - 패키지가 설치되지 않았을 수 있음
      let OpenAI;
      try {
        const openaiModule = await import("openai");
        console.log("✅ openai 패키지 로드 성공");
        
        // openai v4+ 버전에서는 default export를 사용
        // v3 이하에서는 named export OpenAI를 사용
        OpenAI = openaiModule.default || openaiModule.OpenAI;
        
        if (!OpenAI) {
          console.error("❌ OpenAI 클래스를 찾을 수 없습니다.");
          console.log("💡 openai 패키지 버전을 확인하세요. v4 이상이 필요합니다.");
          openaiClient = null;
          return;
        }
      } catch (importError: any) {
        console.error("❌ openai 패키지 로드 실패:", importError.message);
        console.log("💡 다음 명령어로 설치하세요: npm install openai");
        openaiClient = null;
        return;
      }

      const apiKey = process.env.OPENAI_API_KEY;
      
      if (!apiKey) {
        console.error("❌ OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.");
        console.log("💡 .env.local 파일에 OPENAI_API_KEY=sk-... 형식으로 추가하세요.");
        console.log("💡 개발 서버를 재시작해야 환경 변수가 적용됩니다.");
        openaiClient = null;
        return;
      }

      if (apiKey.length < 10) {
        console.error("❌ OPENAI_API_KEY가 너무 짧습니다. 올바른 키인지 확인하세요.");
        openaiClient = null;
        return;
      }

      console.log("✅ OPENAI_API_KEY 발견 (길이:", apiKey.length, "자)");
      
      try {
        openaiClient = new OpenAI({
          apiKey: apiKey,
        });
      } catch (constructorError: any) {
        console.error("❌ OpenAI 클라이언트 생성 실패:", constructorError.message);
        openaiClient = null;
        return;
      }
      
      console.log("✅ OpenAI 클라이언트 생성 완료");
    }
  } catch (error: any) {
    console.error("❌ OpenAI 초기화 오류:", error.message);
    openaiClient = null;
  }
}

/**
 * OpenAI 클라이언트 가져오기
 */
export async function getOpenAIClient() {
  await initializeOpenAI();
  
  if (!openaiClient) {
    console.warn("⚠️ OpenAI client is null. 초기화를 다시 시도합니다...");
    // 한 번 더 시도
    isInitialized = false;
    await initializeOpenAI();
  }
  
  return openaiClient;
}

/**
 * 명리학 분석 요청
 */
export interface MyeongriAnalysisRequest {
  birthDate: string; // YYYY-MM-DD
  birthTime: string | null; // HH:mm
  gender: "M" | "F" | "O";
  pillars: {
    year: string; // 연주 (예: "甲子")
    month: string; // 월주
    day: string; // 일주
    hour: string; // 시주
  };
  fiveElements: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  dayMaster: string; // 일간 (예: "甲")
  tenGods?: Record<string, number>; // 십성 분석 결과
  relationships?: {
    conflicts: Array<{ pillar: string; type: string }>;
    combinations: Array<{ pillars: string[]; type: string }>;
    punishments: Array<{ pillars: string[]; type: string }>;
    harms: Array<{ pillars: string[]; type: string }>;
  };
  daeun?: Array<{ age: string; pillar: string; startYear: number }>;
  seun?: Array<{ year: number; pillar: string }>;
}

export interface MyeongriAnalysisResponse {
  // 1. 사주 기본 구성
  pillars: {
    year: { gan: string; zhi: string; explanation: string };
    month: { gan: string; zhi: string; explanation: string };
    day: { gan: string; zhi: string; explanation: string };
    hour: { gan: string; zhi: string; explanation: string };
  };
  
  // 2. 오행 분포
  fiveElements: {
    distribution: { wood: number; fire: number; earth: number; metal: number; water: number };
    balance: string; // 균형 상태 설명
    dominant: string[]; // 우세한 오행
    weak: string[]; // 약한 오행
    detailedAnalysis?: {
      wood?: string;
      fire?: string;
      earth?: string;
      metal?: string;
      water?: string;
    };
  };
  
  // 3. 십성의 흐름
  tenGods: {
    distribution: Record<string, number>;
    characteristics: Record<string, string>; // 각 십성의 특성
    flow: string; // 십성 흐름 설명
  };
  
  // 4. 형충회합
  relationships: {
    conflicts: Array<{ pillar: string; type: string; explanation: string }>; // 충(沖)
    combinations: Array<{ pillars: string[]; type: string; explanation: string }>; // 합(合)
    punishments: Array<{ pillars: string[]; type: string; explanation: string }>; // 형(刑)
    harms: Array<{ pillars: string[]; type: string; explanation: string }>; // 해(害)
  };
  
  // 5. 대운·세운의 흐름
  luck: {
    daeun: Array<{ age: string; pillar: string; explanation: string }>; // 대운
    seun: Array<{ year: number; pillar: string; explanation: string }>; // 세운 (최근 10년)
    current: { daeun: string; seun: string; overall: string }; // 현재 운세
  };
  
  // 6. 종합 분석
  analysis: {
    personality: string; // 성격
    career: string; // 직업
    wealth: string; // 재물
    health: string; // 건강
    relationships: string; // 인연
  };
  
  // 전체 요약
  summary: string;
}

/**
 * OpenAI를 사용한 명리학 분석
 */
export async function analyzeMyeongri(
  request: MyeongriAnalysisRequest
): Promise<MyeongriAnalysisResponse | null> {
  const client = await getOpenAIClient();
  
  if (!client) {
    console.warn("OpenAI client not available - check OPENAI_API_KEY and openai package");
    return null;
  }

  console.log("✅ OpenAI client initialized, starting analysis...");
  console.log("📋 전달할 사주 값:", {
    year: request.pillars.year,
    month: request.pillars.month,
    day: request.pillars.day,
    hour: request.pillars.hour,
    dayMaster: request.dayMaster,
  });

  // 프롬프트는 별도 모듈에서 관리
  const { createMyeongriPrompt } = await import("./prompts");
  const promptConfig = createMyeongriPrompt(request);
  
  const systemPrompt = promptConfig.systemPrompt;
  const userPrompt = promptConfig.userPrompt;
  
  // 디버깅: 전체 프롬프트 확인
  console.log("📝 시스템 프롬프트 길이:", systemPrompt.length);
  console.log("📝 사용자 프롬프트 길이:", userPrompt.length);
  console.log("📝 사용자 프롬프트 (사주 구성 부분):");
  const sajuSectionStart = userPrompt.indexOf("**사주 구성");
  const sajuSectionEnd = userPrompt.indexOf("**오행 분포");
  if (sajuSectionStart >= 0 && sajuSectionEnd >= 0) {
    console.log(userPrompt.substring(sajuSectionStart, sajuSectionEnd));
  } else {
    console.log("⚠️ 사주 구성 섹션을 찾을 수 없습니다");
    console.log("📝 전체 사용자 프롬프트 (처음 1000자):");
    console.log(userPrompt.substring(0, 1000));
  }
  
  // 실제 전송될 메시지 확인
  console.log("📤 실제 전송될 메시지 구조:");
  console.log("  - system:", systemPrompt.substring(0, 200) + "...");
  console.log("  - user (사주 부분):", userPrompt.substring(sajuSectionStart >= 0 ? sajuSectionStart : 0, (sajuSectionStart >= 0 ? sajuSectionStart : 0) + 500));

  try {
    console.log("📤 OpenAI API 요청 전송 중...");
    const completion = await client.chat.completions.create({
      model: "gpt-4o", // GPT-4o 모델 사용
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: promptConfig.temperature ?? 0.7,
      max_tokens: promptConfig.maxTokens ?? 8000, // 명시적으로 설정 (기본값 8000)
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      console.warn("⚠️ OpenAI 응답이 비어있습니다");
      return null;
    }

    console.log("📥 OpenAI 응답 수신 완료");
    console.log("📋 응답 길이:", content.length);
    
    // JSON 파싱 시도
    let parsed: MyeongriAnalysisResponse;
    try {
      parsed = JSON.parse(content) as MyeongriAnalysisResponse;
      console.log("✅ JSON 파싱 완료");
    } catch (parseError: any) {
      console.error("❌ JSON 파싱 오류:", parseError.message);
      
      // 오류 위치 확인
      if (parseError.message.includes("position")) {
        const positionMatch = parseError.message.match(/position (\d+)/);
        if (positionMatch) {
          const position = parseInt(positionMatch[1]);
          const start = Math.max(0, position - 100);
          const end = Math.min(content.length, position + 100);
          console.error("📋 오류 위치 주변 내용:");
          console.error(content.substring(start, end));
        }
      }
      
      // JSON 수정 시도
      try {
        // 마크다운 코드 블록 제거 (있는 경우)
        let fixedContent = content.trim();
        if (fixedContent.startsWith("```json")) {
          fixedContent = fixedContent.replace(/^```json\s*/i, "").replace(/\s*```$/i, "");
        } else if (fixedContent.startsWith("```")) {
          fixedContent = fixedContent.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }
        
        // JSON 문자열 내부의 이스케이프되지 않은 특수 문자 처리
        // 더 안전한 방법: 정규식으로 문자열 내부의 줄바꿈과 따옴표 처리
        // JSON 문자열 패턴: "..." 내부의 내용만 처리
        fixedContent = fixedContent.replace(/"([^"\\]|\\.)*"/g, (match: string) => {
          // 이미 이스케이프된 문자는 그대로 유지
          // 줄바꿈, 캐리지 리턴, 탭을 이스케이프
          return match
            .replace(/([^\\])\n/g, '$1\\n')
            .replace(/([^\\])\r/g, '$1\\r')
            .replace(/([^\\])\t/g, '$1\\t');
        });
        
        parsed = JSON.parse(fixedContent) as MyeongriAnalysisResponse;
        console.log("✅ JSON 수정 후 파싱 성공");
      } catch (fixError: any) {
        console.error("❌ JSON 수정 후에도 파싱 실패:", fixError.message);
        
        // 오류 위치 확인
        if (fixError.message.includes("position")) {
          const positionMatch = fixError.message.match(/position (\d+)/);
          if (positionMatch) {
            const position = parseInt(positionMatch[1]);
            const start = Math.max(0, position - 300);
            const end = Math.min(content.length, position + 300);
            console.error("📋 오류 위치 주변 내용:");
            console.error("위치:", position, "번째 문자");
            console.error("주변 내용:");
            console.error(content.substring(start, end));
            console.error("\n오류 위치 표시: " + " ".repeat(Math.min(300, position - start)) + "^");
          }
        }
        
        // 응답의 구조 확인
        console.error("📋 응답 처음 500자:");
        console.error(content.substring(0, 500));
        console.error("\n📋 응답 마지막 500자:");
        console.error(content.substring(Math.max(0, content.length - 500)));
        
        // JSON 형식 검증 및 복구 시도
        try {
          // 첫 번째 { 찾기
          const firstBrace = content.indexOf('{');
          const lastBrace = content.lastIndexOf('}');
          if (firstBrace >= 0 && lastBrace > firstBrace) {
            let jsonPart = content.substring(firstBrace, lastBrace + 1);
            console.error("📋 추출된 JSON 부분 길이:", jsonPart.length);
            
            // JSON 복구 시도: 불완전한 배열이나 객체 닫기
            try {
              parsed = JSON.parse(jsonPart) as MyeongriAnalysisResponse;
              console.log("✅ JSON 부분 추출 후 파싱 성공");
            } catch (recoverError: any) {
              console.error("📋 JSON 복구 시도 중...");
              
              // 배열이나 객체가 닫히지 않은 경우 복구
              let openBraces = 0;
              let openBrackets = 0;
              let inString = false;
              let escaped = false;
              
              for (let i = 0; i < jsonPart.length; i++) {
                const char = jsonPart[i];
                const prevChar = i > 0 ? jsonPart[i - 1] : '';
                
                if (prevChar === '\\' && !escaped) {
                  escaped = true;
                  continue;
                } else {
                  escaped = false;
                }
                
                if (char === '"' && !escaped) {
                  inString = !inString;
                } else if (!inString) {
                  if (char === '{') openBraces++;
                  else if (char === '}') openBraces--;
                  else if (char === '[') openBrackets++;
                  else if (char === ']') openBrackets--;
                }
              }
              
              // 닫히지 않은 배열이나 객체 닫기
              if (openBrackets > 0) {
                jsonPart += ']'.repeat(openBrackets);
                console.log("📋 닫히지 않은 배열 닫기:", openBrackets, "개");
              }
              if (openBraces > 0) {
                jsonPart += '}'.repeat(openBraces);
                console.log("📋 닫히지 않은 객체 닫기:", openBraces, "개");
              }
              
              // 마지막 쉼표 제거 (잘못된 쉼표) - 여러 번 실행
              jsonPart = jsonPart.replace(/,(\s*[}\]])/g, '$1');
              
              // 배열이나 객체 내부의 잘못된 쉼표 제거
              // 예: [1, 2, ] -> [1, 2]
              jsonPart = jsonPart.replace(/,(\s*[}\]])/g, '$1');
              
              // 문자열 내부가 아닌 곳의 연속된 쉼표 제거
              jsonPart = jsonPart.replace(/,(\s*,)/g, ',');
              
              try {
                parsed = JSON.parse(jsonPart) as MyeongriAnalysisResponse;
                console.log("✅ JSON 복구 후 파싱 성공");
              } catch (finalError: any) {
                console.error("❌ JSON 복구 후에도 파싱 실패:", finalError.message);
                
                // 오류 위치 확인
                if (finalError.message.includes("position")) {
                  const positionMatch = finalError.message.match(/position (\d+)/);
                  if (positionMatch) {
                    const position = parseInt(positionMatch[1]);
                    const start = Math.max(0, position - 300);
                    const end = Math.min(jsonPart.length, position + 300);
                    console.error("📋 복구된 JSON의 오류 위치 주변:");
                    console.error(jsonPart.substring(start, end));
                    console.error("\n오류 위치 표시: " + " ".repeat(Math.min(300, position - start)) + "^");
                    
                    // 오류 위치 주변의 구조 확인
                    const beforeError = jsonPart.substring(Math.max(0, position - 50), position);
                    const afterError = jsonPart.substring(position, Math.min(jsonPart.length, position + 50));
                    console.error("📋 오류 직전:", beforeError);
                    console.error("📋 오류 직후:", afterError);
                  }
                }
                
                // 최종 시도: 응답이 잘렸는지 확인
                if (completion.choices[0]?.finish_reason === "length") {
                  console.error("⚠️ 응답이 max_tokens 제한으로 인해 잘렸습니다.");
                  console.error("💡 max_tokens를 더 늘리거나 프롬프트를 단축하세요.");
                }
                
                return null;
              }
            }
          } else {
            throw new Error("JSON 구조를 찾을 수 없습니다");
          }
        } catch (extractError: any) {
          console.error("❌ JSON 부분 추출도 실패:", extractError.message);
          return null;
        }
      }
    }
    
    // 응답의 사주 값 확인
    console.log("📋 응답된 사주 값:");
    console.log("  - year:", parsed.pillars.year.gan + parsed.pillars.year.zhi);
    console.log("  - month:", parsed.pillars.month.gan + parsed.pillars.month.zhi);
    console.log("  - day:", parsed.pillars.day.gan + parsed.pillars.day.zhi);
    console.log("  - hour:", parsed.pillars.hour.gan + parsed.pillars.hour.zhi);
    
    // 계산된 값과 비교
    const expectedYear = request.pillars.year;
    const expectedMonth = request.pillars.month;
    const expectedDay = request.pillars.day;
    const expectedHour = request.pillars.hour || "未知";
    
    const actualYear = parsed.pillars.year.gan + parsed.pillars.year.zhi;
    const actualMonth = parsed.pillars.month.gan + parsed.pillars.month.zhi;
    const actualDay = parsed.pillars.day.gan + parsed.pillars.day.zhi;
    const actualHour = parsed.pillars.hour.gan + parsed.pillars.hour.zhi;
    
    console.log("🔍 값 비교:");
    console.log("  - 연주:", expectedYear === actualYear ? "✅ 일치" : `❌ 불일치 (예상: ${expectedYear}, 실제: ${actualYear})`);
    console.log("  - 월주:", expectedMonth === actualMonth ? "✅ 일치" : `❌ 불일치 (예상: ${expectedMonth}, 실제: ${actualMonth})`);
    console.log("  - 일주:", expectedDay === actualDay ? "✅ 일치" : `❌ 불일치 (예상: ${expectedDay}, 실제: ${actualDay})`);
    if (expectedHour !== "未知") {
      console.log("  - 시주:", expectedHour === actualHour ? "✅ 일치" : `❌ 불일치 (예상: ${expectedHour}, 실제: ${actualHour})`);
    }
    
    return parsed;
  } catch (error: any) {
    console.error("❌ OpenAI API 오류:", error.message);
    if (error.status === 401) {
      console.error("💡 API 키가 유효하지 않습니다. OPENAI_API_KEY를 확인하세요.");
    } else if (error.status === 429) {
      console.error("💡 Rate limit 초과. 잠시 후 다시 시도하세요.");
    }
    return null;
  }
}

/**
 * 감정 분석 인터페이스
 */
import { EmotionAnalysisRequest, EmotionAnalysisResponse } from "@/lib/contracts/emotion";
import { LifeLogRequest } from "@/lib/contracts/lifelog";
import { QuestionCategory, QuestionAnswer } from "@/lib/contracts/question";
import { FiveElements, SajuPillars } from "@/lib/contracts/user";

/**
 * OpenAI를 사용한 감정 분석
 */
export async function analyzeEmotion(
  request: EmotionAnalysisRequest,
  lifeLogs: LifeLogRequest[],
  notes: string[]
): Promise<EmotionAnalysisResponse | null> {
  const client = await getOpenAIClient();
  
  if (!client) {
    console.warn("OpenAI client not available - check OPENAI_API_KEY and openai package");
    return null;
  }

  console.log("✅ OpenAI client initialized, starting emotion analysis...");
  console.log("📋 분석 요청:", {
    date: request.date,
    period: request.period,
    lifeLogsCount: lifeLogs.length,
    notesCount: notes.length,
  });

  // 프롬프트 생성
  const { createEmotionAnalysisPrompt } = await import("./prompts");
  const promptConfig = createEmotionAnalysisPrompt(request, lifeLogs, notes);
  
  const systemPrompt = promptConfig.systemPrompt;
  const userPrompt = promptConfig.userPrompt;

  try {
    console.log("📤 OpenAI API 요청 전송 중 (감정 분석)...");
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: promptConfig.temperature ?? 0.7,
      max_tokens: promptConfig.maxTokens ?? 8000, // 명시적으로 설정 (기본값 8000)
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      console.warn("⚠️ OpenAI 응답이 비어있습니다");
      return null;
    }

    console.log("📥 OpenAI 응답 수신 완료 (감정 분석)");
    const parsed = JSON.parse(content) as EmotionAnalysisResponse;
    console.log("✅ JSON 파싱 완료");
    console.log("📊 분석 결과 요약:");
    console.log("  - 패턴 타입:", parsed.patternType);
    console.log("  - 패턴 신뢰도:", parsed.patternConfidence);
    console.log("  - 감정 파형 포인트 수:", parsed.emotionWave.points.length);
    
    return parsed;
  } catch (error: any) {
    console.error("❌ OpenAI API 오류 (감정 분석):", error.message);
    if (error.status === 401) {
      console.error("💡 API 키가 유효하지 않습니다. OPENAI_API_KEY를 확인하세요.");
    } else if (error.status === 429) {
      console.error("💡 Rate limit 초과. 잠시 후 다시 시도하세요.");
    }
    return null;
  }
}

/**
 * 질문 답변 인터페이스
 */
export interface QuestionAnalysisRequest {
  category?: QuestionCategory;
  question?: string;
  sajuInfo?: {
    pillars?: SajuPillars;
    fiveElements?: FiveElements;
    dayMaster?: string;
    tenGods?: Record<string, number>;
  };
}

/**
 * OpenAI를 사용한 질문 답변
 */
export async function analyzeQuestion(
  request: QuestionAnalysisRequest
): Promise<QuestionAnswer | null> {
  const client = await getOpenAIClient();
  
  if (!client) {
    console.warn("OpenAI client not available - check OPENAI_API_KEY and openai package");
    return null;
  }

  console.log("✅ OpenAI client initialized, starting question analysis...");
  console.log("📋 질문 요청:", {
    category: request.category,
    question: request.question,
    hasSajuInfo: !!request.sajuInfo,
  });

  // 프롬프트 생성
  const { getQuestionSystemPrompt, createQuestionPrompt } = await import("./prompts/question");
  const systemPrompt = getQuestionSystemPrompt();
  const userPrompt = createQuestionPrompt(
    request.category || "love",
    request.question,
    request.sajuInfo
  );

  try {
    console.log("📤 OpenAI API 요청 전송 중 (질문 답변)...");
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      console.warn("⚠️ OpenAI 응답이 비어있습니다");
      return null;
    }

    console.log("📥 OpenAI 응답 수신 완료 (질문 답변)");
    
    // JSON 파싱 시도
    let parsed: QuestionAnswer;
    try {
      parsed = JSON.parse(content) as QuestionAnswer;
      console.log("✅ JSON 파싱 완료");
    } catch (parseError: any) {
      console.error("❌ JSON 파싱 오류:", parseError.message);
      
      // 마크다운 코드 블록 제거 시도
      try {
        let fixedContent = content.trim();
        if (fixedContent.startsWith("```json")) {
          fixedContent = fixedContent.replace(/^```json\s*/i, "").replace(/\s*```$/i, "");
        } else if (fixedContent.startsWith("```")) {
          fixedContent = fixedContent.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }
        parsed = JSON.parse(fixedContent) as QuestionAnswer;
        console.log("✅ JSON 수정 후 파싱 성공");
      } catch (fixError: any) {
        console.error("❌ JSON 수정도 실패:", fixError.message);
        return null;
      }
    }
    
    // 카테고리 설정
    if (!parsed.category && request.category) {
      parsed.category = request.category;
    }
    
    console.log("📊 답변 결과 요약:");
    console.log("  - 요약:", parsed.summary);
    console.log("  - 카테고리:", parsed.category);
    console.log("  - 신뢰도:", parsed.confidence);
    
    return parsed;
  } catch (error: any) {
    console.error("❌ OpenAI API 오류 (질문 답변):", error.message);
    if (error.status === 401) {
      console.error("💡 API 키가 유효하지 않습니다. OPENAI_API_KEY를 확인하세요.");
    } else if (error.status === 429) {
      console.error("💡 Rate limit 초과. 잠시 후 다시 시도하세요.");
    }
    return null;
  }
}
