# 명리학 AI 분석 시스템 설계

## 📋 개요

전통 명리학 원리에 따라 OpenAI를 활용한 종합 사주 분석 시스템입니다.

## 🎯 분석 항목

### 1️⃣ 사주 기본 구성 (연주·월주·일주·시주)
- 각 주의 천간(天干)과 지지(地支) 분석
- 각 주의 의미와 특성 설명

### 2️⃣ 오행 분포
- 목(木), 화(火), 토(土), 금(金), 수(水)의 분포
- 균형 상태 분석
- 우세/약한 오행 식별

### 3️⃣ 십성(十神)의 흐름
- 비견(比肩), 식신(食神), 상관(傷官), 편재(偏財), 정재(正財), 칠살(七殺), 정관(正官), 편인(偏印), 정인(正印), 겁재(劫財)
- 각 십성의 특성과 영향력
- 십성 간의 흐름과 상호작용

### 4️⃣ 형충회합
- 충(沖): 6충 관계
- 합(合): 6합 관계
- 형(刑): 형벌 관계
- 해(害): 해로운 관계

### 5️⃣ 대운·세운의 흐름
- 대운(大運): 10년 단위 운세
- 세운(歲運): 연도별 운세
- 현재 운세 종합 분석

### 6️⃣ 종합 분석
- 성격: 일간과 십성을 기반한 성격 분석
- 직업: 오행과 십성에 맞는 직업 추천
- 재물: 재물운 분석
- 건강: 오행 균형과 건강 관계
- 인연: 인간관계와 인연 분석

## 🏗 시스템 구조

```
lib/
├── ai/
│   └── openai.ts          # OpenAI 클라이언트 및 분석 함수
├── engine/
│   ├── sajuEngine.ts      # 사주 기본 계산 (간지, 오행)
│   ├── tenGods.ts         # 십성 분석
│   └── luck.ts            # 대운·세운, 형충회합 계산
└── contracts/
    └── myeongri.ts        # 명리학 분석 스키마

app/api/
└── myeongri/
    └── analyze/
        └── route.ts       # 명리학 분석 API
```

## 🔄 데이터 흐름

```
1. 사용자 입력
   ↓
2. 사주 기본 계산 (sajuEngine)
   - 연주, 월주, 일주, 시주 계산
   - 오행 분포 계산
   ↓
3. 십성 분석 (tenGods)
   - 일간 기준 십성 계산
   ↓
4. 대운·세운 계산 (luck)
   - 대운 계산 (성별 기준)
   - 세운 계산
   - 형충회합 계산
   ↓
5. OpenAI 분석
   - 구조화된 프롬프트 전송
   - JSON 형식 응답 수신
   ↓
6. 결과 반환
   - 종합 분석 결과 제공
```

## 📡 API 사용법

### 요청

```bash
POST /api/myeongri/analyze
Headers:
  Cookie: user_saju=...
```

### 응답

```json
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
    "current": { "daeun": "...", "seun": "...", "overall": "..." }
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

## 🔧 설정

### 1. OpenAI 패키지 설치

```bash
npm install openai
```

### 2. 환경 변수

```bash
OPENAI_API_KEY=your-api-key-here
```

### 3. 모델 선택

`lib/ai/openai.ts`에서 모델 선택:

```typescript
model: "gpt-4o-mini"  // 비용 효율적
// 또는
model: "gpt-4"         // 더 정확하지만 비용 높음
```

## 📝 프롬프트 구조

### System Prompt
- 명리학 전문가 역할 정의
- 분석 원칙 제시

### User Prompt
- 사주 기본 정보
- 계산된 오행, 십성
- 형충회합 관계
- 대운·세운 정보

### Response Format
- JSON 형식 강제
- 구조화된 응답 스키마

## ⚠️ 주의사항

1. **API 비용**: OpenAI API 사용 시 비용 발생
2. **Rate Limit**: 요청 제한 확인 필요
3. **에러 처리**: API 실패 시 폴백 메커니즘
4. **캐싱**: 분석 결과 캐싱 고려 (DB 저장)

## 🚀 향후 개선

- [ ] 대운 계산 로직 정확도 향상
- [ ] 형충회합 자동 감지 로직 강화
- [ ] 분석 결과 캐싱 (DB 저장)
- [ ] 프롬프트 최적화
- [ ] 에러 처리 개선
- [ ] 분석 결과 UI 표시
