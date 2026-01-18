/**
 * 행동 상관 히트맵 컴포넌트
 * 행동과 감정의 상관관계를 시각화
 */

"use client";

import { BehaviorCorrelation, EmotionType } from "@/lib/contracts/emotion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface BehaviorHeatmapProps {
  correlations: BehaviorCorrelation[];
  language?: "ko" | "en";
}

export function BehaviorHeatmap({ correlations, language: propLanguage }: BehaviorHeatmapProps) {
  const { t, language: contextLanguage } = useLanguage();
  const language = propLanguage || contextLanguage;

  if (correlations.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-gray-400">
        <p>{t.emotion.noBehaviorData}</p>
      </div>
    );
  }

  // 행동별로 그룹화
  const behaviors = Array.from(new Set(correlations.map(c => c.behavior)));
  
  // 상관계수에 따른 색상
  const getCorrelationColor = (correlation: number) => {
    if (correlation > 0.5) return "bg-green-500";
    if (correlation > 0.2) return "bg-green-300";
    if (correlation > -0.2) return "bg-gray-200";
    if (correlation > -0.5) return "bg-red-300";
    return "bg-red-500";
  };

  const getCorrelationText = (correlation: number) => {
    if (correlation > 0.5) return t.emotion.strongPositive;
    if (correlation > 0.2) return t.emotion.positive;
    if (correlation > -0.2) return t.emotion.noCorrelation;
    if (correlation > -0.5) return t.emotion.negative;
    return t.emotion.strongNegative;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200">
                {t.emotion.behavior}
              </th>
              <th className="p-3 text-center text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200">
                {t.emotion.emotion}
              </th>
              <th className="p-3 text-center text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200">
                {t.emotion.frequency}
              </th>
              <th className="p-3 text-center text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200">
                {t.emotion.correlationCoefficient}
              </th>
              <th className="p-3 text-center text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200">
                {t.emotion.relationship}
              </th>
            </tr>
          </thead>
          <tbody>
            {behaviors.map((behavior) => {
              const behaviorCorrelations = correlations.filter(c => c.behavior === behavior);
              return behaviorCorrelations.map((corr, idx) => (
                <tr
                  key={`${behavior}-${corr.emotion}-${idx}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {idx === 0 && (
                    <td
                      rowSpan={behaviorCorrelations.length}
                      className="p-3 text-sm font-semibold text-gray-900 border-b border-gray-100 align-top"
                    >
                      {behavior}
                    </td>
                  )}
                  <td className="p-3 text-sm text-gray-700 border-b border-gray-100 text-center">
                    {t.emotion.emotionLabels[corr.emotion]}
                  </td>
                  <td className="p-3 text-sm text-gray-700 border-b border-gray-100 text-center">
                    {corr.frequency}
                  </td>
                  <td className="p-3 border-b border-gray-100 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className={cn(
                          "w-16 h-6 rounded flex items-center justify-center text-xs font-bold text-white",
                          getCorrelationColor(corr.correlation)
                        )}
                      >
                        {corr.correlation.toFixed(2)}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-xs text-gray-600 border-b border-gray-100 text-center">
                    {getCorrelationText(corr.correlation)}
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
