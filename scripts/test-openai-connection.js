/**
 * OpenAI 연결 테스트 스크립트
 */

async function testOpenAIConnection() {
  console.log("🔍 OpenAI 연결 테스트 시작...\n");

  try {
    // 환경 변수 확인
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.log("❌ OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.");
      console.log("💡 .env.local 파일에 OPENAI_API_KEY를 추가하세요.\n");
      return;
    }

    console.log("✅ OPENAI_API_KEY 발견 (길이:", apiKey.length, "자)");

    // OpenAI 모듈 로드 테스트
    let OpenAI;
    try {
      const openaiModule = await import("openai");
      OpenAI = openaiModule.OpenAI;
      console.log("✅ openai 모듈 로드 성공");
    } catch (error) {
      console.log("❌ openai 모듈 로드 실패");
      console.log("💡 다음 명령어로 설치하세요: npm install openai\n");
      return;
    }

    // 클라이언트 생성
    const client = new OpenAI({
      apiKey: apiKey,
    });

    console.log("✅ OpenAI 클라이언트 생성 성공\n");

    // 간단한 테스트 요청
    console.log("🧪 간단한 API 호출 테스트...");
    
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: "안녕하세요. 간단히 '테스트 성공'이라고만 답해주세요." }
      ],
      max_tokens: 10,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (response) {
      console.log("✅ API 호출 성공!");
      console.log("📝 응답:", response);
      console.log("\n🎉 OpenAI 연결이 정상적으로 작동합니다!\n");
    } else {
      console.log("⚠️ 응답이 비어있습니다.");
    }

  } catch (error) {
    console.error("❌ 오류 발생:", error.message);
    
    if (error.message.includes("401") || error.message.includes("Unauthorized")) {
      console.log("\n💡 API 키가 유효하지 않습니다. OpenAI 대시보드에서 키를 확인하세요.");
    } else if (error.message.includes("429")) {
      console.log("\n💡 Rate limit에 도달했습니다. 잠시 후 다시 시도하세요.");
    } else {
      console.log("\n💡 오류 상세:", error);
    }
  }
}

// 실행
testOpenAIConnection();
