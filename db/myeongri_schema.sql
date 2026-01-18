-- 명리학 분석 결과 저장 테이블
-- 사용자별 명리학 분석 결과를 저장하여 재사용

CREATE TABLE myeongri_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    analysis_result JSONB NOT NULL, -- MyeongriAnalysisResponse 전체 저장
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id) -- 사용자당 하나의 분석 결과만 저장
);

CREATE INDEX idx_myeongri_analyses_user ON myeongri_analyses(user_id);
CREATE INDEX idx_myeongri_analyses_created ON myeongri_analyses(created_at);
