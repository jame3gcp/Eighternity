# RLS 정책 설정 가이드

## 현재 상황

RLS 정책을 Supabase에서 실행하셨습니다. 현재 애플리케이션은 Supabase Auth를 사용하지 않으므로, 정책에 따라 추가 설정이 필요할 수 있습니다.

## 확인 방법

### 1. 실행한 SQL 확인

Supabase 대시보드 > SQL Editor > History에서 실행한 SQL을 확인하세요.

**`supabase_rls.sql` 실행한 경우:**
- `auth.uid() = id` 또는 `auth.uid()::text = user_id::text` 사용
- **Service Role Key 필수**

**`supabase_rls_simple.sql` 실행한 경우:**
- `USING (true)` 사용
- **Anon Key만으로도 작동**

### 2. Service Role Key 설정 (필요한 경우)

`.env.local` 파일에 추가:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://nussjbinsyfrrnikvcra.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ikOgIHbWGgQ2qP4-tdn9vQ_o4YPvKrt

# Service Role Key (RLS 우회)
# Supabase 대시보드 > Settings > API > service_role key 복사
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Service Role Key 찾는 방법:**
1. Supabase 대시보드 접속
2. Settings > API
3. `service_role` 섹션의 `secret` 키 복사
4. `.env.local`에 `SUPABASE_SERVICE_ROLE_KEY`로 추가

## 테스트 방법

### 1. 개발 서버 재시작

```bash
npm run dev
```

### 2. 온보딩 테스트

1. 브라우저에서 `http://localhost:3000/onboarding` 접속
2. 생년월일 입력 후 제출
3. 콘솔 로그 확인:
   - ✅ "User created" 또는 "User found" 메시지
   - ❌ "Supabase query error" 메시지가 있으면 RLS 정책 문제

### 3. Supabase 대시보드 확인

1. Supabase 대시보드 > Table Editor
2. `users` 테이블 확인
3. 데이터가 생성되었는지 확인

## 문제 해결

### 문제 1: "permission denied" 또는 "new row violates row-level security policy" 오류

**원인:** `supabase_rls.sql`을 실행했지만 Service Role Key가 설정되지 않음

**해결:**
1. Service Role Key를 `.env.local`에 추가
2. 개발 서버 재시작

### 문제 2: "Supabase query error" 콘솔 로그

**원인:** RLS 정책이 너무 엄격하거나 환경 변수가 잘못됨

**해결:**
1. `.env.local` 파일 확인
2. Service Role Key가 올바른지 확인
3. 필요하면 `supabase_rls_simple.sql` 재실행

### 문제 3: 데이터가 저장되지 않음

**원인:** RLS 정책이 모든 접근을 차단

**해결:**
1. Supabase 대시보드 > Authentication > Policies 확인
2. 정책이 올바르게 생성되었는지 확인
3. 필요하면 `supabase_rls_simple.sql` 재실행

## 권장 설정

### 개발 단계
- `supabase_rls_simple.sql` 사용
- Service Role Key 설정 (선택사항)

### 프로덕션 단계
- `supabase_rls.sql` 사용
- Service Role Key 필수
- 또는 Supabase Auth 통합
