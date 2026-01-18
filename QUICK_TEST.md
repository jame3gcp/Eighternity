# 🧪 빠른 테스트 가이드

## ✅ 1단계: 환경 변수 확인

`.env.local` 파일에 다음이 있는지 확인:

```bash
OPENAI_API_KEY=sk-...
```

## ✅ 2단계: 개발 서버 실행

```bash
npm run dev
```

서버가 `http://localhost:3000`에서 실행됩니다.

## ✅ 3단계: 온보딩 완료

1. 브라우저에서 `http://localhost:3000/onboarding` 접속
2. 정보 입력:
   - 생년월일: `1990-01-15`
   - 생시: `12:00` (시간 선택)
   - 성별: `남성`
3. "시작하기" 클릭

## ✅ 4단계: 명리학 분석 테스트

### 방법 1: 테스트 페이지 사용 (가장 쉬움! ⭐)

1. 브라우저에서 `http://localhost:3000/test-myeongri` 접속
2. "명리학 분석 시작" 버튼 클릭
3. 결과가 화면에 표시됩니다!

**이 방법이 가장 쉽고 직관적입니다!**

### 방법 2: 브라우저 콘솔 사용

#### 개발자 도구 열기
1. 브라우저에서 `http://localhost:3000/home` 접속
2. **Windows/Linux**: `F12` 키 또는 `Ctrl + Shift + I`
   **Mac**: `Cmd + Option + I`
3. 상단의 **"Console"** 탭 클릭

#### 코드 입력하기
1. 콘솔 하단의 입력창에 다음 코드를 복사해서 붙여넣기:

```javascript
fetch('/api/myeongri/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
  .then(res => res.json())
  .then(data => {
    console.log('✅ 분석 결과:', data);
    if (data.pillars) {
      console.log('📊 사주 구성:', data.pillars);
      console.log('🔮 오행 분포:', data.fiveElements);
      console.log('🌟 십성:', data.tenGods);
      console.log('⚡ 형충회합:', data.relationships);
      console.log('📅 대운·세운:', data.luck);
      console.log('💡 종합 분석:', data.analysis);
      console.log('📝 요약:', data.summary);
    } else if (data.error) {
      console.error('❌ 오류:', data.error);
    }
  })
  .catch(err => console.error('❌ 요청 실패:', err));
```

2. **Enter** 키를 누르면 실행됩니다!

#### 결과 확인
- 콘솔에 분석 결과가 표시됩니다
- 오류가 있으면 빨간색으로 표시됩니다

### 방법 3: 서버 로그 확인

개발 서버 터미널에서 다음 로그 확인:

```
✅ 사주 계산 완료: { year: '...', month: '...', ... }
✅ 십성 분석 완료
✅ 형충회합 분석 완료
✅ 대운·세운 계산 완료
✅ OpenAI client initialized, starting analysis...
✅ 명리학 분석 완료!
```

## 🐛 문제 해결

### "No user info" 오류
→ 온보딩을 먼저 완료하세요

### "OpenAI client not available" 오류
→ `.env.local`에 `OPENAI_API_KEY` 확인

### "401 Unauthorized" 오류
→ API 키가 유효하지 않습니다. OpenAI 대시보드에서 확인

### "429 Too Many Requests" 오류
→ Rate limit 초과. 잠시 후 재시도

## 📊 성공 확인

다음이 모두 있으면 성공:

- ✅ `pillars` 객체 (year, month, day, hour)
- ✅ `fiveElements` 객체
- ✅ `tenGods` 객체
- ✅ `relationships` 객체
- ✅ `luck` 객체
- ✅ `analysis` 객체
- ✅ `summary` 문자열

## 🎉 완료!

분석 결과가 정상적으로 반환되면 성공입니다!
