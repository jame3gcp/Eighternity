import { QuestionCategory } from "@/lib/contracts/question";
import { FiveElements } from "@/lib/contracts/user";
import { SajuPillars } from "@/lib/contracts/user";

/**
 * 질문 답변을 위한 시스템 프롬프트
 */
export function getQuestionSystemPrompt(): string {
  return `당신은 명리학(사주명리학) 전문가이자 현명한 조언자입니다. 사용자의 사주 정보를 바탕으로 개인화된 답변을 제공합니다.

## 역할과 원칙
1. **사주 기반 분석**: 사용자의 사주(오행, 십성, 기운)를 정확히 분석하여 답변합니다.
2. **긍정적이고 실용적인 조언**: 운명론적 공포를 주지 않고, 구체적이고 실현 가능한 행동을 제안합니다.
3. **3단계 구조**: 모든 답변은 요약 - 이유 - 액션 플랜으로 구성됩니다.
4. **개인화**: 제공된 사주 정보를 반드시 활용하여 개인 맞춤형 답변을 제공합니다.

## 답변 형식
다음 JSON 형식으로 답변하세요:
{
  "summary": "한 문장 요약 (20-30자)",
  "reasoning": "사주 기반 이유 설명 (100-150자)",
  "actionPlan": "구체적 행동 제안 (80-120자)",
  "confidence": 0-100 사이의 숫자
}

## 주의사항
- 제공된 사주 정보(오행, 십성, 기운)를 정확히 반영하세요.
- 불안을 조장하는 표현은 피하고, 선택권과 가능성을 강조하세요.
- 구체적이고 실현 가능한 행동을 제안하세요.
- 사주 정보가 없으면 일반적인 조언을 제공하되, 사주 기반 분석임을 명시하세요.`;
}

/**
 * 질문 답변을 위한 사용자 프롬프트 생성
 */
export function createQuestionPrompt(
  category: QuestionCategory,
  question?: string,
  sajuInfo?: {
    pillars?: SajuPillars;
    fiveElements?: FiveElements;
    dayMaster?: string;
    tenGods?: Record<string, number>;
  }
): string {
  const categoryNames: Record<QuestionCategory, string> = {
    love: "애정운",
    money: "재물운",
    work: "직업운",
    health: "건강운",
    move: "이동수",
    meeting: "만남",
    contact: "연락",
  };

  let prompt = `다음 질문에 대해 명리학 기반으로 답변해주세요.\n\n`;
  
  if (question) {
    prompt += `**질문**: ${question}\n\n`;
  } else {
    prompt += `**카테고리**: ${categoryNames[category]}\n\n`;
  }

  if (sajuInfo) {
    prompt += `## 사용자 사주 정보\n\n`;
    
    if (sajuInfo.pillars) {
      // pillars가 객체인 경우 (SajuPillars 타입)
      const pillars = sajuInfo.pillars;
      const yearPillar = typeof pillars.year === 'string' ? pillars.year : `${pillars.year}`;
      const monthPillar = typeof pillars.month === 'string' ? pillars.month : `${pillars.month}`;
      const dayPillar = typeof pillars.day === 'string' ? pillars.day : `${pillars.day}`;
      const hourPillar = typeof pillars.hour === 'string' ? pillars.hour : `${pillars.hour}`;
      prompt += `**사주**: ${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}\n`;
    }
    
    if (sajuInfo.dayMaster) {
      prompt += `**일간**: ${sajuInfo.dayMaster}\n`;
    }
    
    if (sajuInfo.fiveElements) {
      prompt += `**오행 분포**:\n`;
      prompt += `- 목(木): ${sajuInfo.fiveElements.wood}%\n`;
      prompt += `- 화(火): ${sajuInfo.fiveElements.fire}%\n`;
      prompt += `- 토(土): ${sajuInfo.fiveElements.earth}%\n`;
      prompt += `- 금(金): ${sajuInfo.fiveElements.metal}%\n`;
      prompt += `- 수(水): ${sajuInfo.fiveElements.water}%\n\n`;
    }
    
    if (sajuInfo.tenGods && Object.keys(sajuInfo.tenGods).length > 0) {
      prompt += `**십성**: ${Object.entries(sajuInfo.tenGods)
        .map(([name, count]) => `${name}(${count})`)
        .join(", ")}\n\n`;
    }
    
    prompt += `위 사주 정보를 바탕으로 개인화된 답변을 제공해주세요.\n\n`;
  } else {
    prompt += `사주 정보가 제공되지 않았습니다. 일반적인 명리학 원칙에 따라 답변해주세요.\n\n`;
  }

  prompt += `## 답변 요구사항\n\n`;
  prompt += `1. **요약**: 한 문장으로 핵심 답변을 제시하세요 (20-30자).\n`;
  prompt += `2. **이유**: 사주 기반으로 왜 그런지 설명하세요 (100-150자).\n`;
  prompt += `3. **액션 플랜**: 구체적이고 실현 가능한 행동을 제안하세요 (80-120자).\n`;
  prompt += `4. **신뢰도**: 답변의 신뢰도를 0-100 사이 숫자로 평가하세요.\n\n`;
  prompt += `JSON 형식으로 답변하세요.`;

  return prompt;
}

