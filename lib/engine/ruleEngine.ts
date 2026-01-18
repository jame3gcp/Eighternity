import ruleTable from "../../rules/rule_table.json";
import templates from "../../rules/templates.json";
import { QuestionCategory, TodayFortuneResponse } from "../contracts/fortune";
import { seededRandom } from "../utils/random";
import {
  LifeLogRequest,
  HybridRecommendationResponse,
  MoodLevel,
  ConditionLevel,
  SleepQuality,
  ScheduleIntensity,
} from "../contracts/lifelog";

export const ruleEngine = {
  today: (fiveElements: any): TodayFortuneResponse => {
    const todayStr = new Date().toISOString().split("T")[0];
    const seed = `${todayStr}-${JSON.stringify(fiveElements)}`;
    const random = seededRandom(seed);
    
    let globalScore = 60;
    let messages: string[] = [];

    ruleTable.forEach((rule: any) => {
      if (rule.condition.includes(">")) {
        const [key, val] = rule.condition.split(">").map((s: string) => s.trim());
        if (fiveElements[key] > parseInt(val)) {
          globalScore += rule.scoreDelta;
          messages.push(rule.message);
        }
      }
    });

    globalScore += Math.floor(random() * 20) - 10;
    globalScore = Math.min(100, Math.max(0, globalScore));

    const getSeededItem = (arr: string[]) => arr[Math.floor(random() * arr.length)];
    
    const recommend = getSeededItem(templates.recommendations);
    const avoid = getSeededItem(templates.avoidances);
    
    const mainMessage = getSeededItem(templates.today)
      .replace("{message}", messages[0] || "고요한 흐름 속에 균형을 찾아가는 하루가 예상됩니다.")
      .replace("{recommend}", recommend)
      .replace("{avoid}", avoid);

    return {
      globalScore,
      work: Math.min(100, Math.max(0, globalScore + Math.floor(random() * 10) - 5)),
      love: Math.min(100, Math.max(0, globalScore + Math.floor(random() * 10) - 5)),
      money: Math.min(100, Math.max(0, globalScore + Math.floor(random() * 10) - 5)),
      health: Math.min(100, Math.max(0, globalScore + Math.floor(random() * 10) - 5)),
      mainMessage,
      recommend,
      avoid,
    };
  },

  /**
   * 하이브리드 추천: 사주 + 라이프 로그 결합
   */
  hybrid: (
    fiveElements: any,
    sajuScore: number,
    sajuMessage: string,
    lifeLog: LifeLogRequest | null
  ): HybridRecommendationResponse => {
    // 라이프 로그 분석
    const lifeLogAnalysis = analyzeLifeLog(lifeLog);
    
    // 사주 점수 조정 (라이프 로그 반영)
    const adjustedSajuScore = adjustSajuScoreWithLifeLog(sajuScore, lifeLogAnalysis);
    
    // 도메인별 점수 계산 및 조정
    const baseScores = {
      work: adjustedSajuScore,
      love: adjustedSajuScore,
      money: adjustedSajuScore,
      health: adjustedSajuScore,
    };
    
    const adjustedScores = adjustDomainScores(baseScores, lifeLogAnalysis);
    
    // 하이브리드 추천 생성
    const hybridRecommendation = generateHybridRecommendation(
      sajuMessage,
      lifeLogAnalysis,
      adjustedSajuScore
    );

    return {
      sajuScore,
      sajuMessage,
      lifeLogAnalysis,
      hybridRecommendation,
      adjustedScores,
    };
  },

  ask: (category: QuestionCategory, fiveElements?: any): string => {
    const todayStr = new Date().toISOString().split("T")[0];
    const seed = `${todayStr}-${category}-${fiveElements ? JSON.stringify(fiveElements) : ""}`;
    const random = seededRandom(seed);
    
    const categoryTemplates = (templates.question as any)[category];
    return categoryTemplates[Math.floor(random() * categoryTemplates.length)];
  },

  calendar: (fiveElements: any, days: number = 30) => {
    return Array.from({ length: days }).map((_: unknown, i: number) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      
      const seed = `${dateStr}-${JSON.stringify(fiveElements)}`;
      const random = seededRandom(seed);
      
      const score = random() * 100;
      let level: "good" | "normal" | "bad" = "normal";
      if (score > 70) level = "good";
      else if (score < 30) level = "bad";

      return {
        date: dateStr,
        level,
      };
    });
  },
};

/**
 * 라이프 로그 분석
 */
