# Eighternity - 사주 기반 하이브리드 추천 시스템

Next.js 14 기반의 사주(四柱) 운세 애플리케이션으로, 전통 사주와 실제 생활 데이터를 결합한 맞춤형 추천을 제공합니다.

## 🎯 주요 기능

- **사주 계산**: 정확한 간지(干支) 기반 사주 분석
- **하이브리드 추천**: 사주 + 라이프 로그 결합 추천
- **라이프 로그**: 기분, 컨디션, 수면, 일정 기록
- **실시간 운세**: 오늘의 운세 및 캘린더 운세 제공

## 🛠 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Validation**: Zod
- **Icons**: Lucide React

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 데이터베이스 설정

1. Supabase 프로젝트 생성
2. SQL Editor에서 `db/schema.sql` 실행
3. RLS 정책 설정 (`db/supabase_rls.sql` 또는 `db/supabase_rls_simple.sql`)

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 📁 프로젝트 구조

```
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   ├── home/              # 홈 페이지
│   └── onboarding/        # 온보딩 페이지
├── components/            # React 컴포넌트
├── lib/                   # 비즈니스 로직
│   ├── contracts/         # Zod 스키마
│   ├── db/                # 데이터베이스 클라이언트
│   ├── engine/            # 사주 계산 엔진
│   └── storage/           # 데이터 저장소
├── db/                    # 데이터베이스 스키마
└── rules/                 # 사주 규칙 및 메시지

```

## 🔧 주요 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린트 검사
npm run lint
```

## 📚 문서

- [AGENTS.md](./AGENTS.md) - 개발 가이드라인
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - 테스트 가이드
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Supabase 설정 가이드
- [RLS_SETUP_GUIDE.md](./RLS_SETUP_GUIDE.md) - RLS 정책 설정 가이드

## 🔐 보안 주의사항

- `.env.local` 파일은 절대 커밋하지 마세요
- Service Role Key는 서버 사이드에서만 사용하세요
- 프로덕션 환경에서는 RLS 정책을 엄격하게 설정하세요

## 📄 라이선스

MIT
