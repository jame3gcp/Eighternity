/**
 * 월간 계산 테스트
 * 甲년의 각 월간 확인
 */

const TIANGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const DIZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

// 甲년의 각 월간 (정답)
// 甲년: 丙寅, 丁卯, 戊辰, 己巳, 庚午, 辛未, 壬申, 癸酉, 甲戌, 乙亥, 丙子, 丁丑
const correct = {
  "寅": "丙", "卯": "丁", "辰": "戊", "巳": "己", "午": "庚", "未": "辛",
  "申": "壬", "酉": "癸", "戌": "甲", "亥": "乙", "子": "丙", "丑": "丁"
};

console.log("甲년의 각 월간 (정답):");
Object.entries(correct).forEach(([dizhi, tian]) => {
  console.log(`  ${dizhi}월: ${tian}${dizhi}`);
});

console.log("\n계산 공식 테스트:");
const yearTian = "甲";
const yearTianIndex = TIANGAN.indexOf(yearTian);

// 인월(寅)의 천간: 甲년 → 丙(2)
const yinMonthTianIndex = 2;

DIZHI.forEach((dizhi, index) => {
  // 각 월 지지마다 +1씩 증가 (인월부터)
  // 寅(0), 卯(1), 辰(2), ..., 亥(9), 子(10), 丑(11)
  const monthOffset = index >= 2 ? index - 2 : index + 10;
  const tianIndex = (yinMonthTianIndex + monthOffset) % 10;
  const calculated = TIANGAN[tianIndex];
  const expected = correct[dizhi];
  const match = calculated === expected ? "✅" : "❌";
  console.log(`  ${dizhi}월: ${calculated}${dizhi} (정답: ${expected}${dizhi}) ${match}`);
});
