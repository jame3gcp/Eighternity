/**
 * 패턴 분류 카드 컴포넌트
 * 감정 행동 유형을 시각화
 */

"use client";

import { PatternType } from "@/lib/contracts/emotion";
import { cn } from "@/lib/utils";

interface EmotionPatternCardProps {
  patternType: PatternType;
  confidence: number;
}

const patternLabels: Record<PatternType, string> = {
  emotional: "정서형",
  analytical: "사고형",
  avoidant: "회피형",
  immersive: "몰입형",
  empathetic: "공감형",
};

const patternDescriptions: Record<PatternType, string> = {
  emotional: "감정 변화가 크고 표현이 풍부한 유형",
  analytical: "논리적이고 분석적인 사고를 선호하는 유형",
  avoidant: "감정 회피 경향이 있는 유형",
  immersive: "깊이 몰입하는 경향이 있는 유형",
  empathetic: "타인의 감정에 민감하고 공감 능력이 뛰어난 유형",
};

const patternColors: Record<PatternType, string> = {
  emotional: "from-pink-500 to-rose-500",
  analytical: "from-blue-500 to-indigo-500",
  avoidant: "from-gray-500 to-slate-500",
  immersive: "from-purple-500 to-violet-500",
  empathetic: "from-green-500 to-emerald-500",
};

export function EmotionPatternCard({ patternType, confidence }: EmotionPatternCardProps) {
  const confidencePercent = Math.round(confidence * 100);

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-gray-900 mb-1">
            {patternLabels[patternType]}
          </h3>
          <p className="text-sm text-gray-600">
            {patternDescriptions[patternType]}
          </p>
        </div>
        <div className={cn(
          "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-black text-xl",
          patternColors[patternType]
        )}>
          {confidencePercent}%
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            패턴 일치도
          </span>
          <span className="text-sm font-bold text-gray-900">
            {confidencePercent}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r transition-all duration-1000",
              patternColors[patternType]
            )}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
