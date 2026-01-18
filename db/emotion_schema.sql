-- 감정 분석 및 패턴 모델링 테이블

-- 감정 분석 결과 저장
CREATE TABLE emotion_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    date DATE NOT NULL,
    emotion_wave JSONB NOT NULL, -- 감정 파형 데이터
    pattern_type VARCHAR(20) NOT NULL CHECK (pattern_type IN ('emotional', 'analytical', 'avoidant', 'immersive', 'empathetic')),
    pattern_confidence DECIMAL(3,2) NOT NULL CHECK (pattern_confidence >= 0 AND pattern_confidence <= 1),
    behavior_correlations JSONB NOT NULL, -- 행동 상관 매트릭스
    language_pattern JSONB, -- 언어 패턴 분석
    ai_comment TEXT NOT NULL,
    future_rhythm JSONB NOT NULL, -- 미래 리듬 예측
    feedback JSONB NOT NULL, -- 조언 피드백
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

CREATE INDEX idx_emotion_analyses_user_date ON emotion_analyses(user_id, date);
CREATE INDEX idx_emotion_analyses_date ON emotion_analyses(date);
CREATE INDEX idx_emotion_analyses_pattern ON emotion_analyses(pattern_type);

-- 감정 파형 상세 데이터 (시간별)
CREATE TABLE emotion_wave_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID REFERENCES emotion_analyses(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    emotion VARCHAR(20) NOT NULL,
    intensity INT NOT NULL CHECK (intensity >= 0 AND intensity <= 100),
    context TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_emotion_wave_points_analysis ON emotion_wave_points(analysis_id);
CREATE INDEX idx_emotion_wave_points_timestamp ON emotion_wave_points(timestamp);

-- 패턴 추적 데이터 (주/월 단위 집계)
CREATE TABLE pattern_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    period_type VARCHAR(10) NOT NULL CHECK (period_type IN ('week', 'month')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    trends JSONB NOT NULL, -- 트렌드 데이터
    summary TEXT NOT NULL,
    insights JSONB NOT NULL, -- 인사이트 배열
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, period_type, start_date)
);

CREATE INDEX idx_pattern_tracks_user_period ON pattern_tracks(user_id, period_type, start_date);

-- AI 코칭 대화 기록
CREATE TABLE emotion_coaching_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    session_date DATE NOT NULL,
    messages JSONB NOT NULL, -- 대화 메시지 배열
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_coaching_sessions_user_date ON emotion_coaching_sessions(user_id, session_date);
