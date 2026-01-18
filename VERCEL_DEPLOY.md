# Vercel 배포 가이드

## 🚀 배포 전 체크리스트

### 1. Next.js 버전 업데이트

현재 Next.js 14.1.0에 보안 취약점이 있습니다. 업데이트하세요:

```bash
npm install next@latest
```

### 2. Vercel 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

1. Vercel 프로젝트 > **Settings** > **Environment Variables**
2. 다음 변수 추가:

```
NEXT_PUBLIC_SUPABASE_URL
= https://nussjbinsyfrrnikvcra.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
= sb_publishable_ikOgIHbWGgQ2qP4-tdn9vQ_o4YPvKrt

SUPABASE_SERVICE_ROLE_KEY
= your-service-role-key-here
```

**중요:**
- `NEXT_PUBLIC_` 접두사가 있는 변수는 클라이언트에 노출됩니다
- `SUPABASE_SERVICE_ROLE_KEY`는 서버 사이드 전용이므로 `NEXT_PUBLIC_` 접두사 없이 설정
- 각 환경(Production, Preview, Development)에 모두 추가

### 3. 빌드 설정 확인

`vercel.json` 파일이 프로젝트 루트에 있는지 확인하세요.

### 4. 로컬에서 빌드 테스트

배포 전 로컬에서 빌드가 성공하는지 확인:

```bash
npm run build
```

## 🔍 일반적인 오류 및 해결

### 오류 1: "Module not found"

**원인:** 의존성 누락

**해결:**
```bash
# package.json 확인
npm install

# 로컬에서 빌드 테스트
npm run build
```

### 오류 2: "Type error" 또는 "Linting failed"

**원인:** TypeScript 타입 오류

**해결:**
```bash
# 타입 체크
npx tsc --noEmit

# 린트 실행
npm run lint
```

### 오류 3: "Environment variable not found"

**원인:** Vercel에 환경 변수가 설정되지 않음

**해결:**
1. Vercel 대시보드 > Settings > Environment Variables 확인
2. 모든 환경(Production, Preview, Development)에 변수 추가
3. 재배포

### 오류 4: "Build timeout"

**원인:** 빌드 시간 초과

**해결:**
- `vercel.json`에서 빌드 최적화
- 불필요한 의존성 제거
- 빌드 캐시 활용

## 📋 배포 단계

### 1. GitHub 연결 확인

Vercel 프로젝트가 GitHub 저장소와 연결되어 있는지 확인

### 2. 환경 변수 설정

위의 환경 변수 설정 섹션 참고

### 3. 배포 트리거

- GitHub에 push하면 자동 배포
- 또는 Vercel 대시보드에서 수동 배포

### 4. 배포 로그 확인

Vercel 대시보드 > Deployments > 최신 배포 > Build Logs 확인

## ✅ 배포 후 확인

1. **빌드 성공 확인**
   - Build Logs에서 "Build Completed" 확인

2. **환경 변수 확인**
   - Runtime Logs에서 환경 변수 로드 확인

3. **애플리케이션 동작 확인**
   - 배포된 URL 접속
   - 온보딩 플로우 테스트
   - Supabase 연결 확인

## 🐛 문제 발생 시

### 전체 오류 로그 확인

Vercel 대시보드에서:
1. **Deployments** > 최신 배포 클릭
2. **Build Logs** 탭에서 전체 로그 확인
3. 오류 메시지의 마지막 부분 확인

### 로컬 빌드 재현

```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# 빌드 테스트
npm run build
```

### Vercel CLI로 로컬 디버깅

```bash
# Vercel CLI 설치
npm i -g vercel

# 로컬에서 Vercel 환경으로 빌드
vercel build
```

## 📝 참고사항

- Vercel은 자동으로 Next.js를 감지합니다
- `vercel.json`은 선택사항이지만 빌드 최적화에 도움이 됩니다
- 환경 변수는 각 환경별로 별도 설정 가능합니다
- Production 환경의 환경 변수는 보안에 특히 주의하세요
