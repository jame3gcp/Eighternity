/**
 * 실제 사주 계산 엔진
 * 생년월일시를 기준으로 간지(干支)와 오행(五行)을 계산합니다.
 */

// 천간(天干): 10개
const TIANGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

// 지지(地支): 12개
const DIZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

// 오행 매핑: 천간 -> 오행
const TIANGAN_ELEMENT: Record<string, "wood" | "fire" | "earth" | "metal" | "water"> = {
  "甲": "wood", "乙": "wood",
  "丙": "fire", "丁": "fire",
  "戊": "earth", "己": "earth",
  "庚": "metal", "辛": "metal",
  "壬": "water", "癸": "water",
};

// 오행 매핑: 지지 -> 오행
const DIZHI_ELEMENT: Record<string, "wood" | "fire" | "earth" | "metal" | "water"> = {
  "寅": "wood", "卯": "wood",
  "巳": "fire", "午": "fire",
  "辰": "earth", "戌": "earth", "丑": "earth", "未": "earth",
  "申": "metal", "酉": "metal",
  "亥": "water", "子": "water",
};

export interface SajuPillars {
  year: string;
  month: string;
  day: string;
  hour: string;
}

export interface SajuProfile {
  fiveElements: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  pillars: SajuPillars;
  dayMaster: string; // 일간(日干)
}

/**
 * 기준일(1900년 1월 1일 = 경자일)로부터 경과 일수 계산
 */
