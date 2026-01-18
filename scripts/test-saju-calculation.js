/**
 * 사주 계산 테스트 스크립트
 * 1984년 11월 16일 1시 남자 기준
 */

// 직접 계산하여 검증
function testSajuCalculation() {
  const birthYear = 1984;
  const birthMonth = 11;
  const birthDay = 16;
  const birthHour = 1; // 새벽 1시
  
  console.log("=".repeat(60));
  console.log("📊 사주 계산 테스트");
  console.log("=".repeat(60));
  console.log(`생년월일시: ${birthYear}년 ${birthMonth}월 ${birthDay}일 ${birthHour}시`);
  console.log("");

  // 천간(天干): 10개
  const TIANGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  
  // 지지(地支): 12개
  const DIZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

  // 1. 연주 계산
  // 1900년 = 경자년 (TIANGAN[6] = 庚, DIZHI[0] = 子)
  const baseYear = 1900;
  const yearDiff = birthYear - baseYear;
  const tianIndex = (6 + yearDiff) % 10;
  const diIndex = (0 + yearDiff) % 12;
  const yearPillar = TIANGAN[tianIndex] + DIZHI[diIndex];
  
  console.log("1️⃣ 연주(年柱) 계산:");
  console.log(`   기준년: ${baseYear}년 = ${TIANGAN[6]}${DIZHI[0]}년`);
  console.log(`   ${birthYear}년 - ${baseYear}년 = ${yearDiff}년 차이`);
  console.log(`   천간 인덱스: (6 + ${yearDiff}) % 10 = ${tianIndex} → ${TIANGAN[tianIndex]}`);
  console.log(`   지지 인덱스: (0 + ${yearDiff}) % 12 = ${diIndex} → ${DIZHI[diIndex]}`);
  console.log(`   ✅ 연주: ${yearPillar}`);
  console.log("");

  // 2. 일주 계산
  // 1900년 1월 1일 = 경자일 (TIANGAN[6] + DIZHI[0])
  function getDaysSince1900(year, month, day) {
    const baseDate = new Date(1900, 0, 1); // 1900년 1월 1일
    const targetDate = new Date(year, month - 1, day);
    const diffTime = targetDate.getTime() - baseDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  const days = getDaysSince1900(birthYear, birthMonth, birthDay);
  const dayTianIndex = (6 + days) % 10;
  const dayDiIndex = (0 + days) % 12;
  const dayPillar = TIANGAN[dayTianIndex] + DIZHI[dayDiIndex];
  const dayMaster = TIANGAN[dayTianIndex]; // 일간

  console.log("2️⃣ 일주(日柱) 계산:");
  console.log(`   1900년 1월 1일부터 ${days}일 경과`);
  console.log(`   천간 인덱스: (6 + ${days}) % 10 = ${dayTianIndex} → ${TIANGAN[dayTianIndex]}`);
  console.log(`   지지 인덱스: (0 + ${days}) % 12 = ${dayDiIndex} → ${DIZHI[dayDiIndex]}`);
  console.log(`   ✅ 일주: ${dayPillar}`);
  console.log(`   ✅ 일간(日干): ${dayMaster}`);
  console.log("");

  // 3. 월주 계산 (절기 기준)
  // 1984년 11월 16일은 입동(立冬) 이후
  // 입동: 11월 7일 또는 8일
  // 11월 16일이면 11월(亥月)이 맞음
  
  // 월의 지지 (절기 기준)
  // 1월(寅), 2월(卯), 3월(辰), 4월(巳), 5월(午), 6월(未),
  // 7월(申), 8월(酉), 9월(戌), 10월(亥), 11월(子), 12월(丑)
  const monthDizhiMap = {
    1: "寅", 2: "卯", 3: "辰", 4: "巳", 5: "午", 6: "未",
    7: "申", 8: "酉", 9: "戌", 10: "亥", 11: "子", 12: "丑"
  };

  // 절기 기준으로 월 확인 (간단화)
  // 11월 16일이면 입동 이후이므로 11월(子月)
  const monthDizhi = monthDizhiMap[birthMonth] || "未知";
  
  // 년간을 기준으로 월간 계산
  // 甲己년 → 丙寅월, 乙庚년 → 戊寅월, 丙辛년 → 庚寅월, 丁壬년 → 壬寅월, 戊癸년 → 甲寅월
  const yearTian = TIANGAN[tianIndex];
  let monthTianIndex;
  
  if (yearTian === "甲" || yearTian === "己") {
    monthTianIndex = 2; // 丙
  } else if (yearTian === "乙" || yearTian === "庚") {
    monthTianIndex = 4; // 戊
  } else if (yearTian === "丙" || yearTian === "辛") {
    monthTianIndex = 6; // 庚
  } else if (yearTian === "丁" || yearTian === "壬") {
    monthTianIndex = 8; // 壬
  } else { // 戊, 癸
    monthTianIndex = 0; // 甲
  }
  
  // 월의 지지에 따라 월간 조정
  const monthDizhiIndex = DIZHI.indexOf(monthDizhi);
  const monthTian = TIANGAN[(monthTianIndex + monthDizhiIndex - 2 + 10) % 10];
  const monthPillar = monthTian + monthDizhi;

  console.log("3️⃣ 월주(月柱) 계산:");
  console.log(`   년간: ${yearTian}`);
  console.log(`   월 지지: ${monthDizhi} (${birthMonth}월)`);
  console.log(`   월간 계산: ${monthTian}`);
  console.log(`   ✅ 월주: ${monthPillar}`);
  console.log("");

  // 4. 시주 계산
  // 일간을 기준으로 시주 계산
  // 甲己일 → 甲子시, 乙庚일 → 丙子시, 丙辛일 → 戊子시, 丁壬일 → 庚子시, 戊癸일 → 壬子시
  let hourTianIndex;
  if (dayMaster === "甲" || dayMaster === "己") {
    hourTianIndex = 0; // 甲
  } else if (dayMaster === "乙" || dayMaster === "庚") {
    hourTianIndex = 2; // 丙
  } else if (dayMaster === "丙" || dayMaster === "辛") {
    hourTianIndex = 4; // 戊
  } else if (dayMaster === "丁" || dayMaster === "壬") {
    hourTianIndex = 6; // 庚
  } else { // 戊, 癸
    hourTianIndex = 8; // 壬
  }

  // 시간에 따른 지지
  // 23-1시: 子, 1-3시: 丑, 3-5시: 寅, 5-7시: 卯, 7-9시: 辰, 9-11시: 巳,
  // 11-13시: 午, 13-15시: 未, 15-17시: 申, 17-19시: 酉, 19-21시: 戌, 21-23시: 亥
  const hourDizhiMap = {
    23: 0, 0: 0, 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3,
    7: 4, 8: 4, 9: 5, 10: 5, 11: 6, 12: 6, 13: 7, 14: 7,
    15: 8, 16: 8, 17: 9, 18: 9, 19: 10, 20: 10, 21: 11, 22: 11
  };

  const hourDizhiIndex = hourDizhiMap[birthHour] !== undefined ? hourDizhiMap[birthHour] : 0;
  const hourDizhi = DIZHI[hourDizhiIndex];
  const hourTian = TIANGAN[(hourTianIndex + hourDizhiIndex) % 10];
  const hourPillar = hourTian + hourDizhi;

  console.log("4️⃣ 시주(時柱) 계산:");
  console.log(`   일간: ${dayMaster}`);
  console.log(`   시간: ${birthHour}시 → ${hourDizhi}`);
  console.log(`   시간 계산: ${hourTian}`);
  console.log(`   ✅ 시주: ${hourPillar}`);
  console.log("");

  console.log("=".repeat(60));
  console.log("📋 최종 사주:");
  console.log(`   연주(年柱): ${yearPillar}`);
  console.log(`   월주(月柱): ${monthPillar}`);
  console.log(`   일주(日柱): ${dayPillar}`);
  console.log(`   시주(時柱): ${hourPillar}`);
  console.log("=".repeat(60));

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    dayMaster: dayMaster
  };
}

// 실행
testSajuCalculation();
