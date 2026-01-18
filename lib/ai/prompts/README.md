# 프롬프트 관리 시스템

## 📁 구조

```
lib/ai/prompts/
├── system.ts        # 시스템 프롬프트 (AI 역할 정의)
├── myeongri.ts      # 명리학 분석 프롬프트
├── templates.ts      # 프롬프트 유틸리티 함수
├── index.ts          # 프롬프트 통합 및 팩토리
└── README.md         # 이 파일
```

## 🎯 사용 방법

### 기본 사용

```typescript
import { createMyeongriPrompt } from "@/lib/ai/prompts";

const promptConfig = createMyeongriPrompt(request);
// promptConfig.systemPrompt
// promptConfig.userPrompt
// promptConfig.temperature
```

### 프롬프트 팩토리 사용

```typescript
import { createPrompt } from "@/lib/ai/prompts";

const promptConfig = createPrompt("myeongri", request);
```

## 🔧 확장 방법

### 1. 새로운 프롬프트 타입 추가

#### `system.ts`에 시스템 프롬프트 추가

```typescript
export const NEW_FEATURE_SYSTEM_PROMPT = `당신은 ... 전문가입니다.`;
```

#### 새로운 프롬프트 파일 생성 (예: `fortune.ts`)

```typescript
export function buildFortunePrompt(data: FortuneRequest): string {
  // 프롬프트 구성
  return "...";
}
```

#### `index.ts`에 추가

```typescript
export function createFortunePrompt(data: FortuneRequest): PromptConfig {
  return {
    systemPrompt: FORTUNE_SYSTEM_PROMPT,
    userPrompt: buildFortunePrompt(data),
    temperature: 0.7,
  };
}

// 팩토리에 추가
export function createPrompt(type: PromptType, data: any): PromptConfig {
  switch (type) {
    case "myeongri":
      return createMyeongriPrompt(data);
    case "fortune":  // 새로 추가
      return createFortunePrompt(data);
    // ...
  }
}
```

### 2. 프롬프트 커스터마이징

#### 템플릿 유틸리티 사용

```typescript
import { combinePrompt, addSection, replaceVariables } from "@/lib/ai/prompts";

// 섹션 추가
let prompt = buildMyeongriPrompt(request);
prompt = addSection(prompt, "추가 정보", "커스텀 내용");

// 변수 치환
const template = "{{name}}님의 사주는...";
const result = replaceVariables(template, { name: "홍길동" });
```

## 📝 프롬프트 구성 요소

### 시스템 프롬프트
- AI의 역할 정의
- 분석 원칙
- 응답 스타일

### 사용자 프롬프트
- 입력 데이터
- 분석 요청
- 응답 형식

### 설정
- `temperature`: 창의성 (0.0 ~ 2.0)
- `maxTokens`: 최대 토큰 수
- `responseFormat`: 응답 형식 (json_object 등)

## 🎨 예시: 운세 분석 프롬프트 추가

```typescript
// prompts/fortune.ts
export function buildFortunePrompt(request: FortuneRequest): string {
  return `오늘의 운세를 분석해주세요:
- 날짜: ${request.date}
- 사주: ${request.pillars}
...`;
}

// index.ts
export function createFortunePrompt(data: FortuneRequest): PromptConfig {
  return {
    systemPrompt: FORTUNE_SYSTEM_PROMPT,
    userPrompt: buildFortunePrompt(data),
    temperature: 0.8, // 운세는 조금 더 창의적으로
  };
}
```

## 💡 모범 사례

1. **프롬프트는 별도 파일로 관리**: 유지보수 용이
2. **재사용 가능한 함수**: `buildMyeongriPrompt`처럼 함수화
3. **타입 안정성**: TypeScript 타입 정의
4. **확장성**: 팩토리 패턴으로 쉽게 추가
5. **테스트 가능**: 각 프롬프트 함수를 독립적으로 테스트