function analyzeLifeLog(lifeLog: LifeLogRequest | null): {
  hasData: boolean;
  riskFactors: string[];
  positiveFactors: string[];
  overallCondition: "excellent" | "good" | "normal" | "bad" | "terrible";
} {
  if (!lifeLog) {
    return {
      hasData: false,
      riskFactors: [],
      positiveFactors: [],
      overallCondition: "normal",
    };
  }

  const riskFactors: string[] = [];
  const positiveFactors: string[] = [];
  
  // 기분 분석
  if (lifeLog.mood === "terrible" || lifeLog.mood === "bad") {
    riskFactors.push("기분 저하");
  } else if (lifeLog.mood === "excellent" || lifeLog.mood === "good") {
    positiveFactors.push("긍정적인 기분");
  }
  
  // 컨디션 분석
  if (lifeLog.condition === "terrible" || lifeLog.condition === "bad") {
    riskFactors.push("컨디션 저하");
  } else if (lifeLog.condition === "excellent" || lifeLog.condition === "good") {
    positiveFactors.push("좋은 컨디션");
  }
  
  // 수면 분석
  if (lifeLog.sleep === "terrible" || lifeLog.sleep === "bad") {
    riskFactors.push("수면 부족");
  } else if (lifeLog.sleep === "excellent" || lifeLog.sleep === "good") {
    positiveFactors.push("충분한 수면");
  }
  
  // 일정 분석
  if (lifeLog.schedule === "very_busy" || lifeLog.schedule === "busy") {
    riskFactors.push("과도한 일정");
  } else if (lifeLog.schedule === "free" || lifeLog.schedule === "light") {
    positiveFactors.push("여유로운 일정");
  }
  
  // 전체 컨디션 계산
  const scores = {
    mood: getScoreFromLevel(lifeLog.mood),
    condition: getScoreFromLevel(lifeLog.condition),
    sleep: getScoreFromLevel(lifeLog.sleep),
    schedule: getScoreFromSchedule(lifeLog.schedule),
  };
  
  const avgScore = (scores.mood + scores.condition + scores.sleep + scores.schedule) / 4;
  
  let overallCondition: "excellent" | "good" | "normal" | "bad" | "terrible";
  if (avgScore >= 80) overallCondition = "excellent";
  else if (avgScore >= 60) overallCondition = "good";
  else if (avgScore >= 40) overallCondition = "normal";
  else if (avgScore >= 20) overallCondition = "bad";
  else overallCondition = "terrible";

  return {
    hasData: true,
    riskFactors,
    positiveFactors,
    overallCondition,
  };
}

/**
 * 레벨을 점수로 변환
 */
function getScoreFromLevel(level: MoodLevel | ConditionLevel | SleepQuality): number {
  const mapping = {
    excellent: 100,
    good: 75,
    normal: 50,
    bad: 25,
    terrible: 0,
  };
  return mapping[level];
}

/**
 * 일정 강도를 점수로 변환 (반대: 바쁠수록 낮은 점수)
 */
function getScoreFromSchedule(schedule: ScheduleIntensity): number {
  const mapping = {
    very_busy: 0,
    busy: 25,
    normal: 50,
    light: 75,
    free: 100,
  };
  return mapping[schedule];
}

/**
 * 사주 점수를 라이프 로그로 조정
 */
function adjustSajuScoreWithLifeLog(
  sajuScore: number,
  lifeLogAnalysis: ReturnType<typeof analyzeLifeLog>
): number {
  if (!lifeLogAnalysis.hasData) {
    return sajuScore;
  }

  let adjustment = 0;
  
  // 위험 요인에 따른 감점
  adjustment -= lifeLogAnalysis.riskFactors.length * 8;
  
  // 긍정 요인에 따른 가점
  adjustment += lifeLogAnalysis.positiveFactors.length * 5;
  
  // 전체 컨디션에 따른 조정
  const conditionAdjustment = {
    excellent: 15,
    good: 8,
    normal: 0,
    bad: -12,
    terrible: -25,
  };
  adjustment += conditionAdjustment[lifeLogAnalysis.overallCondition];
  
  return Math.min(100, Math.max(0, sajuScore + adjustment));
}

/**
 * 도메인별 점수 조정
 */
