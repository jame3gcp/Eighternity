import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ruleEngine } from "../../../../lib/engine/ruleEngine";
import { QuestionCategorySchema } from "../../../../lib/contracts/fortune";

export async function POST(request: Request) {
  try {
    const { category } = await request.json();
    const validatedCategory = QuestionCategorySchema.parse(category);
    
    const cookieStore = cookies();
    const userSaju = cookieStore.get("user_saju");
    const fiveElements = userSaju ? JSON.parse(userSaju.value).fiveElements : null;

    const answer = ruleEngine.ask(validatedCategory, fiveElements);
    return NextResponse.json({ answer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
