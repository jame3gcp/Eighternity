CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    birth_date DATE NOT NULL,
    birth_time TIME,
    gender CHAR(1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE saju_charts (
    user_id UUID REFERENCES users(id),
    pillars JSONB NOT NULL,
    five_elements JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE fortune_results (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    target_date DATE NOT NULL,
    score INT NOT NULL,
    result_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 라이프 로그 테이블
CREATE TABLE life_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    date DATE NOT NULL,
    mood VARCHAR(20) NOT NULL CHECK (mood IN ('excellent', 'good', 'normal', 'bad', 'terrible')),
    condition VARCHAR(20) NOT NULL CHECK (condition IN ('excellent', 'good', 'normal', 'bad', 'terrible')),
    sleep VARCHAR(20) NOT NULL CHECK (sleep IN ('excellent', 'good', 'normal', 'bad', 'terrible')),
    schedule VARCHAR(20) NOT NULL CHECK (schedule IN ('very_busy', 'busy', 'normal', 'light', 'free')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- 인덱스 추가
CREATE INDEX idx_life_logs_user_date ON life_logs(user_id, date);
CREATE INDEX idx_life_logs_date ON life_logs(date);

-- 하이브리드 추천 결과 저장 (선택적)
CREATE TABLE hybrid_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    target_date DATE NOT NULL,
    saju_score INT NOT NULL,
    adjusted_scores JSONB NOT NULL,
    recommendation_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, target_date)
);

CREATE INDEX idx_hybrid_recommendations_user_date ON hybrid_recommendations(user_id, target_date);