function adjustDomainScores(
  baseScores: { work: number; love: number; money: number; health: number },
  lifeLogAnalysis: ReturnType<typeof analyzeLifeLog>
): { work: number; love: number; money: number; health: number } {
  if (!lifeLogAnalysis.hasData) {
    return baseScores;
  }

  const adjustments = {
    work: 0,
    love: 0,
    money: 0,
    health: 0,
  };

  // 위험 요인별 도메인 영향
  lifeLogAnalysis.riskFactors.forEach((factor) => {
    if (factor === "컨디션 저하" || factor === "수면 부족") {
      adjustments.work -= 10;
      adjustments.health -= 15;
    }
    if (factor === "기분 저하") {
      adjustments.love -= 12;
      adjustments.work -= 8;
    }
    if (factor === "과도한 일정") {
      adjustments.health -= 10;
      adjustments.work -= 5;
    }
  });

  // 긍정 요인별 도메인 영향
  lifeLogAnalysis.positiveFactors.forEach((factor) => {
    if (factor === "좋은 컨디션" || factor === "충분한 수면") {
      adjustments.work += 8;
      adjustments.health += 12;
    }
    if (factor === "긍정적인 기분") {
      adjustments.love += 10;
      adjustments.work += 5;
    }
    if (factor === "여유로운 일정") {
      adjustments.health += 8;
      adjustments.money += 5; // 여유로우면 재물 관리에 집중 가능
    }
  });

  return {
    work: Math.min(100, Math.max(0, baseScores.work + adjustments.work)),
    love: Math.min(100, Math.max(0, baseScores.love + adjustments.love)),
    money: Math.min(100, Math.max(0, baseScores.money + adjustments.money)),
    health: Math.min(100, Math.max(0, baseScores.health + adjustments.health)),
  };
}

/**
 * 하이브리드 추천 생성
 */
function generateHybridRecommendation(
  sajuMessage: string,
  lifeLogAnalysis: ReturnType<typeof analyzeLifeLog>,
  adjustedScore: number
): {
  mainMessage: string;
  recommend: string;
  avoid: string;
  priority: "high" | "medium" | "low";
  reasoning: string;
} {
  const todayStr = new Date().toISOString().split("T")[0];
  const seed = `${todayStr}-${JSON.stringify(lifeLogAnalysis)}`;
  const random = seededRandom(seed);
  
  const getSeededItem = (arr: string[]) => arr[Math.floor(random() * arr.length)];

  let mainMessage = sajuMessage;
  let recommend = getSeededItem(templates.recommendations);
  let avoid = getSeededItem(templates.avoidances);
  let priority: "high" | "medium" | "low" = "medium";
  let reasoning = "";

  // 라이프 로그가 있는 경우 하이브리드 추천 생성
  if (lifeLogAnalysis.hasData) {
    const riskCount = lifeLogAnalysis.riskFactors.length;
    const positiveCount = lifeLogAnalysis.positiveFactors.length;
    
    // 위험 요인이 많으면 우선순위 높음
    if (riskCount >= 2) {
      priority = "high";
      
      // 충돌수 높은 날 + 컨디션 저하 → 중요한 대화 미루기
      if (adjustedScore < 50 && lifeLogAnalysis.riskFactors.includes("컨디션 저하")) {
        recommend = "중요한 대화나 결정은 내일로 미루기";
        avoid = "무리한 일정 소화하기";
        reasoning = `오늘은 사주상 충돌수가 높은 날인데, 컨디션도 저하되어 있어 중요한 결정이나 대화는 피하는 것이 좋습니다.`;
      } else if (lifeLogAnalysis.riskFactors.includes("수면 부족")) {
        recommend = "충분한 휴식과 가벼운 활동";
        avoid = "과도한 업무나 스트레스 유발 행동";
        reasoning = `수면이 부족한 상태에서 무리하면 컨디션이 더 악화될 수 있습니다.`;
      } else {
        reasoning = `사주상 ${adjustedScore < 50 ? "주의가 필요한 날" : "평범한 날"}인데, 여러 위험 요인이 있어 신중하게 하루를 보내는 것이 좋습니다.`;
      }
    } else if (positiveCount >= 2 && adjustedScore >= 60) {
      priority = "low";
      recommend = "새로운 도전이나 중요한 결정 진행";
      avoid = "과도한 신중함";
      reasoning = `사주도 좋고 컨디션도 양호하여 새로운 일을 시작하거나 중요한 결정을 내리기에 좋은 날입니다.`;
    } else {
      reasoning = `사주와 현재 컨디션을 종합적으로 고려한 추천입니다.`;
    }
    
    // 메시지에 라이프 로그 반영
    if (lifeLogAnalysis.riskFactors.length > 0) {
      mainMessage = `${sajuMessage} 다만 현재 컨디션이 ${lifeLogAnalysis.overallCondition === "bad" || lifeLogAnalysis.overallCondition === "terrible" ? "저하되어 있어" : "평범하여"} 더욱 신중하게 하루를 보내는 것이 좋습니다.`;
    }
  } else {
    reasoning = "사주 기반 추천입니다. 더 정확한 추천을 위해 오늘의 기분, 컨디션, 수면, 일정을 입력해주세요.";
  }

  return {
    mainMessage,
    recommend,
    avoid,
    priority,
    reasoning,
  };
}
