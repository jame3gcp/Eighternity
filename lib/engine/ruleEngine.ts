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
  today: (fiveElements: any, lang: "ko" | "en" = "ko"): TodayFortuneResponse => {
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
          messages.push(lang === "en" ? rule.message_en : rule.message_ko);
        }
      }
    });

    globalScore += Math.floor(random() * 20) - 10;
    globalScore = Math.min(100, Math.max(0, globalScore));

    const getSeededItem = (arr: string[]) => arr[Math.floor(random() * arr.length)];
    
    const langTemplates = (templates as any)[lang] || templates.ko;
    const recommend = getSeededItem(langTemplates.recommendations);
    const avoid = getSeededItem(langTemplates.avoidances);
    
    const defaultMessage = lang === "en" ? "A day of finding balance in a calm flow." : "고요한 흐름 속에 균형을 찾아가는 하루가 예상됩니다.";
    const mainMessage = getSeededItem(langTemplates.today)
      .replace("{message}", messages[0] || defaultMessage)
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

  hybrid: (
    fiveElements: any,
    sajuScore: number,
    sajuMessage: string,
    lifeLog: LifeLogRequest | null,
    lang: "ko" | "en" = "ko"
  ): HybridRecommendationResponse => {
    const lifeLogAnalysis = analyzeLifeLog(lifeLog, lang);
    const adjustedSajuScore = adjustSajuScoreWithLifeLog(sajuScore, lifeLogAnalysis);
    
    const baseScores = {
      work: adjustedSajuScore,
      love: adjustedSajuScore,
      money: adjustedSajuScore,
      health: adjustedSajuScore,
    };
    
    const adjustedScores = adjustDomainScores(baseScores, lifeLogAnalysis);
    const hybridRecommendation = generateHybridRecommendation(
      sajuMessage,
      lifeLogAnalysis,
      adjustedSajuScore,
      lang
    );

    return {
      sajuScore,
      sajuMessage,
      lifeLogAnalysis,
      hybridRecommendation,
      adjustedScores,
    };
  },

  ask: (category: QuestionCategory, fiveElements?: any, lang: "ko" | "en" = "ko"): string => {
    const todayStr = new Date().toISOString().split("T")[0];
    const seed = `${todayStr}-${category}-${fiveElements ? JSON.stringify(fiveElements) : ""}`;
    const random = seededRandom(seed);
    
    const langTemplates = (templates as any)[lang] || templates.ko;
    const categoryTemplates = (langTemplates.question as any)[category];
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

function analyzeLifeLog(lifeLog: LifeLogRequest | null, lang: "ko" | "en" = "ko"): {
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
  
  if (lifeLog.mood === "terrible" || lifeLog.mood === "bad") {
    riskFactors.push(lang === "en" ? "Low mood" : "기분 저하");
  } else if (lifeLog.mood === "excellent" || lifeLog.mood === "good") {
    positiveFactors.push(lang === "en" ? "Positive mood" : "긍정적인 기분");
  }
  
  if (lifeLog.condition === "terrible" || lifeLog.condition === "bad") {
    riskFactors.push(lang === "en" ? "Low condition" : "컨디션 저하");
  } else if (lifeLog.condition === "excellent" || lifeLog.condition === "good") {
    positiveFactors.push(lang === "en" ? "Good condition" : "좋은 컨디션");
  }
  
  if (lifeLog.sleep === "terrible" || lifeLog.sleep === "bad") {
    riskFactors.push(lang === "en" ? "Lack of sleep" : "수면 부족");
  } else if (lifeLog.sleep === "excellent" || lifeLog.sleep === "good") {
    positiveFactors.push(lang === "en" ? "Enough sleep" : "충분한 수면");
  }
  
  if (lifeLog.schedule === "very_busy" || lifeLog.schedule === "busy") {
    riskFactors.push(lang === "en" ? "Overloaded schedule" : "과도한 일정");
  } else if (lifeLog.schedule === "free" || lifeLog.schedule === "light") {
    positiveFactors.push(lang === "en" ? "Relaxed schedule" : "여유로운 일정");
  }
  
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

function adjustSajuScoreWithLifeLog(
  sajuScore: number,
  lifeLogAnalysis: ReturnType<typeof analyzeLifeLog>
): number {
  if (!lifeLogAnalysis.hasData) {
    return sajuScore;
  }

  let adjustment = 0;
  adjustment -= lifeLogAnalysis.riskFactors.length * 8;
  adjustment += lifeLogAnalysis.positiveFactors.length * 5;
  
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

function adjustDomainScores(
  baseScores: { work: number; love: number; money: number; health: number },
  lifeLogAnalysis: ReturnType<typeof analyzeLifeLog>
): { work: number; love: number; money: number; health: number } {
  if (!lifeLogAnalysis.hasData) {
    return baseScores;
  }

  const adjustments = { work: 0, love: 0, money: 0, health: 0 };

  lifeLogAnalysis.riskFactors.forEach((factor) => {
    if (factor.includes("컨디션") || factor.includes("수면") || factor.includes("condition") || factor.includes("sleep")) {
      adjustments.work -= 10;
      adjustments.health -= 15;
    }
    if (factor.includes("기분") || factor.includes("mood")) {
      adjustments.love -= 12;
      adjustments.work -= 8;
    }
    if (factor.includes("일정") || factor.includes("schedule")) {
      adjustments.health -= 10;
      adjustments.work -= 5;
    }
  });

  lifeLogAnalysis.positiveFactors.forEach((factor) => {
    if (factor.includes("컨디션") || factor.includes("수면") || factor.includes("condition") || factor.includes("sleep")) {
      adjustments.work += 8;
      adjustments.health += 12;
    }
    if (factor.includes("기분") || factor.includes("mood")) {
      adjustments.love += 10;
      adjustments.work += 5;
    }
    if (factor.includes("일정") || factor.includes("schedule")) {
      adjustments.health += 8;
      adjustments.money += 5;
    }
  });

  return {
    work: Math.min(100, Math.max(0, baseScores.work + adjustments.work)),
    love: Math.min(100, Math.max(0, baseScores.love + adjustments.love)),
    money: Math.min(100, Math.max(0, baseScores.money + adjustments.money)),
    health: Math.min(100, Math.max(0, baseScores.health + adjustments.health)),
  };
}

function generateHybridRecommendation(
  sajuMessage: string,
  lifeLogAnalysis: ReturnType<typeof analyzeLifeLog>,
  adjustedScore: number,
  lang: "ko" | "en" = "ko"
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
  const langTemplates = (templates as any)[lang] || templates.ko;

  let mainMessage = sajuMessage;
  let recommend = getSeededItem(langTemplates.recommendations);
  let avoid = getSeededItem(langTemplates.avoidances);
  let priority: "high" | "medium" | "low" = "medium" as const;
  let reasoning = "";

  if (lifeLogAnalysis.hasData) {
    const riskCount = lifeLogAnalysis.riskFactors.length;
    const positiveCount = lifeLogAnalysis.positiveFactors.length;
    
    if (riskCount >= 2) {
      priority = "high";
      
      if (adjustedScore < 50 && lifeLogAnalysis.riskFactors.some(f => f.includes("컨디션") || f.includes("condition"))) {
        recommend = lang === "en" ? "Delay important conversations or decisions until tomorrow" : "중요한 대화나 결정은 내일로 미루기";
        avoid = lang === "en" ? "Pushing yourself with a heavy schedule" : "무리한 일정 소화하기";
        reasoning = lang === "en" 
          ? `Today has high conflict energy according to your Saju, and your condition is low. It's best to avoid important decisions or conversations.`
          : `오늘은 사주상 충돌수가 높은 날인데, 컨디션도 저하되어 있어 중요한 결정이나 대화는 피하는 것이 좋습니다.`;
      } else if (lifeLogAnalysis.riskFactors.some(f => f.includes("수면") || f.includes("sleep"))) {
        recommend = lang === "en" ? "Sufficient rest and light activities" : "충분한 휴식과 가벼운 활동";
        avoid = lang === "en" ? "Excessive work or stress-inducing behavior" : "과도한 업무나 스트레스 유발 행동";
        reasoning = lang === "en"
          ? `Overdoing it while lacking sleep may worsen your condition.`
          : `수면이 부족한 상태에서 무리하면 컨디션이 더 악화될 수 있습니다.`;
      } else {
        reasoning = lang === "en"
          ? `It's a ${adjustedScore < 50 ? "day requiring caution" : "normal day"} according to Saju, but with several risk factors, it's best to spend the day carefully.`
          : `사주상 ${adjustedScore < 50 ? "주의가 필요한 날" : "평범한 날"}인데, 여러 위험 요인이 있어 신중하게 하루를 보내는 것이 좋습니다.`;
      }
    } else if (positiveCount >= 2 && adjustedScore >= 60) {
      priority = "low";
      recommend = lang === "en" ? "Pursue new challenges or important decisions" : "새로운 도전이나 중요한 결정 진행";
      avoid = lang === "en" ? "Excessive caution" : "과도한 신중함";
      reasoning = lang === "en"
        ? `Saju is good and your condition is favorable, making it a great day to start new things or make important decisions.`
        : `사주도 좋고 컨디션도 양호하여 새로운 일을 시작하거나 중요한 결정을 내리기에 좋은 날입니다.`;
    } else {
      reasoning = lang === "en"
        ? `This recommendation considers both your Saju and current condition.`
        : `사주와 현재 컨디션을 종합적으로 고려한 추천입니다.`;
    }
    
    if (lifeLogAnalysis.riskFactors.length > 0) {
      const conditionDesc = lang === "en" 
        ? (lifeLogAnalysis.overallCondition === "bad" || lifeLogAnalysis.overallCondition === "terrible" ? "low" : "normal")
        : (lifeLogAnalysis.overallCondition === "bad" || lifeLogAnalysis.overallCondition === "terrible" ? "저하되어 있어" : "평범하여");
      
      mainMessage = lang === "en"
        ? `${sajuMessage} However, as your current condition is ${conditionDesc}, it's better to spend the day more cautiously.`
        : `${sajuMessage} 다만 현재 컨디션이 ${conditionDesc} 더욱 신중하게 하루를 보내는 것이 좋습니다.`;
    }
  } else {
    reasoning = lang === "en"
      ? "Saju-based recommendation. For more accurate recommendations, please enter today's mood, condition, sleep, and schedule."
      : "사주 기반 추천입니다. 더 정확한 추천을 위해 오늘의 기분, 컨디션, 수면, 일정을 입력해주세요.";
  }

  return { mainMessage, recommend, avoid, priority, reasoning };
}
