/**
 * Supabase 연결 테스트 스크립트
 * 
 * 실행 방법:
 * npx tsx scripts/test-supabase.ts
 * 또는
 * npm run test:supabase (package.json에 스크립트 추가 필요)
 */

async function testSupabaseConnection() {
  console.log("🔍 Supabase 연결 테스트 시작...\n");

  // 환경 변수 확인
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("📋 환경 변수 확인:");
  console.log(`  - NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? "✅ 설정됨" : "❌ 없음"}`);
  console.log(`  - NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? "✅ 설정됨" : "❌ 없음"}`);
  console.log(`  - SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? "✅ 설정됨" : "⚠️  없음 (선택사항)"}\n`);

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ 필수 환경 변수가 설정되지 않았습니다.");
    console.log("\n💡 .env.local 파일에 다음을 추가하세요:");
    console.log("NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co");
    console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key");
    process.exit(1);
  }

  // 패키지 확인
  let createClient: any;
  try {
    const supabaseModule = await import("@supabase/supabase-js");
    createClient = supabaseModule.createClient;
    console.log("✅ @supabase/supabase-js 패키지 확인됨\n");
  } catch (error) {
    console.error("❌ @supabase/supabase-js 패키지가 설치되지 않았습니다.");
    console.log("\n💡 다음 명령어로 설치하세요:");
    console.log("npm install @supabase/supabase-js");
    process.exit(1);
  }

  // Supabase 클라이언트 생성
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log("🔌 Supabase 클라이언트 생성 완료\n");

  // 연결 테스트 - 간단한 쿼리 실행
  try {
    console.log("🧪 데이터베이스 연결 테스트 중...");
    
    // life_logs 테이블 존재 확인 (간단한 쿼리)
    const { data, error } = await supabase
      .from("life_logs")
      .select("count", { count: "exact", head: true })
      .limit(0);

    if (error) {
      // 테이블이 없을 수 있음 (정상)
      if (error.code === "PGRST116" || error.message.includes("relation") || error.message.includes("does not exist")) {
        console.log("⚠️  life_logs 테이블이 아직 생성되지 않았습니다.");
        console.log("💡 Supabase 대시보드에서 db/schema.sql을 실행하세요.\n");
      } else {
        throw error;
      }
    } else {
      console.log("✅ 데이터베이스 연결 성공!");
      console.log(`   - life_logs 테이블 확인됨\n`);
    }

    // API 엔드포인트 테스트
    console.log("🧪 Supabase API 엔드포인트 테스트 중...");
    const healthCheck = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: supabaseAnonKey,
      },
    });

    if (healthCheck.ok) {
      console.log("✅ Supabase API 엔드포인트 접근 가능\n");
    } else {
      console.log(`⚠️  API 엔드포인트 응답: ${healthCheck.status} ${healthCheck.statusText}\n`);
    }

    console.log("🎉 Supabase 연결 테스트 완료!");
    console.log("\n📝 다음 단계:");
    console.log("1. Supabase 대시보드에서 db/schema.sql 실행");
    console.log("2. (선택) db/supabase_rls.sql 실행 (보안 정책)");
    console.log("3. 개발 서버 재시작: npm run dev");

  } catch (error: any) {
    console.error("❌ 연결 테스트 실패:");
    console.error(`   ${error.message}`);
    if (error.code) {
      console.error(`   코드: ${error.code}`);
    }
    process.exit(1);
  }
}

// 스크립트 실행
testSupabaseConnection().catch((error) => {
  console.error("❌ 예상치 못한 오류:", error);
  process.exit(1);
});
