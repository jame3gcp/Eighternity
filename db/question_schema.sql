-- 질문 답변 저장 테이블
-- 사용자별 질문 답변을 날짜별로 저장하여 재사용

CREATE TABLE question_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL, -- 질문한 날짜 (YYYY-MM-DD)
    category VARCHAR(20) NOT NULL CHECK (category IN ('love', 'money', 'work', 'health', 'move', 'meeting', 'contact')),
    question_text TEXT, -- 질문 내용 (선택적, 템플릿 ID만 있을 수도 있음)
    template_id VARCHAR(100), -- 질문 템플릿 ID (선택적)
    answer_json JSONB NOT NULL, -- QuestionAnswer 전체 저장
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date, category) -- 같은 날 같은 카테고리 질문은 하나만 저장
);

CREATE INDEX idx_question_answers_user_date ON question_answers(user_id, date);
CREATE INDEX idx_question_answers_category ON question_answers(category);
CREATE INDEX idx_question_answers_date ON question_answers(date);
