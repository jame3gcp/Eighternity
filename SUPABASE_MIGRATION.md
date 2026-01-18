# Supabase 마이그레이션 가이드

## 📊 Supabase 적합성 분석

### ✅ Supabase가 적합한 이유

1. **PostgreSQL 호환성**
   - 현재 스키마가 PostgreSQL 기반 → Supabase와 100% 호환
   - 기존 SQL 쿼리 그대로 사용 가능
   - JSONB, UUID 등 모든 기능 지원

2. **무료 티어로 시작 가능**
   - 50,000 MAU (월간 활성 사용자)
   - 500 MB 데이터베이스
   - 1 GB 파일 저장소
   - MVP 단계에서 충분

3. **개발 속도 향상**
   - 자동 생성 API (REST/GraphQL)
   - 관리 대시보드 제공
   - 인증 시스템 내장 (현재 쿠키 기반 → 개선 가능)

4. **운영 부담 감소**
   - 자동 백업 및 복구
   - 자동 스케일링
   - 모니터링 및 로깅 내장

5. **향후 확장성**
   - 실시간 기능 (Realtime) - 실시간 추천 업데이트 가능
   - 파일 스토리지 - 사용자 프로필 이미지 등
   - Edge Functions - 서버리스 함수

### ⚠️ 고려사항

1. **Free Tier 제한**
   - 7일간 비활성 시 자동 일시 중지
   - 프로덕션 환경에서는 Pro 플랜($25/월) 권장

2. **비용 증가 가능성**
   - 사용자 증가 시 Pro 플랜 필요
   - 데이터 저장량, 네트워크 전송량에 따른 추가 비용

3. **Vendor Lock-in**
   - Supabase 특화 기능 사용 시 마이그레이션 어려움
   - 하지만 PostgreSQL 표준 사용 시 문제 없음

## 🚀 마이그레이션 계획

### Phase 1: Supabase 프로젝트 생성 및 설정

1. Supabase 프로젝트 생성
   - https://supabase.com 접속
   - 새 프로젝트 생성
   - Database URL 및 API Key 복사

2. 환경 변수 설정
   ```bash
   # .env.local
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### Phase 2: 스키마 마이그레이션

1. Supabase SQL Editor에서 스키마 실행
   - `db/schema.sql` 파일 내용을 그대로 실행
   - Row Level Security (RLS) 정책 추가

2. 인덱스 및 제약조건 확인

### Phase 3: 코드 마이그레이션

1. Supabase 클라이언트 설치
   ```bash
   npm install @supabase/supabase-js
   ```

2. DB 클라이언트 교체
   - `lib/db/client.ts` → Supabase 클라이언트로 교체
   - 기존 쿼리 로직은 유지, Supabase 메서드로 변환

3. 인증 시스템 개선 (선택사항)
   - 쿠키 기반 → Supabase Auth로 전환
   - 더 안전하고 확장 가능한 인증

## 💰 비용 예상

### Free Tier (MVP 단계)
- ✅ 무료
- ✅ 50,000 MAU
- ✅ 500 MB DB
- ⚠️ 7일 비활성 시 일시 중지

### Pro Plan (프로덕션)
- 💰 $25/월
- ✅ 무제한 MAU
- ✅ 8 GB DB
- ✅ 100 GB 파일 저장소
- ✅ 7일 백업 보관
- ✅ 24/7 가용성

## 📝 다음 단계

1. Supabase 프로젝트 생성
2. 스키마 마이그레이션
3. 코드 통합
4. 테스트 및 검증
