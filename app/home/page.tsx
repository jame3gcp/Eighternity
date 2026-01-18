"use client";

import { useEffect, useState } from "react";
import { CompassCard } from "../../components/CompassCard";
import { MetricCard } from "../../components/MetricCard";
import { DoDontCard } from "../../components/DoDontCard";
import { LifeLogForm } from "../../components/LifeLogForm";
import { HybridRecommendationResponse } from "../../lib/contracts/lifelog";
import { Briefcase, Heart, Coins, Activity, Info, Sparkles, CheckCircle, Edit3, X, MoreHorizontal, Share2 } from "lucide-react";

import { Skeleton } from "../../components/Skeleton";
import { ShareButton } from "../../components/ShareButton";

export default function HomePage() {
  const [data, setData] = useState<HybridRecommendationResponse | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [showLifeLogForm, setShowLifeLogForm] = useState(false);
  const [hasLifeLog, setHasLifeLog] = useState(false);

  const fetchHybridFortune = async () => {
    try {
      const res = await fetch("/api/fortune/hybrid?includeLifeLog=true");
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
  }, []);

  const handleLifeLogSuccess = () => {
    setShowLifeLogForm(false);
    fetchHybridFortune();
  };

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <Activity size={32} className="text-gray-400" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">연결이 고르지 않아요</h3>
        <p className="text-sm text-gray-500">잠시 후 다시 시도해주세요</p>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium text-sm hover:bg-gray-800 transition-colors"
      >
        다시 시도
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
              <h3 className="text-sm font-semibold text-gray-900">오늘의 상태 기록</h3>
              <p className="text-xs text-gray-500">더 정확한 추천을 위해 입력해주세요</p>
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
              <span className="text-sm font-semibold text-gray-900">오늘의 나침반</span>
              <span className="text-xs text-gray-500">·</span>
              <span className="text-xs text-gray-500">지금</span>
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
                <span className="text-xs text-indigo-600 font-medium">하이브리드 추천</span>
              )}
            </div>

            {/* 액션 버튼 */}
            <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Share2 size={18} />
                <span className="text-xs font-medium">공유</span>
              </button>
              <button 
                onClick={() => setShowLifeLogForm(!showLifeLogForm)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Edit3 size={18} />
                <span className="text-xs font-medium">{hasLifeLog ? "수정" : "입력"}</span>
              </button>
            </div>
          </div>
          <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors flex-shrink-0">
            <MoreHorizontal size={18} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* 도메인 점수 카드 */}
      <div className="thread-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">도메인 에너지</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MetricCard title="직업운" score={data.adjustedScores.work} icon={Briefcase} />
          <MetricCard title="애정운" score={data.adjustedScores.love} icon={Heart} />
          <MetricCard title="재물운" score={data.adjustedScores.money} icon={Coins} />
          <MetricCard title="건강운" score={data.adjustedScores.health} icon={Activity} />
        </div>
      </div>

      {/* 추천 가이드 카드 */}
      <div className="thread-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">오늘의 가이드</h3>
        </div>
        <DoDontCard recommend={data.hybridRecommendation.recommend} avoid={data.hybridRecommendation.avoid} />
        
        {data.hybridRecommendation.reasoning && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">추천 이유</p>
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
            <h3 className="text-sm font-semibold text-gray-900">오늘의 작은 루틴</h3>
            <p className="text-xs text-gray-500">5분 루틴</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          내면의 {data.adjustedScores.work > 60 ? "활기를 유지하기 위해" : "균형을 찾기 위해"} 오늘은 <span className="font-semibold text-gray-900">점심 식사 후 5분간 가벼운 스트레칭</span>을 해보세요.
        </p>
      </div>
    </div>
  );
}
