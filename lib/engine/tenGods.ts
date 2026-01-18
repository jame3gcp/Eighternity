/**
 * 십성(十神) 계산
 * 일간(日干)을 기준으로 다른 간지와의 관계를 분석합니다.
 */

const TIANGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

/**
 * 십성 타입
 */
export type TenGodType =
  | "比肩" // 비견: 같은 오행, 같은 음양
  | "劫財" // 겁재: 같은 오행, 다른 음양
  | "食神" // 식신: 내가 낳는 것, 같은 음양
  | "傷官" // 상관: 내가 낳는 것, 다른 음양
  | "偏財" // 편재: 내가 극하는 것, 같은 음양
  | "正財" // 정재: 내가 극하는 것, 다른 음양
  | "七殺" // 칠살: 나를 극하는 것, 같은 음양
  | "正官" // 정관: 나를 극하는 것, 다른 음양
  | "偏印" // 편인: 나를 낳는 것, 같은 음양
  | "正印"; // 정인: 나를 낳는 것, 다른 음양

/**
 * 천간의 오행
 */
function getElement(tian: string): "wood" | "fire" | "earth" | "metal" | "water" {
  const index = TIANGAN.indexOf(tian);
  if (index < 0) return "wood";
  
  if (index < 2) return "wood"; // 甲, 乙
  if (index < 4) return "fire"; // 丙, 丁
  if (index < 6) return "earth"; // 戊, 己
  if (index < 8) return "metal"; // 庚, 辛
  return "water"; // 壬, 癸
}

/**
 * 천간의 음양 (0: 양, 1: 음)
 */
function getYinYang(tian: string): 0 | 1 {
  const index = TIANGAN.indexOf(tian);
  return (index % 2) as 0 | 1;
}

/**
 * 오행 상생 관계 (생하는 것)
 */
function getGeneratingElement(element: string): string {
  const map: Record<string, string> = {
    wood: "fire",
    fire: "earth",
    earth: "metal",
    metal: "water",
    water: "wood",
  };
  return map[element] || element;
}

/**
 * 오행 상극 관계 (극하는 것)
 */
function getOvercomingElement(element: string): string {
  const map: Record<string, string> = {
    wood: "earth",
    fire: "metal",
    earth: "water",
    metal: "wood",
    water: "fire",
  };
  return map[element] || element;
}

/**
 * 십성 계산
 * @param dayMaster 일간(日干)
 * @param target 천간 또는 지지
 * @returns 십성 타입
 */
export function calculateTenGod(dayMaster: string, target: string): TenGodType {
  const dayElement = getElement(dayMaster);
  const targetElement = getElement(target);
  const dayYinYang = getYinYang(dayMaster);
  const targetYinYang = getYinYang(target);

  // 같은 오행
  if (dayElement === targetElement) {
    return dayYinYang === targetYinYang ? "比肩" : "劫財";
  }

  // 내가 낳는 것 (생)
  if (getGeneratingElement(dayElement) === targetElement) {
    return dayYinYang === targetYinYang ? "食神" : "傷官";
  }

  // 내가 극하는 것 (극)
  if (getOvercomingElement(dayElement) === targetElement) {
    return dayYinYang === targetYinYang ? "偏財" : "正財";
  }

  // 나를 극하는 것 (극당)
  if (getOvercomingElement(targetElement) === dayElement) {
    return dayYinYang === targetYinYang ? "七殺" : "正官";
  }

  // 나를 낳는 것 (생당)
  if (getGeneratingElement(targetElement) === dayElement) {
    return dayYinYang === targetYinYang ? "偏印" : "正印";
  }

  // 기본값 (발생하지 않아야 함)
  return "比肩";
}

/**
 * 지지의 본기 천간 매핑
 * 지지의 본기(本氣) 천간을 반환합니다.
 */
function getDizhiBenqi(di: string): string {
  const DIZHI_BENQI: Record<string, string> = {
    "子": "癸", "丑": "己", "寅": "甲", "卯": "乙",
    "辰": "戊", "巳": "丙", "午": "丁", "未": "己",
    "申": "庚", "酉": "辛", "戌": "戊", "亥": "壬",
  };
  return DIZHI_BENQI[di] || "甲";
}

/**
 * 사주 사주에서 십성 분석
 */
export function analyzeTenGods(
  dayMaster: string,
  pillars: { year: string; month: string; day: string; hour: string }
): Record<TenGodType, number> {
  const counts: Record<TenGodType, number> = {
    比肩: 0,
    劫財: 0,
    食神: 0,
    傷官: 0,
    偏財: 0,
    正財: 0,
    七殺: 0,
    正官: 0,
    偏印: 0,
    正印: 0,
  };

  // 각 주의 천간과 지지 분석
  const allPillars = [pillars.year, pillars.month, pillars.day, pillars.hour];
  
  allPillars.forEach((pillar) => {
    if (!pillar || pillar === "未知") return;
    
    // pillar가 문자열이고 최소 2자 이상인지 확인
    if (typeof pillar !== "string" || pillar.length < 2) {
      console.warn(`⚠️ 유효하지 않은 기둥 값: ${pillar}`);
      return;
    }
    
    const tian = pillar[0];
    const di = pillar[1];
    
    // 천간과 지지가 유효한지 확인
    if (!tian || !di) {
      console.warn(`⚠️ 기둥에서 천간 또는 지지를 추출할 수 없음: ${pillar}`);
      return;
    }
    
    // 천간의 십성
    const tianTenGod = calculateTenGod(dayMaster, tian);
    counts[tianTenGod]++;
    
    // 지지의 십성 (지지의 본기 천간으로 변환하여 계산)
    const diBenqi = getDizhiBenqi(di);
    const diTenGod = calculateTenGod(dayMaster, diBenqi);
    counts[diTenGod]++;
  });

  return counts;
}
