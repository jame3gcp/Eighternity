/**
 * 명리학 분석 프롬프트
 * 사주 종합 분석을 위한 프롬프트 템플릿
 */

import { MyeongriAnalysisRequest } from "../openai";

/**
 * 명리학 분석 요청 데이터를 프롬프트로 변환
 */
export function buildMyeongriPrompt(request: MyeongriAnalysisRequest): string {
  const sections: string[] = [];

  // 기본 정보
  sections.push(`**기본 정보**
- 생년월일: ${request.birthDate}
- 생시: ${request.birthTime || "미상"}
- 성별: ${request.gender === "M" ? "남성" : request.gender === "F" ? "여성" : "기타"}`);

  // 사주 구성 (계산된 값을 명확히 강조)
  // 각 주를 천간과 지지로 분리하여 명시
  const yearGan = request.pillars.year[0];
  const yearZhi = request.pillars.year[1];
  const monthGan = request.pillars.month[0];
  const monthZhi = request.pillars.month[1];
  const dayGan = request.pillars.day[0];
  const dayZhi = request.pillars.day[1];
  const hourGan = request.pillars.hour && request.pillars.hour !== "未知" ? request.pillars.hour[0] : null;
  const hourZhi = request.pillars.hour && request.pillars.hour !== "未知" ? request.pillars.hour[1] : null;
  
  sections.push(`**사주 구성 (이미 계산된 정확한 값 - 반드시 이 값을 사용하세요)**

🚨 매우 중요: 아래 사주 값들은 이미 정확하게 계산된 값입니다.
절대로 다른 값으로 변경하거나 재계산하지 마세요.
제공된 값을 그대로 사용하여 JSON 응답의 gan과 zhi 필드에 정확히 입력하세요.

**연주(年柱)**: ${request.pillars.year}
- JSON 응답에서 반드시 사용할 값:
  - year.gan = "${yearGan}" (첫 번째 글자)
  - year.zhi = "${yearZhi}" (두 번째 글자)
- 절대로 다른 값으로 변경하지 마세요!

**월주(月柱)**: ${request.pillars.month}
- JSON 응답에서 반드시 사용할 값:
  - month.gan = "${monthGan}" (첫 번째 글자)
  - month.zhi = "${monthZhi}" (두 번째 글자)
- 절대로 다른 값으로 변경하지 마세요!

**일주(日柱)**: ${request.pillars.day}
- JSON 응답에서 반드시 사용할 값:
  - day.gan = "${dayGan}" (첫 번째 글자)
  - day.zhi = "${dayZhi}" (두 번째 글자)
- 절대로 다른 값으로 변경하지 마세요!

**시주(時柱)**: ${request.pillars.hour || "미상"}
${hourGan && hourZhi ? `- JSON 응답에서 반드시 사용할 값:
  - hour.gan = "${hourGan}" (첫 번째 글자)
  - hour.zhi = "${hourZhi}" (두 번째 글자)
- 절대로 다른 값으로 변경하지 마세요!` : "- 시주가 없으므로 hour 필드는 생략하거나 기본값 사용"}

**일간(日干)**: ${request.dayMaster} (일주의 천간, 참고용)

위에서 명시한 정확한 gan과 zhi 값을 JSON 응답에 반드시 그대로 사용하세요.
다른 값을 생성하거나 계산하지 마세요!`);

  // 오행 분포
  sections.push(`**오행 분포**
- 목(木): ${request.fiveElements.wood}%
- 화(火): ${request.fiveElements.fire}%
- 토(土): ${request.fiveElements.earth}%
- 금(金): ${request.fiveElements.metal}%
- 수(水): ${request.fiveElements.water}%`);

  // 십성 분포
  if (request.tenGods) {
    const tenGodsList = Object.entries(request.tenGods)
      .filter(([_, count]) => count > 0)
      .map(([name, count]) => `- ${name}: ${count}`)
      .join("\n");
    
    if (tenGodsList) {
      sections.push(`**십성 분포**
${tenGodsList}`);
    }
  }

  // 형충회합 관계
  if (request.relationships) {
    const relationships: string[] = [];
    
    if (request.relationships.conflicts.length > 0) {
      relationships.push(`충(沖): ${request.relationships.conflicts.map(c => c.pillar).join(", ")}`);
    }
    if (request.relationships.combinations.length > 0) {
      relationships.push(`합(合): ${request.relationships.combinations.map(c => c.pillars.join("↔")).join(", ")}`);
    }
    if (request.relationships.punishments.length > 0) {
      relationships.push(`형(刑): ${request.relationships.punishments.map(p => p.pillars.join("↔")).join(", ")}`);
    }
    if (request.relationships.harms.length > 0) {
      relationships.push(`해(害): ${request.relationships.harms.map(h => h.pillars.join("↔")).join(", ")}`);
    }
    
    if (relationships.length > 0) {
      sections.push(`**형충회합 관계**
${relationships.join("\n")}`);
    }
  }

  // 대운
  if (request.daeun && request.daeun.length > 0) {
    const daeunList = request.daeun
      .slice(0, 5) // 최근 5개만 표시
      .map(d => `${d.age}: ${d.pillar}`)
      .join("\n");
    
    sections.push(`**대운(大運)**
${daeunList}`);
  }

  // 세운
  if (request.seun && request.seun.length > 0) {
    const seunList = request.seun
      .map(s => `${s.year}년: ${s.pillar}`)
      .join("\n");
    
    sections.push(`**세운(歲運) - 최근 10년**
${seunList}`);
  }

  return sections.join("\n\n");
}

