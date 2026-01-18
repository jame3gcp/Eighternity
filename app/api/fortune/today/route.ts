import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ruleEngine } from "../../../../lib/engine/ruleEngine";

export async function GET() {
  try {
    const cookieStore = cookies();
    const userSaju = cookieStore.get("user_saju");

    if (!userSaju) {
      return NextResponse.json({ error: "No user info" }, { status: 401 });
    }

    const userData = JSON.parse(userSaju.value);
    const { fiveElements } = userData;
    
    if (!fiveElements) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }

    const fortune = ruleEngine.today(fiveElements);
    return NextResponse.json(fortune);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
