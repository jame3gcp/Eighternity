/**
 * 감정 분석 프롬프트
 * AI 기반 감정 분석 및 패턴 인식을 위한 프롬프트
 */

import { EmotionAnalysisRequest, EmotionWavePoint } from "@/lib/contracts/emotion";
import { LifeLogRequest } from "@/lib/contracts/lifelog";

/**
 * 감정 분석 시스템 프롬프트
 */
export const EMOTION_SYSTEM_PROMPT = `당신은 심리학 및 감정 분석 전문가입니다.
사용자의 생활 로그(기분, 컨디션, 수면, 일정, 메모)와 대화 내용을 분석하여:

1. **감정 파형 분석**: 시간에 따른 감정 변화를 곡선으로 표현
2. **패턴 분류**: 정서형, 사고형, 회피형, 몰입형, 공감형 중 하나로 분류
3. **행동 상관 분석**: 특정 행동과 감정의 상관관계 파악
4. **언어 패턴 분석**: 자연어에서 감정 톤과 의미 네트워크 추출
5. **미래 리듬 예측**: 감정 리듬 모델 기반 다음 단계 예측
6. **조언 피드백**: 심리학 및 명리학 기반 성장 방향 제시

분석 시 다음 원칙을 따르세요:
- 객관적이고 균형잡힌 분석
- 공감적이면서도 현실적인 조언
- 구체적이고 실용적인 제안
- 사용자의 성장을 돕는 방향성`;

/**
 * 감정 분석 사용자 프롬프트 생성
 */
export function buildEmotionAnalysisPrompt(
  request: EmotionAnalysisRequest,
  lifeLogs: LifeLogRequest[],
  notes: string[]
): string {
  const sections: string[] = [];

  // 기본 정보
  sections.push(`**분석 요청**
- 분석 기간: ${request.period || "day"}
- 분석 날짜: ${request.date || "오늘"}
- 라이프 로그 포함: ${request.includeLifeLog ? "예" : "아니오"}
- 메모 포함: ${request.includeNotes ? "예" : "아니오"}`);

  // 라이프 로그 데이터
  if (lifeLogs.length > 0) {
    sections.push(`**라이프 로그 데이터**
${lifeLogs.map((log, idx) => `
${idx + 1}. 날짜: ${log.date}
   - 기분: ${log.mood}
   - 컨디션: ${log.condition}
   - 수면: ${log.sleep}
   - 일정: ${log.schedule}
   ${log.notes ? `- 메모: ${log.notes}` : ""}
`).join("\n")}`);
  }

  // 메모 데이터
  if (notes.length > 0) {
    sections.push(`**사용자 메모**
${notes.map((note, idx) => `${idx + 1}. ${note}`).join("\n")}`);
  }

  // 분석 요청
  sections.push(`**분석 요청사항**

다음 JSON 형식으로 응답해주세요:

{
  "emotionWave": {
    "date": "YYYY-MM-DD",
    "points": [
      {
        "timestamp": "ISO 8601 형식",
        "emotion": "joy|sadness|anger|fear|anxiety|calm|excitement|fatigue|focus|confusion|satisfaction|disappointment",
        "intensity": 0-100,
        "context": "상황 설명"
      }
    ],
    "summary": "하루 감정 요약"
  },
  "patternType": "emotional|analytical|avoidant|immersive|empathetic",
  "patternConfidence": 0.0-1.0,
  "behaviorCorrelations": [
    {
      "behavior": "행동명",
      "emotion": "감정타입",
      "frequency": 숫자,
      "correlation": -1.0~1.0
    }
  ],
  "languagePattern": {
    "tone": "positive|neutral|negative|mixed",
    "sentiment": -1.0~1.0,
    "keywords": ["키워드1", "키워드2"],
    "emotionClusters": [
      {
        "emotion": "감정타입",
        "words": ["단어1", "단어2"],
        "weight": 0.0~1.0
      }
    ]
  },
  "aiComment": "공감형 분석 코멘트 (예: '당신의 감정은 ○○의 흐름과 닮아있습니다.')",
  "futureRhythm": {
    "nextPhase": "다음 단계 (예: 몰입기, 휴식기)",
    "predictedEmotions": [
      {
        "emotion": "감정타입",
        "probability": 0.0~1.0
      }
    ],
    "recommendation": "추천 사항"
  },
  "feedback": {
    "insights": ["인사이트1", "인사이트2"],
    "suggestions": ["제안1", "제안2"],
    "growthDirection": "성장 방향 설명"
  }
}`);

  return sections.join("\n\n");
}