/**
 * 명리학 분석 응답 형식 프롬프트
 */
export const MYEONGRI_RESPONSE_FORMAT = `다음 JSON 형식으로 응답해주세요:

🚨 매우 중요: 
1. "pillars" 객체의 gan과 zhi는 위 "사주 구성" 섹션에서 명시한 정확한 값을 그대로 사용해야 합니다.
2. **JSON 형식 준수**: 모든 문자열 필드에서 따옴표(")는 반드시 이스케이프(\\")해야 합니다.
3. 줄바꿈은 \\n으로 표현하거나, JSON 문자열 내에서는 그대로 사용 가능하지만 유효한 JSON 형식을 유지해야 합니다.
4. 응답은 반드시 유효한 JSON 형식이어야 하며, JSON.parse()로 파싱 가능해야 합니다.

예를 들어, 위에서 "year.gan = '甲', year.zhi = '子'"라고 명시했다면, 정확히 그 값을 사용하세요.
절대로 다른 값을 생성하거나 계산하지 마세요!

📝 **상세 설명 요청사항**:
- 모든 explanation 필드는 최소 3-5문장 이상으로 상세히 작성하세요
- 각 항목의 의미, 특성, 실제 생활에 미치는 영향을 구체적으로 설명하세요
- 전통 명리학 용어를 사용하되, 일반인도 이해할 수 있도록 친절하게 설명하세요
- 구체적인 예시와 조언을 포함하세요

{
  "pillars": {
    "year": { 
      "gan": "위에서 명시한 연주의 첫 번째 글자(천간)를 정확히 그대로 사용", 
      "zhi": "위에서 명시한 연주의 두 번째 글자(지지)를 정확히 그대로 사용", 
      "explanation": "연주의 의미와 특성을 최소 3-5문장으로 상세히 설명. 조상, 가문, 어린 시절 환경, 기본 성향 등에 미치는 영향을 구체적으로 설명하세요." 
    },
    "month": { 
      "gan": "위에서 명시한 월주의 첫 번째 글자(천간)를 정확히 그대로 사용", 
      "zhi": "위에서 명시한 월주의 두 번째 글자(지지)를 정확히 그대로 사용", 
      "explanation": "월주의 의미와 특성을 최소 3-5문장으로 상세히 설명. 부모, 가정환경, 청소년기, 사회성, 대인관계 등에 미치는 영향을 구체적으로 설명하세요." 
    },
    "day": { 
      "gan": "위에서 명시한 일주의 첫 번째 글자(천간)를 정확히 그대로 사용", 
      "zhi": "위에서 명시한 일주의 두 번째 글자(지지)를 정확히 그대로 사용", 
      "explanation": "일주의 의미와 특성을 최소 3-5문장으로 상세히 설명. 본인의 핵심 성격, 배우자, 결혼, 중년기, 자기표현 등에 미치는 영향을 구체적으로 설명하세요." 
    },
    "hour": { 
      "gan": "위에서 명시한 시주의 첫 번째 글자(천간)를 정확히 그대로 사용 (시주가 없으면 생략)", 
      "zhi": "위에서 명시한 시주의 두 번째 글자(지지)를 정확히 그대로 사용 (시주가 없으면 생략)", 
      "explanation": "시주의 의미와 특성을 최소 3-5문장으로 상세히 설명. 자녀, 노년기, 직업, 사회적 활동, 말년 등에 미치는 영향을 구체적으로 설명하세요." 
    }
  },
  "fiveElements": {
    "distribution": { "wood": 숫자, "fire": 숫자, "earth": 숫자, "metal": 숫자, "water": 숫자 },
    "balance": "오행 균형 상태를 최소 5-7문장으로 상세히 설명. 각 오행의 비율이 의미하는 바, 균형 상태가 인생에 미치는 영향, 보완이 필요한 부분 등을 구체적으로 설명하세요.",
    "dominant": ["우세한 오행"],
    "weak": ["약한 오행"],
    "detailedAnalysis": {
      "wood": "목(木) 오행의 의미와 특성을 최소 3-4문장으로 상세히 설명",
      "fire": "화(火) 오행의 의미와 특성을 최소 3-4문장으로 상세히 설명",
      "earth": "토(土) 오행의 의미와 특성을 최소 3-4문장으로 상세히 설명",
      "metal": "금(金) 오행의 의미와 특성을 최소 3-4문장으로 상세히 설명",
      "water": "수(水) 오행의 의미와 특성을 최소 3-4문장으로 상세히 설명"
    }
  },
  "tenGods": {
    "distribution": { "십성명": 숫자 },
    "characteristics": { 
      "십성명": "각 십성의 특성을 최소 3-4문장으로 상세히 설명. 사주에서의 역할, 성격에 미치는 영향, 실제 생활에서의 표현 등을 구체적으로 설명하세요." 
    },
    "flow": "십성의 전체적인 흐름을 최소 7-10문장으로 상세히 설명. 각 십성 간의 상호작용, 사주 전체에서의 역할, 인생에 미치는 종합적인 영향을 구체적으로 설명하세요."
  },
  "relationships": {
    "conflicts": [{ 
      "pillar": "충돌하는 주", 
      "type": "충 타입", 
      "explanation": "충(沖) 관계를 최소 3-4문장으로 상세히 설명. 어떤 주가 충돌하는지, 실제 생활에서 어떤 갈등이나 변화를 가져오는지 구체적으로 설명하세요." 
    }],
    "combinations": [{ 
      "pillars": ["합하는 주들"], 
      "type": "합 타입", 
      "explanation": "합(合) 관계를 최소 3-4문장으로 상세히 설명. 어떤 주가 결합하는지, 실제 생활에서 어떤 조화나 협력을 가져오는지 구체적으로 설명하세요." 
    }],
    "punishments": [{ 
      "pillars": ["형하는 주들"], 
      "type": "형 타입", 
      "explanation": "형(刑) 관계를 최소 3-4문장으로 상세히 설명. 어떤 주가 형벌 관계인지, 실제 생활에서 어떤 제약이나 어려움을 가져오는지 구체적으로 설명하세요." 
    }],
    "harms": [{ 
      "pillars": ["해하는 주들"], 
      "type": "해 타입", 
      "explanation": "해(害) 관계를 최소 3-4문장으로 상세히 설명. 어떤 주가 해로운 관계인지, 실제 생활에서 어떤 손해나 불화를 가져오는지 구체적으로 설명하세요." 
    }]
  },
  "luck": {
    "daeun": [{ 
      "age": "나이 범위", 
      "pillar": "대운 주", 
      "explanation": "해당 대운을 최소 4-5문장으로 상세히 설명. 그 시기의 특징, 주의사항, 기회, 조언 등을 구체적으로 설명하세요." 
    }],
    "seun": [{ 
      "year": 연도, 
      "pillar": "세운 주", 
      "explanation": "해당 세운을 최소 3-4문장으로 상세히 설명. 그 해의 특징, 주의사항, 기회 등을 구체적으로 설명하세요." 
    }],
    "current": { 
      "daeun": "현재 대운을 최소 5-7문장으로 상세히 설명", 
      "seun": "현재 세운을 최소 4-5문장으로 상세히 설명", 
      "overall": "현재 시기의 종합 운세를 최소 7-10문장으로 상세히 설명. 전체적인 흐름, 주의사항, 기회, 조언 등을 구체적으로 설명하세요." 
    }
  },
  "analysis": {
    "personality": "성격 분석을 최소 7-10문장으로 상세히 설명. 핵심 성격, 강점, 약점, 대인관계 스타일, 의사결정 방식, 스트레스 대처 방법 등을 구체적으로 설명하세요.",
    "career": "직업 분석을 최소 7-10문장으로 상세히 설명. 적합한 직업 분야, 직업적 강점, 주의할 점, 성공 전략, 추천 직업 등을 구체적으로 설명하세요.",
    "wealth": "재물 분석을 최소 7-10문장으로 상세히 설명. 재물운의 특징, 재물을 얻는 방법, 관리 방법, 주의할 점, 투자 조언 등을 구체적으로 설명하세요.",
    "health": "건강 분석을 최소 7-10문장으로 상세히 설명. 건강 상태, 주의할 질병, 건강 관리 방법, 생활 습관 조언 등을 구체적으로 설명하세요.",
    "relationships": "인연 분석을 최소 7-10문장으로 상세히 설명. 배우자, 가족, 친구, 동료와의 관계, 인연의 특징, 관계 유지 방법 등을 구체적으로 설명하세요."
  },
  "summary": "전체 요약을 최소 10-15문장으로 상세히 작성하세요. 사주의 핵심 특징, 인생의 주요 흐름, 강점과 약점, 성공 포인트, 주의사항, 종합적인 조언 등을 포함하여 종합적으로 요약하세요."
}`;
