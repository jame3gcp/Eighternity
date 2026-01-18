# Service Role Key 설정 가이드

## ⚠️ 중요: 엄격한 RLS 정책 사용 중

현재 실행하신 RLS 정책은 `auth.uid()`를 사용하는 **엄격한 정책**입니다.
현재 애플리케이션은 Supabase Auth를 사용하지 않으므로, **Service Role Key가 필수**입니다.

## 🔑 Service Role Key 설정 방법

### 1. Supabase 대시보드에서 Service Role Key 찾기

1. Supabase 대시보드 접속: https://supabase.com/dashboard
2. 프로젝트 선택
3. 좌측 메뉴에서 **Settings** 클릭
4. **API** 메뉴 클릭
5. **Project API keys** 섹션에서:
   - `service_role` 섹션 찾기
   - `secret` 키 복사 (⚠️ 이 키는 절대 공개하지 마세요!)

### 2. `.env.local` 파일에 추가

프로젝트 루트 디렉토리의 `.env.local` 파일을 열고 다음을 추가:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://nussjbinsyfrrnikvcra.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ikOgIHbWGgQ2qP4-tdn9vQ_o4YPvKrt

# Service Role Key (필수 - RLS 우회)
SUPABASE_SERVICE_ROLE_KEY=여기에_복사한_service_role_key_붙여넣기
```

### 3. 개발 서버 재시작

```bash
# 서버 중지 (Ctrl+C)
# 서버 재시작
npm run dev
```

## ✅ 확인 방법

### 1. 온보딩 테스트

1. 브라우저에서 `http://localhost:3000/onboarding` 접속
2. 생년월일 입력 후 제출
3. 콘솔 로그 확인:
   - ✅ 성공: "User created" 또는 "User found" 메시지
   - ❌ 실패: "permission denied" 또는 "new row violates row-level security policy" 오류

### 2. Supabase 대시보드 확인

1. Supabase 대시보드 > **Table Editor**
2. `users` 테이블 클릭
3. 데이터가 생성되었는지 확인

## 🚨 문제 해결

### 문제 1: "permission denied" 오류

**원인:** Service Role Key가 설정되지 않았거나 잘못됨

**해결:**
1. `.env.local` 파일에 `SUPABASE_SERVICE_ROLE_KEY`가 올바르게 설정되었는지 확인
2. Service Role Key가 정확히 복사되었는지 확인 (공백 없이)
3. 개발 서버 재시작

### 문제 2: "Supabase query error" 콘솔 로그

**원인:** Service Role Key가 없거나 환경 변수가 로드되지 않음

**해결:**
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 파일 이름이 정확히 `.env.local`인지 확인 (`.env` 아님)
3. 개발 서버 완전히 재시작

### 문제 3: 여전히 작동하지 않음

**대안:** 간단한 RLS 정책으로 변경

Supabase SQL Editor에서 다음 실행:

```sql
-- 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
-- ... (모든 정책 삭제)

-- 간단한 정책 적용 (모든 접근 허용)
CREATE POLICY "Allow all for service role"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);

-- 다른 테이블에도 동일하게 적용
-- (db/supabase_rls_simple.sql 참고)
```

## 📝 참고사항

- **Service Role Key는 절대 공개하지 마세요!**
- `.env.local` 파일은 `.gitignore`에 포함되어 있어야 합니다
- 프로덕션 환경에서는 더 엄격한 보안 정책을 고려하세요
