"use client";

import { useEffect, useState } from "react";
import { CompassCard } from "../../components/CompassCard";
import { MetricCard } from "../../components/MetricCard";
import { DoDontCard } from "../../components/DoDontCard";
import { LifeLogForm } from "../../components/LifeLogForm";
import { HybridRecommendationResponse } from "../../lib/contracts/lifelog";
import { Briefcase, Heart, Coins, Activity, Info, Sparkles, CheckCircle, Edit3, X } from "lucide-react";

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
    fetchHybridFortune(); // 데이터 새로고침
  };

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-enter">
      <div className="w-16 h-16 bg-warning/10 text-warning rounded-[2rem] flex items-center justify-center">
        <Activity size={32} />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">연결이 고르지 않아요</h3>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-wide">잠시 숨 고르고 다시 시도해요</p>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="px-8 py-4 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
      >
        Retry
      </button>
    </div>
  );

  if (!data) return (
    <div className="flex flex-col gap-10 pb-10">
      <header>
        <Skeleton className="h-9 w-40 mb-2" />
        <Skeleton className="h-4 w-24" />
      </header>
      <Skeleton className="h-[400px] w-full rounded-[2rem]" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-32 w-full rounded-[1.5rem]" />
        <Skeleton className="h-32 w-full rounded-[1.5rem]" />
        <Skeleton className="h-32 w-full rounded-[1.5rem]" />
        <Skeleton className="h-32 w-full rounded-[1.5rem]" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-10 pb-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">오늘의 나침반</h1>
          <p className="text-sm text-slate-500 font-bold mt-1 uppercase tracking-wide">Daily Compass Guide</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowLifeLogForm(!showLifeLogForm)}
            className={`px-4 py-2.5 rounded-2xl border-2 transition-all flex items-center gap-2 ${
              hasLifeLog
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-slate-300 bg-white text-slate-700 hover:border-primary/50"
            }`}
          >
            {showLifeLogForm ? (
              <>
                <X size={16} />
                <span className="text-xs font-black uppercase tracking-wide">닫기</span>
              </>
            ) : (
              <>
                <Edit3 size={16} />
                <span className="text-xs font-black uppercase tracking-wide">
                  {hasLifeLog ? "수정" : "입력"}
                </span>
              </>
            )}
          </button>
          <ShareButton 
            title="Eighternity - 오늘의 나침반" 
            text={data.hybridRecommendation.mainMessage} 
            className="px-4 py-2.5 rounded-2xl"
          />
        </div>
      </header>

      {/* 라이프 로그 입력 폼 */}
      {showLifeLogForm && (
        <section className="glass-card p-6 rounded-[2rem] border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5 animate-enter">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
              <Edit3 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">오늘의 상태 기록</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">더 정확한 추천을 위해 입력해주세요</p>
            </div>
          </div>
          <LifeLogForm onSuccess={handleLifeLogSuccess} onCancel={() => setShowLifeLogForm(false)} />
        </section>
      )}

      {/* 하이브리드 추천 배지 */}
      {data.lifeLogAnalysis.hasData && (
        <div className="glass-card p-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-slate-900">하이브리드 추천 활성화</p>
            <p className="text-xs text-slate-500">사주 + 실제 생활 데이터를 결합한 맞춤 추천입니다</p>
          </div>
        </div>
      )}

      <section className="animate-enter">
        <CompassCard 
          score={Math.round(
            (data.adjustedScores.work + 
             data.adjustedScores.love + 
             data.adjustedScores.money + 
             data.adjustedScores.health) / 4
          )} 
          message={data.hybridRecommendation.mainMessage} 
        />
      </section>

      <section>
        <div className="flex items-center justify-between px-1 mb-5">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Domain Energy</h3>
          <div className="h-[1px] flex-grow mx-4 bg-slate-100"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <MetricCard title="직업운" score={data.adjustedScores.work} icon={Briefcase} />
          <MetricCard title="애정운" score={data.adjustedScores.love} icon={Heart} />
          <MetricCard title="재물운" score={data.adjustedScores.money} icon={Coins} />
          <MetricCard title="건강운" score={data.adjustedScores.health} icon={Activity} />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between px-1 mb-5">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Guide & Focus</h3>
          <div className="h-[1px] flex-grow mx-4 bg-slate-100"></div>
        </div>
        <DoDontCard recommend={data.hybridRecommendation.recommend} avoid={data.hybridRecommendation.avoid} />
        
        {/* 추천 이유 표시 */}
        {data.hybridRecommendation.reasoning && (
          <div className="mt-4 glass-card p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
            <div className="flex items-start gap-3">
              <Info size={18} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-black text-slate-700 uppercase tracking-wide mb-1">추천 이유</p>
                <p className="text-sm text-slate-600 leading-relaxed">{data.hybridRecommendation.reasoning}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="glass-card p-8 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-[1.2rem] bg-white/80 text-primary flex items-center justify-center shadow-xl shadow-primary/10 border border-white backdrop-blur-sm">
            <CheckCircle size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 leading-none tracking-tight">오늘의 작은 루틴</h3>
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mt-1.5">5 Minute Routine</p>
          </div>
        </div>
        <p className="text-slate-700 text-base font-medium leading-[1.6] break-keep">
          내면의 {data.adjustedScores.work > 60 ? "활기를 유지하기 위해" : "균형을 찾기 위해"} 오늘은 <span className="text-primary font-black underline underline-offset-4 decoration-primary/30">점심 식사 후 5분간 가벼운 스트레칭</span>을 해보세요.
        </p>
      </section>
    </div>
  );
}
