# Supabase 설정 가이드

## ✅ 완료된 작업

1. ✅ Supabase 클라이언트 코드 통합
2. ✅ 라이프 로그 저장소를 Supabase로 마이그레이션
3. ✅ 패키지 의존성 추가

## 📦 다음 단계

### 1. 패키지 설치

```bash
npm install @supabase/supabase-js
```

### 2. 환경 변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하고 다음 내용을 추가하세요:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://nussjbinsyfrrnikvcra.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ikOgIHbWGgQ2qP4-tdn9vQ_o4YPvKrt

# Service Role Key (선택사항 - 서버 사이드 전용)
# Supabase 대시보드 > Settings > API에서 확인 가능
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase 데이터베이스 스키마 설정

1. Supabase 대시보드 접속: https://supabase.com/dashboard
2. 프로젝트 선택
3. SQL Editor로 이동
4. `db/schema.sql` 파일의 내용을 실행
5. `db/supabase_rls.sql` 파일의 내용을 실행 (보안 정책)

### 4. Service Role Key 확인 (선택사항)

서버 사이드에서 RLS를 우회하려면:
1. Supabase 대시보드 > Settings > API
2. `service_role` key 복사
3. `.env.local`에 `SUPABASE_SERVICE_ROLE_KEY`로 추가

⚠️ **주의**: Service Role Key는 서버 사이드에서만 사용하고, 클라이언트에 노출하지 마세요!

## 🔄 동작 방식

현재 구현은 다음 순서로 시도합니다:

1. **Supabase** (우선)
2. **PostgreSQL 직접 연결** (DATABASE_URL이 있는 경우)
3. **메모리 저장소** (폴백)

이렇게 하면 Supabase가 설정되지 않아도 기존 방식으로 동작합니다.

## 🧪 테스트

설정 완료 후:

1. 개발 서버 재시작
   ```bash
   npm run dev
   ```

2. 라이프 로그 입력 테스트
   - 홈 페이지에서 "입력" 버튼 클릭
   - 데이터 입력 후 저장
   - Supabase 대시보드에서 `life_logs` 테이블 확인

## 📝 참고사항

- `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.
- 프로덕션 환경에서는 Vercel, Netlify 등의 환경 변수 설정을 사용하세요.