function getDaysSince1900(year: number, month: number, day: number): number {
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const diffTime = targetDate.getTime() - baseDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 년주 계산 (1900년 = 경자년 기준)
 */
function getYearPillar(year: number): string {
  // 1900년 = 경자년 (TIANGAN[6] + DIZHI[0])
  const baseYear = 1900;
  const yearDiff = year - baseYear;
  const tianIndex = (6 + yearDiff) % 10;
  const diIndex = (0 + yearDiff) % 12;
  return TIANGAN[tianIndex] + DIZHI[diIndex];
}

/**
 * 월주 계산 (절기 기준)
 * 실제 사주는 절기 기준으로 월을 계산합니다.
 */
function getMonthPillar(year: number, month: number, day: number): string {
  // 절기 기준으로 월의 지지 계산
  const monthDizhi = getMonthDizhiBySolarTerm(year, month, day);
  
  // 년간 계산
  const yearTianIndex = (6 + (year - 1900)) % 10;
  const yearTian = TIANGAN[yearTianIndex];
  
  // 년간 기준으로 월간 계산
  const monthTian = getMonthTianByYearTian(yearTian, monthDizhi);
  
  return monthTian + monthDizhi;
}

/**
 * 절기 기준 월 지지 계산
 */
function getMonthDizhiBySolarTerm(year: number, month: number, day: number): string {
  // 절기 기준 월 매핑
  const termMap: Array<{ month: number; termDay: number; dizhi: string }> = [
    { month: 2, termDay: 4, dizhi: "寅" },   // 입춘
    { month: 3, termDay: 6, dizhi: "卯" },   // 경칩
    { month: 4, termDay: 5, dizhi: "辰" },   // 청명
    { month: 5, termDay: 6, dizhi: "巳" },   // 입하
    { month: 6, termDay: 6, dizhi: "午" },   // 망종
    { month: 7, termDay: 7, dizhi: "未" },   // 소서
    { month: 8, termDay: 8, dizhi: "申" },   // 입추
    { month: 9, termDay: 8, dizhi: "酉" },   // 백로
    { month: 10, termDay: 8, dizhi: "戌" },  // 한로
    { month: 11, termDay: 7, dizhi: "亥" },  // 입동
    { month: 12, termDay: 7, dizhi: "子" },  // 대설
    { month: 1, termDay: 6, dizhi: "丑" },   // 소한
  ];
  
  for (let i = 0; i < termMap.length; i++) {
    const current = termMap[i];
    const next = termMap[(i + 1) % termMap.length];
    
    if (month === current.month) {
      if (day < current.termDay) {
        const prev = termMap[(i - 1 + termMap.length) % termMap.length];
        return prev.dizhi;
      } else {
        return current.dizhi;
      }
    }
    
    if (month === next.month && day < next.termDay) {
      return current.dizhi;
    }
  }
  
  return "寅";
}

/**
 * 년간 기준 월간 계산
 */
function getMonthTianByYearTian(yearTian: string, monthDizhi: string): string {
  const yearTianIndex = TIANGAN.indexOf(yearTian);
  const monthDiIndex = DIZHI.indexOf(monthDizhi);
  const monthOffset = [2, 4, 0, 2, 4, 0, 2, 4, 0, 2, 4, 0];
  const tianIndex = (yearTianIndex + monthOffset[monthDiIndex]) % 10;
  return TIANGAN[tianIndex];
}

/**
 * 일주 계산 (1900년 1월 1일 = 경자일 기준)
 */
function getDayPillar(year: number, month: number, day: number): string {
  const days = getDaysSince1900(year, month, day);
  // 1900년 1월 1일 = 경자일 (TIANGAN[6] + DIZHI[0])
  const tianIndex = (6 + days) % 10;
  const diIndex = (0 + days) % 12;
  return TIANGAN[tianIndex] + DIZHI[diIndex];
}

/**
 * 시주 계산 (시간대 기준)
 */
function getHourPillar(dayTian: string, hour: number): string {
  // 시간대별 지지: 23-1시=子, 1-3시=丑, ..., 21-23시=亥
  const hourDizhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const hourIndex = Math.floor((hour + 1) / 2) % 12;
  
  // 일간 기준으로 시간 천간 계산
  const dayTianIndex = TIANGAN.indexOf(dayTian);
  // 시간 계산 공식: 일간 + 시간 오프셋
  const hourOffset = [0, 2, 4, 0, 2, 4, 0, 2, 4, 0, 2, 4];
  const tianIndex = (dayTianIndex + hourOffset[hourIndex]) % 10;
  
  return TIANGAN[tianIndex] + hourDizhi[hourIndex];
}

/**
 * 간지에서 천간 추출
 */
function getTianFromPillar(pillar: string): string {
  return pillar[0];
}

/**
 * 간지에서 지지 추출
 */
function getDiFromPillar(pillar: string): string {
  return pillar[1];
}

/**
 * 오행 계산 (간지 4개 주에서 추출)
 */
function calculateFiveElements(pillars: SajuPillars): {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
} {
  const elements: Record<string, number> = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };

  // 각 주(柱)의 천간과 지지에서 오행 추출
  const allPillars = [pillars.year, pillars.month, pillars.day, pillars.hour];
  
  allPillars.forEach((pillar) => {
    if (pillar === "未知") return; // 시주가 없는 경우
    
    const tian = getTianFromPillar(pillar);
    const di = getDiFromPillar(pillar);
    
    // 천간 오행
    const tianElement = TIANGAN_ELEMENT[tian];
    if (tianElement) elements[tianElement] += 1;
    
    // 지지 오행
    const diElement = DIZHI_ELEMENT[di];
    if (diElement) elements[diElement] += 1;
  });

  // 총 8개(4주 × 2) 기준으로 비율 계산
  const total = Object.values(elements).reduce((sum, val) => sum + val, 0);
  
  if (total === 0) {
    // 기본값 (균등 분배)
    return { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 };
  }

  // 비율을 0-100 범위로 정규화
  const normalized: Record<string, number> = {};
  Object.keys(elements).forEach((key) => {
    normalized[key] = Math.round((elements[key] / total) * 100);
  });

  // 합이 100이 되도록 조정
  const currentSum = Object.values(normalized).reduce((sum, val) => sum + val, 0);
  const diff = 100 - currentSum;
  if (diff !== 0) {
    // 가장 큰 값에 차이를 더함
    const maxKey = Object.keys(normalized).reduce((a, b) =>
      normalized[a] > normalized[b] ? a : b
    );
    normalized[maxKey] += diff;
  }

  return normalized as {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
}

/**
 * 생년월일시를 기준으로 사주 프로필 계산
 * @param birthDate YYYY-MM-DD 형식
 * @param birthTime HH:mm 형식 (선택)
 */
export const getSajuProfile = (
  birthDate: string,
  birthTime: string | null
): { fiveElements: SajuProfile["fiveElements"]; pillars: SajuPillars; dayMaster: string } => {
  const [year, month, day] = birthDate.split("-").map(Number);
  
  // 년주 계산
  const yearPillar = getYearPillar(year);
  
  // 월주 계산 (절기 기준)
  const monthPillar = getMonthPillar(year, month, day);
  
  // 일주 계산
  const dayPillar = getDayPillar(year, month, day);
  const dayMaster = getTianFromPillar(dayPillar); // 일간(日干)
  
  // 시주 계산
  let hourPillar = "未知";
  if (birthTime) {
    const [hour] = birthTime.split(":").map(Number);
    hourPillar = getHourPillar(dayMaster, hour);
  }

  const pillars: SajuPillars = {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
  };

  // 오행 계산
  const fiveElements = calculateFiveElements(pillars);

  return {
    fiveElements,
    pillars,
    dayMaster,
  };
};
