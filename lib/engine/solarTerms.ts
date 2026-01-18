/**
 * 절기(節氣) 계산 유틸리티
 * 사주의 월주는 절기 기준으로 계산됩니다.
 */

/**
 * 절기 목록 (24절기)
 */
export const SOLAR_TERMS = [
  "입춘", "우수", "경칩", "춘분", "청명", "곡우",
  "입하", "소만", "망종", "하지", "소서", "대서",
  "입추", "처서", "백로", "추분", "한로", "상강",
  "입동", "소설", "대설", "동지", "소한", "대한"
];

/**
 * 각 절기의 대략적인 날짜 (월, 일)
 * 실제로는 태양의 황경을 기준으로 정확히 계산해야 하지만,
 * 여기서는 대략적인 날짜를 사용합니다.
 */
const SOLAR_TERM_DATES: Array<{ month: number; day: number }> = [
  { month: 2, day: 4 },   // 입춘
  { month: 2, day: 19 }, // 우수
  { month: 3, day: 6 },  // 경칩
  { month: 3, day: 21 }, // 춘분
  { month: 4, day: 5 },  // 청명
  { month: 4, day: 20 }, // 곡우
  { month: 5, day: 6 },  // 입하
  { month: 5, day: 21 }, // 소만
  { month: 6, day: 6 },  // 망종
  { month: 6, day: 21 }, // 하지
  { month: 7, day: 7 },  // 소서
  { month: 7, day: 23 }, // 대서
  { month: 8, day: 8 },  // 입추
  { month: 8, day: 23 }, // 처서
  { month: 9, day: 8 },  // 백로
  { month: 9, day: 23 }, // 추분
  { month: 10, day: 8 }, // 한로
  { month: 10, day: 23 }, // 상강
  { month: 11, day: 7 }, // 입동
  { month: 11, day: 22 }, // 소설
  { month: 12, day: 7 }, // 대설
  { month: 12, day: 22 }, // 동지
  { month: 1, day: 6 },  // 소한
  { month: 1, day: 20 }, // 대한
];

/**
 * 절기 기준 월의 지지
 * 입춘~경칩 전 = 인월(寅), 경칩~청명 전 = 묘월(卯), ...
 */
const MONTH_DIZHI_BY_TERM = [
  "寅", "寅", // 입춘, 우수
  "卯", "卯", // 경칩, 춘분
  "辰", "辰", // 청명, 곡우
  "巳", "巳", // 입하, 소만
  "午", "午", // 망종, 하지
  "未", "未", // 소서, 대서
  "申", "申", // 입추, 처서
  "酉", "酉", // 백로, 추분
  "戌", "戌", // 한로, 상강
  "亥", "亥", // 입동, 소설
  "子", "子", // 대설, 동지
  "丑", "丑", // 소한, 대한
];

/**
 * 절기 기준으로 월의 지지 계산
 * @param year 년도
 * @param month 월 (1-12)
 * @param day 일
 * @returns 해당 날짜의 월 지지
 */
export function getMonthDizhiBySolarTerm(year: number, month: number, day: number): string {
  // 절기 기준 월 매핑
  // 입춘(2/4) ~ 경칩(3/6) 전 = 인월(寅)
  // 경칩(3/6) ~ 청명(4/5) 전 = 묘월(卯)
  // 청명(4/5) ~ 입하(5/6) 전 = 진월(辰)
  // 입하(5/6) ~ 망종(6/6) 전 = 사월(巳)
  // 망종(6/6) ~ 소서(7/7) 전 = 오월(午)
  // 소서(7/7) ~ 입추(8/8) 전 = 미월(未)
  // 입추(8/8) ~ 백로(9/8) 전 = 신월(申)
  // 백로(9/8) ~ 한로(10/8) 전 = 유월(酉)
  // 한로(10/8) ~ 입동(11/7) 전 = 술월(戌)
  // 입동(11/7) ~ 대설(12/7) 전 = 해월(亥)
  // 대설(12/7) ~ 소한(1/6) 전 = 자월(子)
  // 소한(1/6) ~ 입춘(2/4) 전 = 축월(丑)
  
  // 월별 절기 기준점
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
  
  // 현재 월의 절기 확인
  for (let i = 0; i < termMap.length; i++) {
    const current = termMap[i];
    const next = termMap[(i + 1) % termMap.length];
    
    // 같은 월인 경우
    if (month === current.month) {
      if (day < current.termDay) {
        // 절기 이전이면 이전 월의 지지
        const prev = termMap[(i - 1 + termMap.length) % termMap.length];
        return prev.dizhi;
      } else {
        // 절기 이후면 현재 월의 지지
        return current.dizhi;
      }
    }
    
    // 다음 절기 월인 경우
    if (month === next.month && day < next.termDay) {
      return current.dizhi;
    }
  }
  
  // 기본값
  return "寅";
}

/**
 * 년간 기준 월간 계산
 * 년간에 따라 월간이 달라집니다.
 */
export function getMonthTianByYearTian(yearTian: string, monthDizhi: string): string {
  const TIANGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const DIZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  
  const yearTianIndex = TIANGAN.indexOf(yearTian);
  const monthDiIndex = DIZHI.indexOf(monthDizhi);
  
  // 월간 계산 공식: 년간 + 월 지지 오프셋
  // 인월(2) = +2, 묘월(3) = +4, 진월(4) = +0, ...
  const monthOffset = [2, 4, 0, 2, 4, 0, 2, 4, 0, 2, 4, 0];
  const tianIndex = (yearTianIndex + monthOffset[monthDiIndex]) % 10;
  
  return TIANGAN[tianIndex];
}