/**
 * 질문 템플릿 목록
 */
export const questionTemplates: Array<{
  id: string;
  category: QuestionCategory;
  question: string;
  icon: string;
}> = [
  // 애정운
  {
    id: "love-1",
    category: "love",
    question: "이번 달 연애운은 어떤가요?",
    icon: "❤️",
  },
  {
    id: "love-2",
    category: "love",
    question: "새로운 만남이 올까요?",
    icon: "💕",
  },
  {
    id: "love-3",
    category: "love",
    question: "현재 관계가 발전할 수 있을까요?",
    icon: "💖",
  },
  
  // 재물운
  {
    id: "money-1",
    category: "money",
    question: "이번 달 재물운은 어떤가요?",
    icon: "💰",
  },
  {
    id: "money-2",
    category: "money",
    question: "투자나 사업을 시작해도 될까요?",
    icon: "💵",
  },
  {
    id: "money-3",
    category: "money",
    question: "돈이 들어올 시기가 언제인가요?",
    icon: "💸",
  },
  
  // 직업운
  {
    id: "work-1",
    category: "work",
    question: "이번 달 직업운은 어떤가요?",
    icon: "💼",
  },
  {
    id: "work-2",
    category: "work",
    question: "이직이나 전환을 고려해도 될까요?",
    icon: "📈",
  },
  {
    id: "work-3",
    category: "work",
    question: "프로젝트나 협업이 잘 될까요?",
    icon: "🤝",
  },
  
  // 건강운
  {
    id: "health-1",
    category: "health",
    question: "이번 달 건강운은 어떤가요?",
    icon: "🌿",
  },
  {
    id: "health-2",
    category: "health",
    question: "운동이나 다이어트를 시작해도 될까요?",
    icon: "💪",
  },
  {
    id: "health-3",
    category: "health",
    question: "건강 관리에 주의할 점이 있나요?",
    icon: "🏥",
  },
  
  // 이동수
  {
    id: "move-1",
    category: "move",
    question: "이번 달 이사해도 될까요?",
    icon: "✈️",
  },
  {
    id: "move-2",
    category: "move",
    question: "여행이나 출장이 좋을 시기는?",
    icon: "🧳",
  },
  {
    id: "move-3",
    category: "move",
    question: "이동이나 변화가 필요한 시기인가요?",
    icon: "🚀",
  },
  
  // 만남
  {
    id: "meeting-1",
    category: "meeting",
    question: "새로운 사람과의 만남이 좋을까요?",
    icon: "👥",
  },
  {
    id: "meeting-2",
    category: "meeting",
    question: "중요한 미팅이나 약속이 잘 될까요?",
    icon: "🤝",
  },
  
  // 연락
  {
    id: "contact-1",
    category: "contact",
    question: "연락을 취해도 될까요?",
    icon: "📞",
  },
  {
    id: "contact-2",
    category: "contact",
    question: "소통이 원활할 시기는?",
    icon: "💬",
  },
];
