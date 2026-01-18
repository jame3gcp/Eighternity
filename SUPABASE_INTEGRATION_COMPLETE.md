# Supabase 통합 완료 가이드

## ✅ 완료된 작업

1. ✅ Supabase 클라이언트 통합
2. ✅ 사용자 자동 생성/조회 로직 추가
3. ✅ 라이프 로그 저장소 Supabase 연동
4. ✅ UUID 기반 사용자 관리
5. ✅ 온보딩 시 사용자 및 사주 차트 저장

## 🔧 주요 변경사항

### 1. 사용자 관리 개선
- `lib/storage/userStore.ts`: birthDate 기반으로 UUID 자동 생성/조회
- 온보딩 시 `users` 테이블에 자동 저장
- 쿠키에 `userId` (UUID) 저장

### 2. 라이프 로그 저장소
- UUID 또는 birthDate 모두 지원
- Supabase 우선 사용
- 자동 폴백 메커니즘

### 3. RLS 정책
- `db/supabase_rls_simple.sql`: 개발용 간단한 정책
- Service Role Key 사용 시 RLS 우회 가능

## 📋 Supabase 설정 확인사항

### 1. RLS 정책 설정

**옵션 A: Service Role Key 사용 (권장)**
- `.env.local`에 `SUPABASE_SERVICE_ROLE_KEY` 추가
- RLS를 우회하므로 모든 정책 무시
- 가장 간단하고 빠름

**옵션 B: 간단한 RLS 정책 사용**
- Supabase SQL Editor에서 `db/supabase_rls_simple.sql` 실행
- 모든 접근 허용 (개발 단계)

**옵션 C: 엄격한 RLS 정책 (프로덕션)**
- `db/supabase_rls.sql` 실행
- Supabase Auth와 함께 사용 필요

### 2. 환경 변수 확인

`.env.local` 파일:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://nussjbinsyfrrnikvcra.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ikOgIHbWGgQ2qP4-tdn9vQ_o4YPvKrt

# 선택사항 (Service Role Key - RLS 우회)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. 데이터베이스 스키마 확인

Supabase 대시보드에서 다음 테이블이 생성되었는지 확인:
- ✅ `users`
- ✅ `life_logs`
- ✅ `saju_charts`
- ✅ `fortune_results`
- ✅ `hybrid_recommendations`

## 🧪 테스트 방법

### 1. 온보딩 테스트
1. `/onboarding` 페이지 접속
2. 생년월일 입력
3. Supabase 대시보드에서 `users` 테이블 확인

### 2. 라이프 로그 테스트
1. 홈 페이지에서 "입력" 버튼 클릭
2. 기분, 컨디션, 수면, 일정 입력
3. 저장 후 Supabase 대시보드에서 `life_logs` 테이블 확인

### 3. 하이브리드 추천 테스트
1. 라이프 로그 입력 후 홈 페이지 새로고침
2. 하이브리드 추천 배지 확인
3. 추천 메시지에 라이프 로그 반영 확인

## 🔍 문제 해결

### 오류: "new row violates row-level security policy"
**원인**: RLS 정책이 설정되어 있지만 Service Role Key가 없음
**해결**: 
1. `SUPABASE_SERVICE_ROLE_KEY` 추가, 또는
2. `db/supabase_rls_simple.sql` 실행

### 오류: "relation does not exist"
**원인**: 테이블이 생성되지 않음
**해결**: Supabase SQL Editor에서 `db/schema.sql` 실행

### 데이터가 저장되지 않음
**확인사항**:
1. Supabase 클라이언트가 정상 초기화되는지 확인
2. 콘솔 로그 확인
3. Supabase 대시보드에서 직접 쿼리 테스트

## 📊 데이터 흐름

```
온보딩
  ↓
users 테이블에 사용자 생성 (UUID)
  ↓
쿠키에 userId 저장
  ↓
라이프 로그 입력
  ↓
life_logs 테이블에 저장 (user_id = UUID)
  ↓
하이브리드 추천 생성
  ↓
사주 + 라이프 로그 결합 분석
```

## 🎉 완료!

이제 Supabase가 완전히 통합되었습니다. 모든 데이터가 Supabase에 저장되며, 자동 백업과 확장성을 제공합니다.
