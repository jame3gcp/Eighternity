/**
 * Supabase 클라이언트 설정
 * 
 * 환경변수:
 * - NEXT_PUBLIC_SUPABASE_URL: Supabase 프로젝트 URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Supabase Anon Key
 * - SUPABASE_SERVICE_ROLE_KEY: Supabase Service Role Key (서버 사이드 전용)
 */

// 동적 import로 패키지 로드 (패키지가 없어도 빌드 실패 방지)
// 서버 사이드에서만 사용되므로 런타임에 체크
let createClientFn: ((url: string, key: string, options?: any) => any) | null = null;
let isInitialized = false;

async function initializeSupabase() {
  if (isInitialized) return;
  isInitialized = true;

  try {
    // 서버 사이드에서만 동적 import
    if (typeof window === "undefined") {
      // @ts-ignore - 패키지가 설치되지 않았을 수 있음
      const supabaseModule = await import("@supabase/supabase-js");
      createClientFn = supabaseModule.createClient;
    }
  } catch (error) {
    // 패키지가 없으면 null로 처리
    createClientFn = null;
  }
}

// 클라이언트 사이드용 Supabase 클라이언트 (Anon Key 사용)
export async function createSupabaseClient() {
  await initializeSupabase();
  
  if (!createClientFn) {
    console.warn("@supabase/supabase-js not available, using memory store");
    return null;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not set, using memory store");
    return null;
  }

  return createClientFn(supabaseUrl, supabaseAnonKey);
}

// 서버 사이드용 Supabase 클라이언트
// Service Role Key가 있으면 사용 (RLS 우회), 없으면 Anon Key 사용
export async function createSupabaseServerClient() {
  await initializeSupabase();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    console.warn("Supabase URL not set, using memory store");
    return null;
  }

  if (!createClientFn) {
    console.warn("@supabase/supabase-js not available, using memory store");
    return null;
  }

  // Service Role Key가 있으면 우선 사용 (RLS 우회)
  if (supabaseServiceKey) {
    return createClientFn(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  // Anon Key만 있어도 사용 (RLS 정책 적용)
  if (supabaseAnonKey) {
    return createClientFn(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  console.warn("Supabase keys not set, using memory store");
  return null;
}

// 싱글톤 인스턴스 (서버 사이드)
let serverClient: Awaited<ReturnType<typeof createSupabaseServerClient>> | null = null;

export async function getSupabaseServerClient() {
  if (!serverClient) {
    serverClient = await createSupabaseServerClient();
  }
  return serverClient;
}
