/**
 * 감정 분석 리포트 페이지
 * 감정 파형, 패턴 분류, 행동 상관 등을 시각화
 */

"use client";

import { useEffect, useState } from "react";
import { EmotionAnalysisResponse } from "@/lib/contracts/emotion";
import { EmotionWaveGraph } from "@/components/EmotionWaveGraph";
import { BehaviorHeatmap } from "@/components/BehaviorHeatmap";
import { EmotionPatternCard } from "@/components/EmotionPatternCard";
import { Skeleton } from "@/components/Skeleton";
import { Badge } from "@/components/Badge";
import { Sparkles, TrendingUp, MessageCircle, Lightbulb, Target } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function EmotionPage() {
  const { t, language } = useLanguage();
  const [data, setData] = useState<EmotionAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmotionAnalysis();
  }, []);

  const fetchEmotionAnalysis = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/emotion/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          period: "day",
          includeLifeLog: true,
          includeNotes: true,
        }),
      });

      if (res.status === 401) {
        window.location.href = "/onboarding";
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || t.emotion.analysisFailed);
      }

      const analysisData = await res.json();
      setData(analysisData);
    } catch (err: any) {
      console.error("Emotion analysis error:", err);
      setError(err.message || t.emotion.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-12 pb-10 animate-enter">
        <header className="flex items-center gap-6 pt-4">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </header>
        <Skeleton className="h-64 w-full rounded-[2rem]" />
        <Skeleton className="h-64 w-full rounded-[2rem]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <Sparkles size={32} className="text-red-400" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-gray-900">{t.emotion.error}</h2>
          <p className="text-gray-500">{error}</p>
        </div>
        <button
          onClick={fetchEmotionAnalysis}
          className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all"
        >
          {t.emotion.retry}
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <Sparkles size={32} className="text-gray-400" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-gray-900">{t.emotion.noData}</h2>
          <p className="text-gray-500">{t.emotion.noDataMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 pb-10 animate-enter">
      <header className="flex items-center gap-6 pt-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-400 p-[3px] shadow-xl shadow-pink-200">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-pink-500 overflow-hidden">
            <Sparkles size={48} strokeWidth={1.5} />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{t.emotion.title}</h1>
          {language === "ko" && (
            <p className="text-sm text-slate-500 font-bold mt-1 uppercase tracking-wide">{t.emotion.subtitle}</p>
          )}
        </div>
      </header>

      {/* AI 코멘트 */}
      <section className="glass-card rounded-[2.5rem] p-8 bg-white border-white/50 shadow-2xl shadow-slate-200/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
            <MessageCircle size={24} className="text-pink-500" />
            {t.emotion.aiComment}
          </h2>
          {language === "ko" && (
            <Badge variant="default" className="px-3">{t.emotion.aiAnalysis}</Badge>
          )}
        </div>
        <p className="text-base leading-relaxed text-gray-700">{data.aiComment}</p>
      </section>

      {/* 패턴 분류 */}
      <section className="glass-card rounded-[2.5rem] p-8 bg-white border-white/50 shadow-2xl shadow-slate-200/50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
            <Target size={24} className="text-indigo-500" />
            {t.emotion.patternType}
          </h2>
          {language === "ko" && (
            <Badge variant="default" className="px-3">{t.emotion.pattern}</Badge>
          )}
        </div>
        <EmotionPatternCard patternType={data.patternType} confidence={data.patternConfidence} language={language} />
      </section>

      {/* 감정 파형 그래프 */}
      <section className="glass-card rounded-[2.5rem] p-8 bg-white border-white/50 shadow-2xl shadow-slate-200/50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
            <TrendingUp size={24} className="text-blue-500" />
            {t.emotion.emotionWave}
          </h2>
          {language === "ko" && (
            <Badge variant="default" className="px-3">{t.emotion.waveGraph}</Badge>
          )}
        </div>
        <EmotionWaveGraph points={data.emotionWave.points} height={300} language={language} />
        {data.emotionWave.summary && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed">{data.emotionWave.summary}</p>
          </div>
        )}
      </section>

      {/* 행동 상관 히트맵 */}
      {data.behaviorCorrelations.length > 0 && (
        <section className="glass-card rounded-[2.5rem] p-8 bg-white border-white/50 shadow-2xl shadow-slate-200/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
              <Lightbulb size={24} className="text-amber-500" />
              {t.emotion.behaviorCorrelation}
            </h2>
            {language === "ko" && (
              <Badge variant="default" className="px-3">{t.emotion.correlation}</Badge>
            )}
          </div>
          <BehaviorHeatmap correlations={data.behaviorCorrelations} language={language} />
        </section>
      )}

      {/* 미래 리듬 예측 */}
      <section className="glass-card rounded-[2.5rem] p-8 bg-white border-white/50 shadow-2xl shadow-slate-200/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
            <TrendingUp size={24} className="text-purple-500" />
            {t.emotion.futureRhythm}
          </h2>
          {language === "ko" && (
            <Badge variant="default" className="px-3">{t.emotion.prediction}</Badge>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">
              {t.emotion.nextPhase}
            </h3>
            <p className="text-lg font-bold text-gray-900">{data.futureRhythm.nextPhase}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">
              {t.emotion.predictedEmotions}
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.futureRhythm.predictedEmotions.map((pred, idx) => (
                <Badge key={idx} variant="default" className="px-3 py-1">
                  {pred.emotion} ({Math.round(pred.probability * 100)}%)
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">
              {t.emotion.recommendation}
            </h3>
            <p className="text-base text-gray-700 leading-relaxed">{data.futureRhythm.recommendation}</p>
          </div>
        </div>
      </section>

      {/* 조언 피드백 */}
      <section className="glass-card rounded-[2.5rem] p-8 bg-white border-white/50 shadow-2xl shadow-slate-200/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
            <Lightbulb size={24} className="text-green-500" />
            {t.emotion.feedback}
          </h2>
          {language === "ko" && (
            <Badge variant="default" className="px-3">{t.emotion.feedbackLabel}</Badge>
          )}
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
              {t.emotion.insights}
            </h3>
            <ul className="space-y-2">
              {data.feedback.insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                  <p className="text-base text-gray-700 leading-relaxed">{insight}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
              {t.emotion.suggestions}
            </h3>
            <ul className="space-y-2">
              {data.feedback.suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <p className="text-base text-gray-700 leading-relaxed">{suggestion}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
              {t.emotion.growthDirection}
            </h3>
            <p className="text-base text-gray-700 leading-relaxed">{data.feedback.growthDirection}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
