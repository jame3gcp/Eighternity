/**
 * 대운(大運) 및 세운(歲運) 계산
 * 명리학에서 운세의 흐름을 계산합니다.
 */

import { getYearPillar, getMonthPillar, getDayPillar } from "./sajuEngine";

/**
 * 대운 계산
 * 월주를 기준으로 역행 또는 순행하여 계산
 * @param birthYear 출생년도
 * @param birthMonth 출생월
 * @param birthDay 출생일
 * @param gender 성별 (M: 남성, F: 여성, O: 기타)
 * @returns 대운 배열 (10년 단위)
 */
export function calculateDaeun(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  gender: "M" | "F" | "O"
): Array<{ age: string; pillar: string; startYear: number }> {
  const monthPillar = getMonthPillar(birthYear, birthMonth, birthDay);
  const [monthTian, monthZhi] = monthPillar.split("");
  
  // 남성: 양년(甲, 丙, 戊, 庚, 壬)이면 순행, 음년이면 역행
  // 여성: 양년이면 역행, 음년이면 순행
  const isYangYear = ["甲", "丙", "戊", "庚", "壬"].includes(
    getYearPillar(birthYear)[0]
  );
  
  const isForward = 
    gender === "M" ? isYangYear : !isYangYear;
  
  const daeun: Array<{ age: string; pillar: string; startYear: number }> = [];
  
  // 대운은 10년 단위
  for (let i = 0; i < 8; i++) {
    const ageStart = i * 10 + 1;
    const ageEnd = (i + 1) * 10;
    const startYear = birthYear + Math.floor(ageStart / 10) * 10;
    
    // 간단한 구현: 월주 기준으로 순행/역행
    // 실제로는 더 복잡한 계산이 필요
    const pillar = monthPillar; // 임시로 월주 사용
    
    daeun.push({
      age: `${ageStart}-${ageEnd}세`,
      pillar,
      startYear,
    });
  }
  
  return daeun;
}

/**
 * 세운 계산 (최근 10년)
 * @param currentYear 현재 연도
 * @returns 세운 배열
 */
export function calculateSeun(currentYear: number = new Date().getFullYear()): Array<{
  year: number;
  pillar: string;
}> {
  const seun: Array<{ year: number; pillar: string }> = [];
  
  for (let i = 0; i < 10; i++) {
    const year = currentYear - 5 + i; // 현재 기준 전후 5년
    const pillar = getYearPillar(year);
    seun.push({ year, pillar });
  }
  
  return seun;
}

/**
 * 형충회합 관계 계산
 * 사주의 각 주 간의 관계를 분석
 */
export function calculateRelationships(pillars: {
  year: string;
  month: string;
  day: string;
  hour: string;
}): {
  conflicts: Array<{ pillar: string; type: string }>;
  combinations: Array<{ pillars: string[]; type: string }>;
  punishments: Array<{ pillars: string[]; type: string }>;
  harms: Array<{ pillars: string[]; type: string }>;
} {
  // 간단한 구현 예시
  // 실제로는 더 복잡한 명리학 규칙 적용 필요
  
  const conflicts: Array<{ pillar: string; type: string }> = [];
  const combinations: Array<{ pillars: string[]; type: string }> = [];
  const punishments: Array<{ pillars: string[]; type: string }> = [];
  const harms: Array<{ pillars: string[]; type: string }> = [];
  
  // 충(沖) 관계: 6충 (子午, 丑未, 寅申, 卯酉, 辰戌, 巳亥)
  const chongPairs: Record<string, string> = {
    "子": "午", "午": "子",
    "丑": "未", "未": "丑",
    "寅": "申", "申": "寅",
    "卯": "酉", "酉": "卯",
    "辰": "戌", "戌": "辰",
    "巳": "亥", "亥": "巳",
  };
  
  const allPillars = Object.values(pillars).filter(p => p !== "未知");
  
  // 충 관계 찾기
  allPillars.forEach((pillar, i) => {
    const zhi = pillar[1];
    const chongZhi = chongPairs[zhi];
    
    if (chongZhi) {
      const conflictPillar = allPillars.find(p => p[1] === chongZhi);
      if (conflictPillar && conflictPillar !== pillar) {
        conflicts.push({
          pillar: `${pillar} ↔ ${conflictPillar}`,
          type: "충(沖)",
        });
      }
    }
  });
  
  // 합(合) 관계: 6합 (子丑, 寅亥, 卯戌, 辰酉, 巳申, 午未)
  const hapPairs: Record<string, string> = {
    "子": "丑", "丑": "子",
    "寅": "亥", "亥": "寅",
    "卯": "戌", "戌": "卯",
    "辰": "酉", "酉": "辰",
    "巳": "申", "申": "巳",
    "午": "未", "未": "午",
  };
  
  allPillars.forEach((pillar) => {
    const zhi = pillar[1];
    const hapZhi = hapPairs[zhi];
    
    if (hapZhi) {
      const hapPillar = allPillars.find(p => p[1] === hapZhi);
      if (hapPillar && hapPillar !== pillar) {
        combinations.push({
          pillars: [pillar, hapPillar],
          type: "합(合)",
        });
      }
    }
  });
  
  return { conflicts, combinations, punishments, harms };
}
