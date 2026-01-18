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
export function getYearPillar(year: number): string {
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
export function getMonthPillar(year: number, month: number, day: number): string {
  // 절기 기준으로 월의 지지 계산
  // solarTerms.ts의 함수를 사용하거나, 여기서 직접 계산
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
 * 절기 기준: 입춘(2/4)~경칩 전=寅, 경칩(3/6)~청명 전=卯, ..., 입동(11/7)~대설 전=亥, 대설(12/7)~소한 전=子
 */
function getMonthDizhiBySolarTerm(year: number, month: number, day: number): string {
  // 절기 기준 월 매핑 (절기 시작일 기준)
  // 각 절기는 해당 월의 특정 일에 시작하며, 그 전까지는 이전 월의 지지를 사용
  const termMap: Array<{ month: number; termDay: number; dizhi: string }> = [
    { month: 2, termDay: 4, dizhi: "寅" },   // 입춘 - 2월 4일부터 寅월
    { month: 3, termDay: 6, dizhi: "卯" },   // 경칩 - 3월 6일부터 卯월
    { month: 4, termDay: 5, dizhi: "辰" },   // 청명 - 4월 5일부터 辰월
    { month: 5, termDay: 6, dizhi: "巳" },   // 입하 - 5월 6일부터 巳월
    { month: 6, termDay: 6, dizhi: "午" },   // 망종 - 6월 6일부터 午월
    { month: 7, termDay: 7, dizhi: "未" },   // 소서 - 7월 7일부터 未월
    { month: 8, termDay: 8, dizhi: "申" },   // 입추 - 8월 8일부터 申월
    { month: 9, termDay: 8, dizhi: "酉" },   // 백로 - 9월 8일부터 酉월
    { month: 10, termDay: 8, dizhi: "戌" },  // 한로 - 10월 8일부터 戌월
    { month: 11, termDay: 7, dizhi: "亥" },  // 입동 - 11월 7일부터 亥월
    { month: 12, termDay: 7, dizhi: "子" },  // 대설 - 12월 7일부터 子월
    { month: 1, termDay: 6, dizhi: "丑" },   // 소한 - 1월 6일부터 丑월
  ];
  
  // 현재 날짜가 어느 절기 구간에 속하는지 확인
  // 절기 순서: 입춘(2/4) -> 경칩(3/6) -> ... -> 입동(11/7) -> 대설(12/7) -> 소한(1/6) -> 입춘(2/4)
  
  for (let i = 0; i < termMap.length; i++) {
    const current = termMap[i];
    const next = termMap[(i + 1) % termMap.length];
    
    // 같은 월인 경우
    if (month === current.month) {
      if (day >= current.termDay) {
        // 절기 시작일 이후면 현재 절기의 지지
        // 예: 11월 16일 >= 11월 7일(입동) -> 亥월
        return current.dizhi;
      } else {
        // 절기 시작일 이전이면 이전 절기의 지지
        // 예: 11월 5일 < 11월 7일(입동) -> 戌월(한로)
        const prev = termMap[(i - 1 + termMap.length) % termMap.length];
        return prev.dizhi;
      }
    }
    
    // 다음 절기 월인 경우
    // 예: 12월이지만 대설(12/7) 이전이면 입동의 지지(亥월) 사용
    if (month === next.month && day < next.termDay) {
      return current.dizhi;
    }
  }
  
  // 기본값 (입춘 이전 = 丑월)
  return "丑";
}

/**
 * 년간 기준 월간 계산
 * 월간 계산 공식: 년간 + 월 지지 오프셋
 * 오프셋: [子, 丑, 寅, 卯, 辰, 巳, 午, 未, 申, 酉, 戌, 亥]
 *        [2,  4,  0,  2,  4,  0,  2,  4,  0,  2,  4,  0]
 * 
 * 하지만 실제로는:
 * 甲己년 → 丙寅월, 乙庚년 → 戊寅월, 丙辛년 → 庚寅월, 丁壬년 → 壬寅월, 戊癸년 → 甲寅월
 * 각 월 지지에 따라 순차적으로 증가
 */
function getMonthTianByYearTian(yearTian: string, monthDizhi: string): string {
  const yearTianIndex = TIANGAN.indexOf(yearTian);
  const monthDiIndex = DIZHI.indexOf(monthDizhi);
  
  // 월간 계산 공식
  // 인월(寅)의 천간: 甲己년→丙(2), 乙庚년→戊(4), 丙辛년→庚(6), 丁壬년→壬(8), 戊癸년→甲(0)
  // 각 월 지지마다 +1씩 증가 (인월부터): 寅(0), 卯(1), 辰(2), ..., 亥(9), 子(10), 丑(11)
  
  // 년간별 인월(寅)의 천간 인덱스
  const yinMonthTianIndex = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0][yearTianIndex];
  
  // 월 지지별 오프셋 (인월부터 시작, 각 월마다 +1)
  // [子, 丑, 寅, 卯, 辰, 巳, 午, 未, 申, 酉, 戌, 亥]
  // [10, 11, 0,  1,  2,  3,  4,  5,  6,  7,  8,  9]
  const monthOffset = monthDiIndex >= 2 
    ? monthDiIndex - 2  // 寅(2)부터는 직접 계산
    : monthDiIndex + 10; // 子(0), 丑(1)은 +10
  
  // 최종 월간 인덱스
  const tianIndex = (yinMonthTianIndex + monthOffset) % 10;
  
  return TIANGAN[tianIndex];
}

/**
 * 일주 계산
 * 기준일: 1924년 2월 5일 = 甲子일 (일반적인 만세력 기준)
 * 
 * 참고: 1900년 1월 1일 기준으로는 정확도가 떨어질 수 있음
 * 1984년 11월 16일 검증 결과: 1924년 2월 5일 기준이 더 정확함
 */
export function getDayPillar(year: number, month: number, day: number): string {
  // 1924년 2월 5일 = 甲子일 기준
  const baseDate = new Date(1924, 1, 5); // 1924년 2월 5일
  const targetDate = new Date(year, month - 1, day);
  const diffTime = targetDate.getTime() - baseDate.getTime();
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // 1924년 2월 5일 = 甲子일 (TIANGAN[0] + DIZHI[0])
  const tianIndex = (0 + days) % 10;
  const diIndex = (0 + days) % 12;
  return TIANGAN[tianIndex] + DIZHI[diIndex];
}

/**
 * 시주 계산 (시간대 기준)
 * 시간대: 자시(子時) = 23시~1시 (자정 포함), 축시(丑時) = 1시~3시, ...
 * 
 * 주의: 1시는 자시(子時)에 포함됨 (23시~1시 구간)
 */
function getHourPillar(dayTian: string, hour: number): string {
  const hourDizhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  
  // 시간에 따른 지지 인덱스 계산
  // 자시(子): 23시, 0시, 1시
  // 축시(丑): 2시, 3시
  // ...
  let hourIndex: number;
  if (hour === 23 || hour === 0 || hour === 1) {
    hourIndex = 0; // 子시
  } else {
    hourIndex = Math.floor((hour + 1) / 2) % 12;
  }
  
  const hourDizhiChar = hourDizhi[hourIndex];
  
  // 일간 기준으로 시간 천간 계산
  // 甲己일 → 甲子시, 乙庚일 → 丙子시, 丙辛일 → 戊子시, 丁壬일 → 庚子시, 戊癸일 → 壬子시
  const dayTianIndex = TIANGAN.indexOf(dayTian);
  let hourTianIndex: number;
  
  if (dayTian === "甲" || dayTian === "己") {
    hourTianIndex = 0; // 甲
  } else if (dayTian === "乙" || dayTian === "庚") {
    hourTianIndex = 2; // 丙
  } else if (dayTian === "丙" || dayTian === "辛") {
    hourTianIndex = 4; // 戊
  } else if (dayTian === "丁" || dayTian === "壬") {
    hourTianIndex = 6; // 庚
  } else { // 戊, 癸
    hourTianIndex = 8; // 壬
  }
  
  // 시간 지지에 따라 천간 조정
  // 자시(子)부터 시작하여 각 시간대마다 +2씩 증가
  const hourTian = TIANGAN[(hourTianIndex + hourIndex * 2) % 10];
  
  return hourTian + hourDizhiChar;
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
