import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { LifeLogRequestSchema, LifeLogResponseSchema } from "@/lib/contracts/lifelog";
import { lifelogStore } from "@/lib/storage/lifelogStore";

// 동적 라우트로 명시 (cookies 사용)
export const dynamic = 'force-dynamic';

/**
 * 라이프 로그 저장/조회 API
 * GET: 오늘의 라이프 로그 조회
 * POST: 라이프 로그 저장
 */

function getUserId(cookieStore: ReturnType<typeof cookies>): { userId: string | null; birthDate: string | null; birthTime: string | null } {
  const userSaju = cookieStore.get("user_saju");
  if (!userSaju) {
    return { userId: null, birthDate: null, birthTime: null };
  }
  try {
    const data = JSON.parse(userSaju.value);
    return {
      userId: data.userId || null, // UUID (있으면 사용)
      birthDate: data.birthDate || null,
      birthTime: data.birthTime || null,
    };
  } catch {
    return { userId: null, birthDate: null, birthTime: null };
  }
}

export async function GET() {
  const cookieStore = cookies();
  const { userId, birthDate } = getUserId(cookieStore);

  if (!birthDate) {
    return NextResponse.json({ error: "No user info" }, { status: 401 });
  }

  const todayStr = new Date().toISOString().split("T")[0];
  // userId가 있으면 사용, 없으면 birthDate 사용 (자동으로 UUID 조회/생성)
  const lookupId = userId || birthDate;
  const lifeLog = await lifelogStore.get(lookupId, todayStr);
  
  if (!lifeLog) {
    return NextResponse.json({ hasData: false });
  }

  return NextResponse.json({ hasData: true, data: lifeLog });
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const { userId, birthDate } = getUserId(cookieStore);

    if (!birthDate) {
      return NextResponse.json({ error: "No user info" }, { status: 401 });
    }

    const body = await request.json();
    const validated = LifeLogRequestSchema.parse(body);
    
    // userId가 있으면 사용, 없으면 birthDate 사용 (자동으로 UUID 조회/생성)
    const lookupId = userId || birthDate;
    const lifeLogResponse = await lifelogStore.set(lookupId, validated);
    
    return NextResponse.json({ success: true, data: lifeLogResponse });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
