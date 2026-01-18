/**
 * PostgreSQL 데이터베이스 연결 유틸리티
 * 
 * 환경변수:
 * - DATABASE_URL: PostgreSQL 연결 문자열
 * 
 * 사용 예시:
 * ```typescript
 * const db = getDbClient();
 * const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
 * ```
 */

// 개발 환경에서는 메모리 저장소 사용, 프로덕션에서는 실제 DB 사용
const USE_DATABASE = process.env.DATABASE_URL !== undefined;

let dbClient: any = null;

/**
 * 데이터베이스 클라이언트 가져오기
 * DATABASE_URL이 설정되어 있지 않으면 null 반환 (메모리 저장소 사용)
 */
export async function getDbClient() {
  if (!USE_DATABASE) {
    return null;
  }

  if (dbClient) {
    return dbClient;
  }

  try {
    // 동적 import로 pg 라이브러리 로드
    // Next.js 서버 사이드에서만 작동
    if (typeof window !== "undefined") {
      return null; // 클라이언트 사이드에서는 DB 사용 불가
    }
    
    // pg 모듈이 설치되어 있는지 확인
    let pgModule;
    try {
      pgModule = await import("pg");
    } catch (importError: any) {
      // pg 모듈이 설치되지 않은 경우
      if (importError.code === "MODULE_NOT_FOUND" || importError.message?.includes("Cannot resolve")) {
        console.warn("pg module not found, using memory store. Install with: npm install pg");
        return null;
      }
      throw importError;
    }
    
    const { Pool } = pgModule;
    
    dbClient = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    });

    return dbClient;
  } catch (error) {
    // pg 라이브러리가 설치되지 않았거나 연결 실패
    console.warn("Database connection not available, using memory store:", error);
    return null;
  }
}

/**
 * 데이터베이스 쿼리 실행
 * DB가 없으면 null 반환
 */
export async function dbQuery<T = any>(
  query: string,
  params?: any[]
): Promise<T[] | null> {
  const client = await getDbClient();
  if (!client) {
    return null;
  }

  try {
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

/**
 * 데이터베이스 연결 종료
 */
export async function closeDbConnection() {
  if (dbClient) {
    await dbClient.end();
    dbClient = null;
  }
}
