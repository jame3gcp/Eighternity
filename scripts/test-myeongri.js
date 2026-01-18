/**
 * 명리학 분석 API 테스트 스크립트
 */

const testMyeongriAnalysis = async () => {
  // 테스트용 쿠키 데이터 (실제로는 온보딩 후 생성됨)
  const testCookie = {
    birthDate: "1990-01-15",
    birthTime: "12:00",
    gender: "M",
    fiveElements: {
      wood: 30,
      fire: 25,
      earth: 20,
      metal: 15,
      water: 10
    },
    userId: "test-user-id"
  };

  const cookieString = `user_saju=${encodeURIComponent(JSON.stringify(testCookie))}`;

  try {
    console.log("🧪 명리학 분석 API 테스트 시작...\n");
    
    const response = await fetch("http://localhost:3000/api/myeongri/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookieString,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ API 오류:", error);
      return;
    }

    const data = await response.json();
    
    console.log("✅ 분석 성공!\n");
    console.log("📊 분석 결과:");
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error("❌ 테스트 실패:", error.message);
    console.log("\n💡 개발 서버가 실행 중인지 확인하세요: npm run dev");
  }
};

// Node.js 환경에서 실행
if (typeof window === "undefined") {
  testMyeongriAnalysis();
}
