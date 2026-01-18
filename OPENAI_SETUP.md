# OpenAI 연동 가이드

## 📋 개요

전통 명리학 원리에 따라 사주를 종합 분석하는 시스템입니다. OpenAI API를 사용하여 다음 항목을 분석합니다:

1. **사주 기본 구성** (연주·월주·일주·시주)
2. **오행 분포**
3. **십성(十神)의 흐름**
4. **형충회합**
5. **대운·세운의 흐름**
6. **종합 분석** (성격·직업·재물·건강·인연)

## 🔧 설정 방법

### 1. OpenAI 패키지 설치

```bash
npm install openai
```

### 2. 환경 변수 설정

`.env.local` 파일에 OpenAI API 키 추가:

```bash
# OpenAI 설정
OPENAI_API_KEY=your-openai-api-key-here
```

**OpenAI API 키 발급 방법:**
1. https://platform.openai.com 접속
2. 로그인 후 API Keys 메뉴
3. "Create new secret key" 클릭
4. 키 복사 후 `.env.local`에 추가

### 3. API 모델 선택

`lib/ai/openai.ts` 파일에서 사용할 모델을 선택할 수 있습니다:

```typescript
// 현재 설정: gpt-4o-mini (비용 효율적)
model: "gpt-4o-mini"

// 더 정확한 분석을 원하면:
model: "gpt-4" // 또는 "gpt-4-turbo"
```

## 📡 API 사용 방법

### 명리학 종합 분석 요청

```typescript
// POST /api/myeongri/analyze
// 헤더에 쿠키 필요 (user_saju)

// 응답 예시:
{
  "pillars": {
    "year": { "gan": "甲", "zhi": "子", "explanation": "..." },
    "month": { "gan": "丙", "zhi": "寅", "explanation": "..." },
    "day": { "gan": "戊", "zhi": "午", "explanation": "..." },
    "hour": { "gan": "壬", "zhi": "子", "explanation": "..." }
  },
  "fiveElements": {
    "distribution": { "wood": 30, "fire": 25, "earth": 20, "metal": 15, "water": 10 },
    "balance": "목(木)이 우세하여...",
    "dominant": ["wood", "fire"],
    "weak": ["water", "metal"]
  },
  "tenGods": {
    "distribution": { "비견": 1, "식신": 2, ... },
    "characteristics": { "비견": "...", ... },
    "flow": "십성 흐름 설명..."
  },
  "relationships": {
    "conflicts": [...],
    "combinations": [...],
    "punishments": [...],
    "harms": [...]
  },
  "luck": {
    "daeun": [...],
    "seun": [...],
    "current": { ... }
  },
  "analysis": {
    "personality": "성격 분석...",
    "career": "직업 분석...",
    "wealth": "재물 분석...",
    "health": "건강 분석...",
    "relationships": "인연 분석..."
  },
  "summary": "전체 요약..."
}
```

## 🔄 동작 방식

1. **사주 기본 계산**: `sajuEngine.ts`에서 간지와 오행 계산
2. **십성 분석**: `tenGods.ts`에서 십성 분포 계산
3. **AI 분석**: OpenAI에 구조화된 프롬프트 전송
4. **결과 반환**: JSON 형식으로 종합 분석 결과 반환

## 💡 프롬프트 커스터마이징

`lib/ai/openai.ts`의 `systemPrompt`와 `userPrompt`를 수정하여 분석 방식을 조정할 수 있습니다.

## ⚠️ 주의사항

1. **API 비용**: OpenAI API 사용 시 비용이 발생합니다
   - `gpt-4o-mini`: 저렴하지만 정확도 낮음
   - `gpt-4`: 비싸지만 정확도 높음

2. **Rate Limit**: OpenAI API는 요청 제한이 있습니다
   - 무료 티어: 제한적
   - 유료 플랜: 더 많은 요청 가능

3. **에러 처리**: API 키가 없거나 오류 발생 시 `null` 반환
   - 폴백 메커니즘 구현 권장

## 🧪 테스트

```bash
# API 키 설정 후
curl -X POST http://localhost:3000/api/myeongri/analyze \
  -H "Cookie: user_saju=..."
```

## 📝 향후 개선 사항

- [ ] 분석 결과 캐싱 (DB 저장)
- [ ] 대운·세운 자동 계산 로직 추가
- [ ] 형충회합 자동 감지 로직 추가
- [ ] 프롬프트 최적화
- [ ] 에러 처리 개선
