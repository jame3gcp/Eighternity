# 🌐 브라우저 개발자 도구 콘솔 사용 가이드

## 📖 개발자 도구 열기

### Windows / Linux
- **F12** 키 누르기
- 또는 **Ctrl + Shift + I** (또는 **Ctrl + Shift + J**)

### Mac
- **Cmd + Option + I**
- 또는 **Cmd + Option + J**

### 또는
- 브라우저 메뉴에서:
  - Chrome/Edge: `보기` > `개발자 도구` > `개발자 도구`
  - Firefox: `도구` > `웹 개발자` > `웹 콘솔`
  - Safari: `개발` > `웹 검사기 표시` (먼저 개발자 메뉴 활성화 필요)

## 🎯 콘솔 탭 찾기

개발자 도구가 열리면 상단에 여러 탭이 있습니다:
- **Elements** (또는 Inspector)
- **Console** ← **여기를 클릭하세요!**
- **Network**
- **Sources**
- 등등...

**Console** 탭을 클릭하면 하단에 입력창이 보입니다.

## ⌨️ 코드 입력하기

1. 콘솔 하단의 입력창(프롬프트)을 클릭합니다
2. 다음 코드를 복사해서 붙여넣기:

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

3. **Enter** 키를 누릅니다

## 📊 결과 확인

### 성공한 경우
콘솔에 다음과 같은 메시지들이 표시됩니다:
```
✅ 분석 결과: { pillars: {...}, fiveElements: {...}, ... }
📊 사주 구성: { year: {...}, month: {...}, ... }
🔮 오행 분포: { distribution: {...}, balance: "...", ... }
...
```

### 오류가 있는 경우
빨간색으로 오류 메시지가 표시됩니다:
```
❌ 오류: No user info
```
또는
```
❌ 요청 실패: Failed to fetch
```

## 🖼️ 스크린샷 가이드

### Chrome/Edge 예시
```
┌─────────────────────────────────────┐
│ Elements | Console | Network | ... │ ← 탭 선택
├─────────────────────────────────────┤
│                                     │
│  콘솔 출력 영역                        │
│  ✅ 분석 결과: {...}                 │
│                                     │
├─────────────────────────────────────┤
│ > fetch('/api/myeongri/analyze'... │ ← 여기에 입력
└─────────────────────────────────────┘
```

## 💡 팁

1. **여러 줄 코드 입력**: Shift + Enter로 줄바꿈 가능
2. **이전 명령어**: 위/아래 화살표 키로 이전 명령어 불러오기
3. **자동완성**: Tab 키로 자동완성
4. **콘솔 지우기**: `Ctrl + L` (Mac: `Cmd + K`)

## 🎯 더 쉬운 방법

**테스트 페이지를 사용하세요!**

1. `http://localhost:3000/test-myeongri` 접속
2. 버튼 클릭만 하면 됩니다!

이 방법이 훨씬 쉽고 직관적입니다. 😊
