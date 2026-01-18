# 🔧 OpenAI API 키 문제 해결 가이드

## ❌ "OpenAI client not available" 오류 해결

### 1단계: .env.local 파일 확인

`.env.local` 파일이 프로젝트 루트에 있는지 확인:

```bash
# 프로젝트 루트에서
ls -la .env.local
```

### 2단계: API 키 형식 확인

`.env.local` 파일 내용 확인:

```bash
# 파일 내용 확인 (비밀번호는 숨겨짐)
cat .env.local | grep OPENAI
```

**올바른 형식:**
```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**주의사항:**
- `=` 앞뒤에 공백 없어야 함
- 따옴표(`"` 또는 `'`) 없이 직접 입력
- `sk-`로 시작해야 함

### 3단계: 개발 서버 재시작

**중요:** `.env.local` 파일을 수정한 후에는 **반드시 개발 서버를 재시작**해야 합니다!

```bash
# 1. 현재 실행 중인 서버 중지 (Ctrl + C)
# 2. 서버 재시작
npm run dev
```

### 4단계: 서버 로그 확인

개발 서버를 시작하면 다음과 같은 로그가 표시되어야 합니다:

```
✅ openai 패키지 로드 성공
✅ OPENAI_API_KEY 발견 (길이: XX 자)
✅ OpenAI 클라이언트 생성 완료
```

만약 다음과 같은 로그가 보이면:

```
❌ OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.
```

→ `.env.local` 파일을 확인하고 서버를 재시작하세요.

### 5단계: 패키지 설치 확인

`openai` 패키지가 설치되어 있는지 확인:

```bash
npm list openai
```

설치되어 있지 않으면:

```bash
npm install openai
```

## 🔍 상세 진단

### 환경 변수 테스트

서버 로그에서 다음을 확인:

1. **패키지 로드 확인:**
   ```
   ✅ openai 패키지 로드 성공
   ```
   또는
   ```
   ❌ openai 패키지 로드 실패: ...
   ```

2. **API 키 확인:**
   ```
   ✅ OPENAI_API_KEY 발견 (길이: XX 자)
   ```
   또는
   ```
   ❌ OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.
   ```

3. **클라이언트 생성 확인:**
   ```
   ✅ OpenAI 클라이언트 생성 완료
   ```

### 일반적인 문제

#### 문제 1: 환경 변수가 로드되지 않음

**원인:**
- `.env.local` 파일이 잘못된 위치에 있음
- 파일 이름이 틀림 (`.env.local`이어야 함)
- 서버를 재시작하지 않음

**해결:**
1. 프로젝트 루트에 `.env.local` 파일이 있는지 확인
2. 파일 내용 확인
3. 서버 재시작

#### 문제 2: API 키 형식 오류

**원인:**
- 따옴표로 감싸져 있음
- 공백이 포함됨
- 잘못된 키

**해결:**
```bash
# 잘못된 예
OPENAI_API_KEY="sk-..."
OPENAI_API_KEY = sk-...

# 올바른 예
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### 문제 3: 패키지가 설치되지 않음

**원인:**
- `openai` 패키지가 `node_modules`에 없음

**해결:**
```bash
npm install openai
```

## ✅ 성공 확인

다음 로그가 모두 보이면 성공:

```
🔍 OpenAI 초기화 시작...
✅ openai 패키지 로드 성공
✅ OPENAI_API_KEY 발견 (길이: 51 자)
✅ OpenAI 클라이언트 생성 완료
✅ OpenAI client initialized, starting analysis...
📤 OpenAI API 요청 전송 중...
📥 OpenAI 응답 수신 완료
✅ JSON 파싱 완료
✅ 명리학 분석 완료!
```

## 🆘 여전히 문제가 있다면

1. **서버 로그 전체 확인** - 오류 메시지의 정확한 내용 확인
2. **.env.local 파일 재확인** - 파일 내용이 올바른지 확인
3. **서버 완전 재시작** - 프로세스를 종료하고 다시 시작
4. **패키지 재설치** - `npm install openai` 다시 실행
