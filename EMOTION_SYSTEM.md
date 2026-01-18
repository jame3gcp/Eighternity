# 감정 분석 시스템 구현 가이드

## 📋 현재 완료된 작업

### 1. 데이터 모델 설계 ✅
- **파일**: `lib/contracts/emotion.ts`
- 감정 타입, 감정 파형, 패턴 분류, 행동 상관, 언어 패턴 등 모든 데이터 스키마 정의
- Zod 기반 타입 안전성 보장

### 2. 데이터베이스 스키마 ✅
- **파일**: `db/emotion_schema.sql`
- `emotion_analyses`: 감정 분석 결과 저장
- `emotion_wave_points`: 시간별 감정 파형 데이터
- `pattern_tracks`: 주/월 단위 패턴 추적
- `emotion_coaching_sessions`: AI 코칭 대화 기록

### 3. AI 프롬프트 시스템 ✅
- **파일**: `lib/ai/prompts/emotion.ts`
- 감정 분석 전용 시스템 프롬프트
- 사용자 프롬프트 생성 함수
- 프롬프트 모듈 통합 (`lib/ai/prompts/index.ts`)

### 4. AI 감정 분석 엔진 ✅
- **파일**: `lib/ai/openai.ts` (추가됨)
- `analyzeEmotion()` 함수 구현
- OpenAI GPT-4o 기반 감정 분석

### 5. API 엔드포인트 ✅
- **파일**: `app/api/emotion/analyze/route.ts`
- POST: 감정 분석 요청 처리
- 라이프 로그 데이터 수집 및 AI 분석 연동

## 🚧 다음 단계 (구현 필요)

### 1. 패턴 모델링 엔진
- **파일**: `lib/engine/emotionPattern.ts` (생성 필요)
- 언어·행동·시간 기반 패턴 분석 로직
- 패턴 분류 알고리즘 (정서형, 사고형, 회피형, 몰입형, 공감형)

### 2. 감정 시각화 컴포넌트
- **파일**: `components/EmotionWaveGraph.tsx` (생성 필요)
- **파일**: `components/EmotionMap.tsx` (생성 필요)
- **파일**: `components/BehaviorHeatmap.tsx` (생성 필요)
- **파일**: `components/EmotionTree.tsx` (생성 필요)
- Recharts 또는 D3.js 기반 시각화

### 3. 감정 아카이브 저장소
- **파일**: `lib/storage/emotionStore.ts` (생성 필요)
- Supabase 연동
- 감정 분석 결과 저장/조회

### 4. 패턴 추적기 API
- **파일**: `app/api/emotion/pattern/route.ts` (생성 필요)
- 주/월 단위 트렌드 분석

### 5. AI 코칭 대화 API
- **파일**: `app/api/emotion/coaching/route.ts` (생성 필요)
- 대화형 AI 피드백 시스템

### 6. 프론트엔드 UI
- **파일**: `app/emotion/page.tsx` (생성 필요)
- 감정 리포트 페이지
- 패턴 추적기 페이지
- 미래 리듬 예측 표시

## 📊 시스템 구조

```
사용자 입력 (라이프 로그)
   ↓
감정 분석 API (/api/emotion/analyze)
   ↓
AI 감정 분석 엔진 (OpenAI GPT-4o)
   ↓
패턴 모델링 엔진
   ↓
감정 시각화 컴포넌트
   ↓
감정 아카이브 저장
```

## 🔧 사용 방법

### API 호출 예시

```typescript
// 감정 분석 요청
const response = await fetch("/api/emotion/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    date: "2024-01-15", // 선택사항
    period: "day", // "day" | "week" | "month"
    includeLifeLog: true,
    includeNotes: true,
  }),
});

const analysis = await response.json();
// EmotionAnalysisResponse 타입
```

### 응답 구조

```typescript
{
  emotionWave: {
    date: "2024-01-15",
    points: [
      {
        timestamp: "2024-01-15T09:00:00Z",
        emotion: "joy",
        intensity: 75,
        context: "아침 운동 후"
      }
    ],
    summary: "하루 감정 요약"
  },
  patternType: "emotional",
  patternConfidence: 0.85,
  behaviorCorrelations: [...],
  languagePattern: {...},
  aiComment: "당신의 감정은...",
  futureRhythm: {...},
  feedback: {...}
}
```

## 🎯 다음 구현 우선순위

1. **감정 시각화 컴포넌트** (사용자 경험 향상)
2. **감정 아카이브 저장소** (데이터 지속성)
3. **프론트엔드 UI** (사용자 인터페이스)
4. **패턴 추적기** (트렌드 분석)
5. **AI 코칭 대화** (대화형 기능)

## 📝 참고사항

- 모든 감정 분석은 OpenAI GPT-4o 모델 사용
- 라이프 로그 데이터는 기존 `life_logs` 테이블 활용
- 감정 분석 결과는 `emotion_analyses` 테이블에 저장
- 패턴 추적은 주/월 단위로 집계하여 `pattern_tracks` 테이블에 저장
