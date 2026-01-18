/**
 * 1984년 11월 16일 1시 남자 사주 계산 검증
 */

const { getSajuProfile } = require("../lib/engine/sajuEngine");

console.log("=".repeat(60));
console.log("📊 1984년 11월 16일 1시 남자 사주 계산");
console.log("=".repeat(60));

const result = getSajuProfile("1984-11-16", "01:00");

console.log("\n📋 계산 결과:");
console.log(`   연주(年柱): ${result.pillars.year}`);
console.log(`   월주(月柱): ${result.pillars.month}`);
console.log(`   일주(日柱): ${result.pillars.day}`);
console.log(`   시주(時柱): ${result.pillars.hour}`);
console.log(`   일간(日干): ${result.dayMaster}`);

console.log("\n🔮 오행 분포:");
console.log(`   목(木): ${result.fiveElements.wood}%`);
console.log(`   화(火): ${result.fiveElements.fire}%`);
console.log(`   토(土): ${result.fiveElements.earth}%`);
console.log(`   금(金): ${result.fiveElements.metal}%`);
console.log(`   수(水): ${result.fiveElements.water}%`);

console.log("\n" + "=".repeat(60));
console.log("💡 참고:");
console.log("   - 1984년 11월 16일은 입동(11월 7일) 이후이므로 亥월이 맞습니다.");
console.log("   - 1시는 丑시(1-3시)입니다.");
console.log("=".repeat(60));
