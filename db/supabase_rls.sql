-- Supabase Row Level Security (RLS) 정책
-- 사용자별 데이터 접근 제어

-- users 테이블 RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 데이터만 조회 가능
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- 사용자는 자신의 데이터만 수정 가능
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- 사용자는 자신의 데이터만 삽입 가능
CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- life_logs 테이블 RLS 활성화
ALTER TABLE life_logs ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 라이프 로그만 조회 가능
CREATE POLICY "Users can view own life logs"
  ON life_logs FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- 사용자는 자신의 라이프 로그만 수정 가능
CREATE POLICY "Users can update own life logs"
  ON life_logs FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- 사용자는 자신의 라이프 로그만 삽입 가능
CREATE POLICY "Users can insert own life logs"
  ON life_logs FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

-- 사용자는 자신의 라이프 로그만 삭제 가능
CREATE POLICY "Users can delete own life logs"
  ON life_logs FOR DELETE
  USING (auth.uid()::text = user_id::text);

-- saju_charts 테이블 RLS 활성화
ALTER TABLE saju_charts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saju charts"
  ON saju_charts FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own saju charts"
  ON saju_charts FOR UPDATE
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own saju charts"
  ON saju_charts FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

-- fortune_results 테이블 RLS 활성화
ALTER TABLE fortune_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own fortune results"
  ON fortune_results FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own fortune results"
  ON fortune_results FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

-- hybrid_recommendations 테이블 RLS 활성화
ALTER TABLE hybrid_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own hybrid recommendations"
  ON hybrid_recommendations FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own hybrid recommendations"
  ON hybrid_recommendations FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);
