/**
 * Supabase 연결 간단 확인 스크립트 (Node.js 기본 모듈만 사용)
 * 패키지 설치 없이도 실행 가능
 */

const https = require('https');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nussjbinsyfrrnikvcra.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ikOgIHbWGgQ2qP4-tdn9vQ_o4YPvKrt';

console.log('🔍 Supabase 연결 확인 중...\n');
console.log(`URL: ${SUPABASE_URL}`);
console.log(`Anon Key: ${SUPABASE_ANON_KEY.substring(0, 20)}...\n`);

// REST API 엔드포인트 테스트
const url = new URL(`${SUPABASE_URL}/rest/v1/`);
const options = {
  hostname: url.hostname,
  port: 443,
  path: url.pathname,
  method: 'GET',
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  },
};

const req = https.request(options, (res) => {
  console.log(`📡 HTTP 상태 코드: ${res.statusCode}`);
  
  if (res.statusCode === 200 || res.statusCode === 404) {
    console.log('✅ Supabase API 엔드포인트 접근 가능!\n');
    console.log('💡 다음 단계:');
    console.log('1. npm install @supabase/supabase-js');
    console.log('2. Supabase 대시보드에서 db/schema.sql 실행');
    console.log('3. 개발 서버 재시작: npm run dev');
  } else {
    console.log(`⚠️  예상치 못한 응답: ${res.statusCode}`);
  }
  
  res.on('data', () => {});
  res.on('end', () => {
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error('❌ 연결 실패:', error.message);
  console.log('\n💡 확인사항:');
  console.log('1. 인터넷 연결 확인');
  console.log('2. Supabase URL이 올바른지 확인');
  console.log('3. Supabase 프로젝트가 활성화되어 있는지 확인');
  process.exit(1);
});

req.end();
