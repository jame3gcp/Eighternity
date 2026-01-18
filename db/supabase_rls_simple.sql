-- Supabase Row Level Security (RLS) 정책 (간소화 버전)
-- Service Role Key를 사용하는 경우 RLS를 비활성화하거나 간단한 정책 사용

-- Option 1: RLS 비활성화 (Service Role Key 사용 시)
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE life_logs DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE saju_charts DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE fortune_results DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE hybrid_recommendations DISABLE ROW LEVEL SECURITY;

-- Option 2: 모든 접근 허용 (개발 단계)
-- Service Role Key를 사용하면 이 정책들이 무시되므로 안전합니다.

-- users 테이블 RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 모든 사용자 접근 허용 (Service Role Key 사용 시 무시됨)
CREATE POLICY "Allow all for service role"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);

-- life_logs 테이블 RLS 활성화
ALTER TABLE life_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for service role"
  ON life_logs FOR ALL
  USING (true)
  WITH CHECK (true);

-- saju_charts 테이블 RLS 활성화
ALTER TABLE saju_charts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for service role"
  ON saju_charts FOR ALL
  USING (true)
  WITH CHECK (true);

-- fortune_results 테이블 RLS 활성화
ALTER TABLE fortune_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for service role"
  ON fortune_results FOR ALL
  USING (true)
  WITH CHECK (true);

-- hybrid_recommendations 테이블 RLS 활성화
ALTER TABLE hybrid_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for service role"
  ON hybrid_recommendations FOR ALL
  USING (true)
  WITH CHECK (true);

-- 참고: Service Role Key를 사용하면 RLS 정책을 우회할 수 있습니다.
-- 프로덕션 환경에서는 더 엄격한 정책을 설정하세요.
