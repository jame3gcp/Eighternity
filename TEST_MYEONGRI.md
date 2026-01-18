# 명리학 분석 시스템 테스트 가이드

## 🧪 테스트 방법

### 1단계: OpenAI 연결 테스트

터미널에서 실행:

```bash
# OpenAI 패키지 설치 확인
npm list openai

# 없으면 설치
npm install openai

# 연결 테스트
node scripts/test-openai-connection.js
```

**예상 결과:**
- ✅ OPENAI_API_KEY 발견
- ✅ openai 모듈 로드 성공
- ✅ OpenAI 클라이언트 생성 성공
- ✅ API 호출 성공

### 2단계: 개발 서버 실행

```bash
npm run dev
```

### 3단계: 온보딩 테스트

1. 브라우저에서 `http://localhost:3000/onboarding` 접속
2. 다음 정보 입력:
   - 생년월일: 1990-01-15
   - 생시: 12:00 (시간 선택)
   - 성별: 남성
3. "시작하기" 버튼 클릭
4. 쿠키에 `user_saju`가 저장되었는지 확인

### 4단계: 명리학 분석 API 테스트

#### 방법 1: 브라우저 콘솔에서 테스트

```javascript
// 브라우저 개발자 도구 콘솔에서 실행
fetch('/api/myeongri/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then(res => res.json())
  .then(data => {
    console.log('✅ 분석 결과:', data);
  })
  .catch(err => {
    console.error('❌ 오류:', err);
  });
```

#### 방법 2: curl로 테스트

```bash
# 쿠키를 먼저 확인 (온보딩 후)
# 브라우저 개발자 도구 > Application > Cookies에서 user_saju 값 복사

curl -X POST http://localhost:3000/api/myeongri/analyze \
  -H "Content-Type: application/json" \
  -H "Cookie: user_saju=YOUR_COOKIE_VALUE"
```

#### 방법 3: Postman/Insomnia 사용

- URL: `POST http://localhost:3000/api/myeongri/analyze`
- Headers: `Cookie: user_saju=...`
- Body: 없음 (쿠키에서 사용자 정보 읽음)

## 📊 예상 응답 구조

```json
{
  "pillars": {
    "year": {
      "gan": "庚",
      "zhi": "午",
      "explanation": "연주 설명..."
    },
    "month": { ... },
    "day": { ... },
    "hour": { ... }
  },
  "fiveElements": {
    "distribution": { "wood": 30, "fire": 25, ... },
    "balance": "오행 균형 설명...",
    "dominant": ["wood", "fire"],
    "weak": ["water", "metal"]
  },
  "tenGods": {
    "distribution": { "비견": 1, "식신": 2, ... },
    "characteristics": { "비견": "특성 설명...", ... },
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

## 🐛 문제 해결

### 문제 1: "OpenAI client not available"

**원인:**
- `openai` 패키지가 설치되지 않음
- `OPENAI_API_KEY` 환경 변수가 설정되지 않음

**해결:**
```bash
npm install openai
# .env.local에 OPENAI_API_KEY 추가
```

### 문제 2: "401 Unauthorized"

**원인:** API 키가 유효하지 않음

**해결:**
- OpenAI 대시보드에서 API 키 확인
- 키가 만료되었는지 확인
- 키에 올바른 권한이 있는지 확인

### 문제 3: "429 Too Many Requests"

**원인:** Rate limit 초과

**해결:**
- 잠시 후 다시 시도
- OpenAI 대시보드에서 사용량 확인

### 문제 4: "No user info"

**원인:** 쿠키에 사용자 정보가 없음

**해결:**
- 먼저 온보딩 완료
- 브라우저에서 쿠키 확인

### 문제 5: JSON 파싱 오류

**원인:** OpenAI 응답이 올바른 JSON 형식이 아님

**해결:**
- 프롬프트 확인
- `response_format: { type: "json_object" }` 확인
- 응답 로그 확인

## ✅ 성공 확인

다음이 모두 확인되면 성공:

1. ✅ OpenAI 연결 테스트 통과
2. ✅ 온보딩 완료 (성별 포함)
3. ✅ `/api/myeongri/analyze` API 호출 성공
4. ✅ JSON 응답 수신
5. ✅ 모든 필드가 올바르게 채워짐

## 📝 로그 확인

개발 서버 콘솔에서 다음 로그 확인:

```
✅ OpenAI client initialized
✅ Saju profile calculated
✅ Ten gods analyzed
✅ Relationships calculated
✅ Daeun/Seun calculated
✅ OpenAI API call successful
```

문제가 있으면 로그를 확인하세요!
