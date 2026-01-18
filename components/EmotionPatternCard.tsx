/**
 * 패턴 분류 카드 컴포넌트
 * 감정 행동 유형을 시각화
 */

"use client";

import { PatternType } from "@/lib/contracts/emotion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface EmotionPatternCardProps {
  patternType: PatternType;
  confidence: number;
  language?: "ko" | "en";
}

const patternColors: Record<PatternType, string> = {
  emotional: "from-pink-500 to-rose-500",
  analytical: "from-blue-500 to-indigo-500",
  avoidant: "from-gray-500 to-slate-500",
  immersive: "from-purple-500 to-violet-500",
  empathetic: "from-green-500 to-emerald-500",
};

export function EmotionPatternCard({ patternType, confidence, language: propLanguage }: EmotionPatternCardProps) {
  const { t, language: contextLanguage } = useLanguage();
  const language = propLanguage || contextLanguage;
  const confidencePercent = Math.round(confidence * 100);

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-gray-900 mb-1">
            {t.emotion.patternTypes[patternType]}
          </h3>
          <p className="text-sm text-gray-600">
            {t.emotion.patternDescriptions[patternType]}
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
            {t.emotion.patternMatch}
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
