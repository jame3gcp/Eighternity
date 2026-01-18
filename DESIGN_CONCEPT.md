# Ethereal Utility: Eighternity Design System

## 1. Design Philosophy
- **불안을 자극하지 않는다**: 사주가 주는 '운명론적 공포'를 배제하고, 사용자에게 선택권을 주는 '안내자' 역할을 합니다.
- **일상에 스며든다**: 복잡한 사주 용어 대신 '오늘 할 수 있는 구체적 행동' 중심으로 제안합니다.
- **나에게 맞춘다**: 개인의 오행 밸런스를 시각화하여 왜 이런 조언이 나오는지 신뢰를 제공합니다.
- **신뢰와 감성의 균형**: 데이터 기반의 차분함(Utility)과 운세의 신비로움(Ethereal)을 Glassmorphism과 Gradient로 표현합니다.

## 2. Design Tokens (Ethereal Utility)

### Colors
- **Background**: `rgba(248, 250, 252, 1)` (Slate 50) - 깨끗하고 차분한 시작
- **Surface (Glass)**: `rgba(255, 255, 255, 0.7)` with `blur(12px)`
- **Primary (Compass)**: `rgba(99, 102, 241, 1)` (Indigo 500) - 방향성을 나타내는 핵심 색
- **Muted**: `rgba(148, 163, 184, 1)` (Slate 400) - 보조 설명 및 캡션

### Status Colors (No Fear Policy)
- **Good**: `rgba(34, 197, 94, 1)` (Green 500) - 활기찬 에너지
- **Normal**: `rgba(99, 102, 241, 1)` (Indigo 500) - 안정적인 흐름
- **Bad (Low Energy)**: `rgba(245, 158, 11, 1)` (Amber 500) - 주의와 휴식 (빨간색 지양)

### Five Elements (오행)
- **Wood (목)**: `rgba(52, 211, 153, 1)` (Emerald 400)
- **Fire (화)**: `rgba(251, 113, 133, 1)` (Rose 400)
- **Earth (토)**: `rgba(251, 191, 36, 1)` (Amber 400)
- **Metal (금)**: `rgba(148, 163, 184, 1)` (Slate 400)
- **Water (수)**: `rgba(96, 165, 250, 1)` (Blue 400)

## 3. UI System & Layout

### Grid & Spacing
- **Mobile First**: Max-width `480px`, Center aligned.
- **Safe Area**: Horizontal padding `16px` (1rem), Vertical spacing `24px`.
- **Radius**: Large components `24px`, Small components `12px`.

### Typography
- **Headlines**: `Pretendard`, Semi-bold, `text-2xl` for titles.
- **Body**: Medium, `text-base` (16px) for cards, `text-sm` (14px) for descriptions.
- **Metadata**: `text-xs` (12px), Tracking-wide.

## 4. Screen Architecture (Wireframe)

### [Home] 오늘의 나침반
1. **Top Bar**: 앱 로고(Eighternity) + 알림 아이콘
2. **CompassCard**: 
   - "오늘의 한 문장" (가장 크게)
   - 전반적 흐름 배지 (Good/Normal/Low)
   - 배경: 부드러운 오행 그라데이션
3. **DomainScores**: 직업/연애/재물/건강 4분할 그리드 카드
4. **Do/Don't**: 두 개의 컬러 블록 (Green-ish / Amber-ish)
5. **Tiny Routine**: "오늘의 5분 루틴" 실천 체크 리스트

### [Ask] 사주 비서
1. **Category Tabs**: 연애운, 금전운, 이동수 등 칩 선택
2. **Prompt Templates**: "이번 달 이사해도 될까요?" 등 클릭 가능한 질문
3. **AnswerCard**: AI가 요약한 3단계 답변 (요약 - 이유 - 액션 플랜)

### [Profile] 나의 균형
1. **FiveElementsChart**: 도넛 차트 또는 방사형 차트로 내 사주 구성 시각화
2. **Personal Strengths**: "당신은 물의 기운이 강해 유연합니다" 식의 설명
3. **Routine Recommendations**: 내 부족한 기운을 채우는 생활 습관 추천
