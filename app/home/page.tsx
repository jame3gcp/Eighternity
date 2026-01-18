"use client";

import { useEffect, useState } from "react";
import { CompassCard } from "../../components/CompassCard";
import { MetricCard } from "../../components/MetricCard";
import { DoDontCard } from "../../components/DoDontCard";
import { LifeLogForm } from "../../components/LifeLogForm";
import { HybridRecommendationResponse } from "../../lib/contracts/lifelog";
import { Briefcase, Heart, Coins, Activity, Info, Sparkles, CheckCircle, Edit3, X, Share2, Check } from "lucide-react";

import { Skeleton } from "../../components/Skeleton";
import { ShareButton } from "../../components/ShareButton";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { cn } from "../../lib/utils";

export default function HomePage() {
  const { t, language } = useLanguage();
  const [data, setData] = useState<HybridRecommendationResponse | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [showLifeLogForm, setShowLifeLogForm] = useState(false);
  const [hasLifeLog, setHasLifeLog] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const fetchHybridFortune = async () => {
    try {
      const res = await fetch(`/api/fortune/hybrid?includeLifeLog=true&lang=${language}`);
      if (res.status === 401) {
        window.location.href = "/onboarding";
        return;
      }
      if (!res.ok) throw new Error();
      const fortuneData = await res.json();
      setData(fortuneData);
      setHasLifeLog(fortuneData.lifeLogAnalysis.hasData);
    } catch (err) {
      setError(true);
    }
  };

  useEffect(() => {
    fetchHybridFortune();
  }, [language]);

  const handleLifeLogSuccess = () => {
    setShowLifeLogForm(false);
    fetchHybridFortune();
  };

  // 공유 기능
  const handleShare = async () => {
    if (!data) return;

    const shareText = language === "ko" 
      ? `오늘의 나침반\n${data.hybridRecommendation.mainMessage}\n\n도메인 에너지:\n직업운: ${data.adjustedScores.work}점\n애정운: ${data.adjustedScores.love}점\n재물운: ${data.adjustedScores.money}점\n건강운: ${data.adjustedScores.health}점`
      : `Today's Compass\n${data.hybridRecommendation.mainMessage}\n\nDomain Energy:\nCareer: ${data.adjustedScores.work}pts\nLove: ${data.adjustedScores.love}pts\nWealth: ${data.adjustedScores.money}pts\nHealth: ${data.adjustedScores.health}pts`;

    const shareData = {
      title: language === "ko" ? "오늘의 나침반" : "Today's Compass",
      text: shareText,
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // 사용자가 공유를 취소한 경우는 에러로 처리하지 않음
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      // Web Share API를 지원하지 않는 경우 클립보드에 복사
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      } catch (err) {
        console.error("Error copying to clipboard:", err);
      }
    }
  };


  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <Activity size={32} className="text-gray-400" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{t.common.connectionError}</h3>
        <p className="text-sm text-gray-500">{t.common.connectionRetry}</p>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium text-sm hover:bg-gray-800 transition-colors"
      >
        {t.common.retry}
      </button>
    </div>
  );

  if (!data) return (
    <div className="flex flex-col gap-4 pb-10">
      <div className="px-4 py-3">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="px-4">
        <Skeleton className="h-[300px] w-full rounded-2xl" />
      </div>
      <div className="grid grid-cols-2 gap-3 px-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* 라이프 로그 입력 폼 - 스레드 스타일 */}
      {showLifeLogForm && (
        <div className="thread-card border-b-2 border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Edit3 size={18} className="text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">{t.home.stateRecord}</h3>
              <p className="text-xs text-gray-500">{t.home.accurateRecommendation}</p>
            </div>
            <button
              onClick={() => setShowLifeLogForm(false)}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
          <LifeLogForm onSuccess={handleLifeLogSuccess} onCancel={() => setShowLifeLogForm(false)} />
        </div>
      )}

      {/* 메인 추천 카드 - 스레드 스타일 */}
      <div className="thread-card">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            <Sparkles size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-900">{t.home.title}</span>
              <span className="text-xs text-gray-500">·</span>
              <span className="text-xs text-gray-500">{t.common.now}</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">{data.hybridRecommendation.mainMessage}</p>
            
            {/* 점수 표시 */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-medium text-gray-700">
                  {Math.round((data.adjustedScores.work + data.adjustedScores.love + data.adjustedScores.money + data.adjustedScores.health) / 4)}점
                </span>
              </div>
              {data.lifeLogAnalysis.hasData && (
                <span className="text-xs text-indigo-600 font-medium">{t.home.hybridRecommendation}</span>
              )}
            </div>

            {/* 액션 버튼 */}
            <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {shareCopied ? (
                  <>
                    <Check size={18} className="text-green-600" />
                    <span className="text-xs font-medium text-green-600">{t.share.copied}</span>
                  </>
                ) : (
                  <>
                    <Share2 size={18} />
                    <span className="text-xs font-medium">{t.common.share}</span>
                  </>
                )}
              </button>
              <button 
                onClick={() => setShowLifeLogForm(!showLifeLogForm)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Edit3 size={18} />
                <span className="text-xs font-medium">{hasLifeLog ? t.common.edit : t.common.input}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 도메인 점수 카드 */}
      <div className="thread-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">{t.home.domainEnergy}</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MetricCard title={t.home.work} score={data.adjustedScores.work} icon={Briefcase} />
          <MetricCard title={t.home.love} score={data.adjustedScores.love} icon={Heart} />
          <MetricCard title={t.home.money} score={data.adjustedScores.money} icon={Coins} />
          <MetricCard title={t.home.health} score={data.adjustedScores.health} icon={Activity} />
        </div>
      </div>

      {/* 추천 가이드 카드 */}
      <div className="thread-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">{t.home.todayGuide}</h3>
        </div>
        <DoDontCard recommend={data.hybridRecommendation.recommend} avoid={data.hybridRecommendation.avoid} />
        
        {data.hybridRecommendation.reasoning && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">{t.home.recommendReason}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{data.hybridRecommendation.reasoning}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 루틴 카드 */}
      <div className="thread-card">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <CheckCircle size={18} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t.home.todayRoutine}</h3>
            <p className="text-xs text-gray-500">{t.home.fiveMinRoutine}</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          {language === "ko" ? (
            <>
              내면의 {data.adjustedScores.work > 60 ? t.home.vitalityMaintain : t.home.vitalityBalance} 오늘은 <span className="font-semibold text-gray-900">{t.home.routineStretch}</span>을 해보세요.
            </>
          ) : (
            <>
              To {data.adjustedScores.work > 60 ? t.home.vitalityMaintain : t.home.vitalityBalance} your inner self, today try <span className="font-semibold text-gray-900">{t.home.routineStretch}</span>.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
