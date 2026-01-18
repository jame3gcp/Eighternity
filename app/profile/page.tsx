"use client";

import { useEffect, useState } from "react";
import { ElementBarChart } from "../../components/ScoreRadar";
import { ProfileResponse } from "../../lib/contracts/user";
import { CheckCircle2, AlertCircle, UserCircle2 } from "lucide-react";

import { Skeleton } from "../../components/Skeleton";
import { Badge } from "../../components/Badge";
import { cn } from "../../lib/utils";

export default function ProfilePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.needsOnboarding) {
          window.location.href = "/onboarding";
          return;
        }
        setData(data);
      });
  }, []);

  if (!data) return (
    <div className="flex flex-col gap-10 pb-10 animate-enter">
      <header className="flex items-center gap-6">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </header>
      <Skeleton className="h-64 w-full rounded-[2rem]" />
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-12 pb-10 animate-enter">
      <header className="flex items-center gap-6 pt-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-indigo-400 p-[3px] shadow-xl shadow-primary/20">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-primary overflow-hidden">
             <UserCircle2 size={48} strokeWidth={1.5} />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">나의 에너지 균형</h1>
          <p className="text-sm text-slate-500 font-bold mt-1 uppercase tracking-wide">Inner Energy Balance</p>
        </div>
      </header>

      <section className="glass-card rounded-[2.5rem] p-8 bg-white border-white/50 shadow-2xl shadow-slate-200/50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            오행 분포도
          </h2>
          <Badge variant="default" className="px-3">Analysis</Badge>
        </div>
        <ElementBarChart elements={data.fiveElements} />
      </section>

      {data.pillars && (
        <section className="glass-card rounded-[2.5rem] p-8 bg-white border-white/50 shadow-2xl shadow-slate-200/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              사주 구성
            </h2>
            <Badge variant="default" className="px-3">Pillars</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">연주</div>
              <div className="text-2xl font-black text-slate-900">{data.pillars.year}</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">월주</div>
              <div className="text-2xl font-black text-slate-900">{data.pillars.month}</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">일주</div>
              <div className="text-2xl font-black text-slate-900">{data.pillars.day}</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">시주</div>
              <div className="text-2xl font-black text-slate-900">{data.pillars.hour === "未知" ? "미상" : data.pillars.hour}</div>
            </div>
          </div>
        </section>
      )}

      {data.tenGods && (
        <section className="glass-card rounded-[2.5rem] p-8 bg-white border-white/50 shadow-2xl shadow-slate-200/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              십성(十神) 분포
            </h2>
            <Badge variant="default" className="px-3">Ten Gods</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {(Object.entries(data.tenGods) as [string, number][])
              .filter(([_, count]) => count > 0)
              .sort(([_, a], [__, b]) => b - a)
              .map(([name, count]) => (
                <div
                  key={name}
                  className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 hover:shadow-md transition-all"
                >
                  <div className="text-center">
                    <div className="text-lg font-black text-slate-900 mb-1">{name}</div>
                    <div className="text-2xl font-black text-primary">{count}</div>
                  </div>
                </div>
              ))}
          </div>
          {Object.values(data.tenGods).every((count) => count === 0) && (
            <div className="text-center py-8 text-slate-400">십성 정보가 없습니다</div>
          )}
        </section>
      )}

      {/* 명리학 분석 섹션 */}
      <section className="glass-card rounded-[2.5rem] p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200/50 shadow-2xl shadow-indigo-200/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
            명리학 종합 분석
          </h2>
          <Badge variant="default" className="px-3 bg-indigo-500">AI Analysis</Badge>
        </div>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          사주, 오행, 십성, 형충회합, 대운·세운을 종합적으로 분석하여<br />
          성격, 직업, 재물, 건강, 인연에 대한 깊이 있는 해석을 제공합니다.
        </p>
        <a
          href="/myeongri"
          className="block w-full px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold text-center hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-indigo-500/30"
        >
          명리학 분석 보기
        </a>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            성향 및 주의
          </h2>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {data.strengths.map((s: string, i: number) => (
            <div key={i} className="group flex items-start gap-5 p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-3 bg-success/10 text-success rounded-2xl shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-success uppercase tracking-widest">Strength</span>
                <p className="text-base font-bold text-slate-800 leading-snug">{s}</p>
              </div>
            </div>
          ))}
          {data.cautions.map((c: string, i: number) => (
            <div key={i} className="group flex items-start gap-5 p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-3 bg-warning/10 text-warning rounded-2xl shrink-0">
                <AlertCircle size={24} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-warning uppercase tracking-widest">Caution</span>
                <p className="text-base font-bold text-slate-800 leading-snug">{c}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center pt-6">
        <button
          onClick={() => {
            document.cookie = "user_saju=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            window.location.href = "/onboarding";
          }}
          className="px-6 py-3 rounded-2xl bg-slate-50 text-slate-400 text-sm font-bold hover:bg-slate-100 hover:text-slate-600 transition-all border border-slate-100 uppercase tracking-widest"
        >
          Reset Data
        </button>
      </div>
    </div>
  );
}
