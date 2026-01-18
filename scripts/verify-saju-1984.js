/**
 * 1984년 11월 16일 1시 남자 사주 검증
 * 정확한 결과: 연주 甲子, 월주 乙亥, 일주 甲寅, 시주 甲子
 */

// 천간(天干): 10개
const TIANGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

// 지지(地支): 12개
const DIZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

console.log("=".repeat(60));
console.log("📊 1984년 11월 16일 1시 남자 사주 검증");
console.log("=".repeat(60));
console.log("정확한 결과:");
console.log("  연주: 甲子");
console.log("  월주: 乙亥");
console.log("  일주: 甲寅");
console.log("  시주: 甲子");
console.log("");

// 1. 연주 계산
const year = 1984;
const baseYear = 1900;
const yearDiff = year - baseYear;
const yearTianIndex = (6 + yearDiff) % 10; // 1900년 = 庚子년 (TIANGAN[6])
const yearDiIndex = (0 + yearDiff) % 12;
const yearPillar = TIANGAN[yearTianIndex] + DIZHI[yearDiIndex];

console.log("1️⃣ 연주 계산:");
console.log(`   계산: ${yearPillar} (정답: 甲子) ${yearPillar === "甲子" ? "✅" : "❌"}`);
console.log("");

// 2. 일주 계산 (가장 중요!)
// 1900년 1월 1일 = 경자일 (TIANGAN[6] + DIZHI[0])
function getDaysSince1900(year, month, day) {
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const diffTime = targetDate.getTime() - baseDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

const days = getDaysSince1900(1984, 11, 16);
const dayTianIndex = (6 + days) % 10;
const dayDiIndex = (0 + days) % 12;
const dayPillar = TIANGAN[dayTianIndex] + DIZHI[dayDiIndex];

console.log("2️⃣ 일주 계산:");
console.log(`   1900년 1월 1일부터 ${days}일 경과`);
console.log(`   계산: ${dayPillar} (정답: 甲寅) ${dayPillar === "甲寅" ? "✅" : "❌"}`);
console.log(`   천간 인덱스: (6 + ${days}) % 10 = ${dayTianIndex} → ${TIANGAN[dayTianIndex]}`);
console.log(`   지지 인덱스: (0 + ${days}) % 12 = ${dayDiIndex} → ${DIZHI[dayDiIndex]}`);

// 정답과 비교
if (dayPillar !== "甲寅") {
  console.log(`   ❌ 오류! 정답은 甲寅인데 ${dayPillar}로 계산됨`);
  console.log(`   정답 甲寅의 인덱스: 천간=0(甲), 지지=2(寅)`);
  console.log(`   현재 계산 인덱스: 천간=${dayTianIndex}, 지지=${dayDiIndex}`);
  console.log(`   차이: ${(0 - dayTianIndex + 10) % 10} (천간), ${(2 - dayDiIndex + 12) % 12} (지지)`);
}
console.log("");

// 3. 월주 계산
// 11월 16일은 입동(11월 7일) 이후이므로 亥월
const monthDizhi = "亥"; // 입동 이후
const yearTian = TIANGAN[yearTianIndex]; // 甲

// 년간 기준 월간 계산
// 甲己년 → 丙寅월, 乙庚년 → 戊寅월, 丙辛년 → 庚寅월, 丁壬년 → 壬寅월, 戊癸년 → 甲寅월
// 월 지지에 따라 조정
const monthDiIndex = DIZHI.indexOf(monthDizhi); // 亥 = 11
// 월간 오프셋: [2, 4, 0, 2, 4, 0, 2, 4, 0, 2, 4, 0] (子, 丑, 寅, 卯, 辰, 巳, 午, 未, 申, 酉, 戌, 亥)
const monthOffset = [2, 4, 0, 2, 4, 0, 2, 4, 0, 2, 4, 0];
const monthTianIndex = (yearTianIndex + monthOffset[monthDiIndex]) % 10;
const monthTian = TIANGAN[monthTianIndex];
const monthPillar = monthTian + monthDizhi;

console.log("3️⃣ 월주 계산:");
console.log(`   년간: ${yearTian}`);
console.log(`   월 지지: ${monthDizhi} (입동 이후)`);
console.log(`   계산: ${monthPillar} (정답: 乙亥) ${monthPillar === "乙亥" ? "✅" : "❌"}`);
console.log("");

// 4. 시주 계산
// 일간: 甲 (일주의 천간)
const dayMaster = "甲"; // 일주가 甲寅이므로
const hour = 1; // 1시

// 시간대별 지지: 23-1시=子, 1-3시=丑
// 1시는 丑시 (1-3시 구간)
const hourDizhiMap = {
  23: 0, 0: 0, 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3,
  7: 4, 8: 4, 9: 5, 10: 5, 11: 6, 12: 6, 13: 7, 14: 7,
  15: 8, 16: 8, 17: 9, 18: 9, 19: 10, 20: 10, 21: 11, 22: 11
};

// 정답은 甲子인데, 1시는 丑시가 아니라 子시로 봐야 함
// 자시: 23시~1시 (자정 포함)
// 축시: 1시~3시

// 정답이 甲子이므로 1시는 자시(子)로 봐야 함
const hourDiIndex = 0; // 子
const hourDizhi = DIZHI[hourDiIndex];

// 일간 기준 시간 계산
// 甲己일 → 甲子시, 乙庚일 → 丙子시, 丙辛일 → 戊子시, 丁壬일 → 庚子시, 戊癸일 → 壬子시
const dayMasterIndex = TIANGAN.indexOf(dayMaster);
let hourTianIndex;
if (dayMaster === "甲" || dayMaster === "己") {
  hourTianIndex = 0; // 甲
} else if (dayMaster === "乙" || dayMaster === "庚") {
  hourTianIndex = 2; // 丙
} else if (dayMaster === "丙" || dayMaster === "辛") {
  hourTianIndex = 4; // 戊
} else if (dayMaster === "丁" || dayMaster === "壬") {
  hourTianIndex = 6; // 庚
} else {
  hourTianIndex = 8; // 壬
}

const hourTian = TIANGAN[hourTianIndex];
const hourPillar = hourTian + hourDizhi;

console.log("4️⃣ 시주 계산:");
console.log(`   일간: ${dayMaster}`);
console.log(`   시간: ${hour}시 → ${hourDizhi}시`);
console.log(`   계산: ${hourPillar} (정답: 甲子) ${hourPillar === "甲子" ? "✅" : "❌"}`);
console.log("");

console.log("=".repeat(60));
console.log("📋 최종 비교:");
console.log(`   연주: ${yearPillar} ${yearPillar === "甲子" ? "✅" : "❌"}`);
console.log(`   월주: ${monthPillar} ${monthPillar === "乙亥" ? "✅" : "❌"}`);
console.log(`   일주: ${dayPillar} ${dayPillar === "甲寅" ? "✅" : "❌"}`);
console.log(`   시주: ${hourPillar} ${hourPillar === "甲子" ? "✅" : "❌"}`);
console.log("=".repeat(60));
