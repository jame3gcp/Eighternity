"use client";

import { useEffect, useState } from "react";
import { ElementBarChart } from "../../components/ScoreRadar";
import { ProfileResponse } from "../../lib/contracts/user";
import { CheckCircle2, AlertCircle, UserCircle2 } from "lucide-react";

import { Skeleton } from "../../components/Skeleton";
import { Badge } from "../../components/Badge";
import { cn } from "../../lib/utils";
import { useLanguage } from "../../lib/i18n/LanguageContext";

export default function ProfilePage() {
  const { t, language } = useLanguage();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/profile?lang=${language}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.needsOnboarding) {
          window.location.href = "/onboarding";
          return;
        }
        setData(data);
      });
  }, [language]);

  if (!data) return (
    <div className="flex flex-col gap-10 pb-10 animate-enter">
      <header className="flex items-center gap-6">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-48" />
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{t.profile.title}</h1>
          {t.profile.subtitle && (
            <p className="text-sm text-slate-500 font-bold mt-1 uppercase tracking-wide">{t.profile.subtitle}</p>
          )}
        </div>
      </header>

      <section className="glass-card rounded-[2.5rem] p-8 bg-white border-white/50 shadow-2xl shadow-slate-200/50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            {t.profile.fiveElements}
          </h2>
          <Badge variant="default" className="px-3">{t.profile.analysis}</Badge>
        </div>
        <ElementBarChart elements={data.fiveElements} />
      </section>

      {data.pillars && (
        <section className="glass-card rounded-[2.5rem] p-8 bg-white border-white/50 shadow-2xl shadow-slate-200/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              {t.profile.sajuComposition}
            </h2>
            <Badge variant="default" className="px-3">{t.profile.pillars}</Badge>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 text-center p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.profile.yearPillar}</div>
              <div className="text-2xl font-black text-slate-900">{data.pillars.year}</div>
            </div>
            <div className="flex-1 text-center p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.profile.monthPillar}</div>
              <div className="text-2xl font-black text-slate-900">{data.pillars.month}</div>
            </div>
            <div className="flex-1 text-center p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.profile.dayPillar}</div>
              <div className="text-2xl font-black text-slate-900">{data.pillars.day}</div>
            </div>
            <div className="flex-1 text-center p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.profile.hourPillar}</div>
              <div className="text-2xl font-black text-slate-900">{data.pillars.hour === "未知" ? t.profile.unknown : data.pillars.hour}</div>
            </div>
          </div>
        </section>
      )}

      {data.tenGods && (
        <section className="glass-card rounded-[2.5rem] p-8 bg-white border-white/50 shadow-2xl shadow-slate-200/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              {t.profile.tenGods}
            </h2>
            <Badge variant="default" className="px-3">{t.profile.tenGodsLabel}</Badge>
          </div>
          <div className="flex flex-wrap gap-3">
            {(Object.entries(data.tenGods) as [string, number][])
              .filter(([_, count]) => count > 0)
              .sort(([_, a], [__, b]) => b - a)
              .map(([name, count]) => (
                <div
                  key={name}
                  className="flex-1 min-w-[80px] p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 hover:shadow-md transition-all"
                >
                  <div className="text-center">
                    <div className="text-lg font-black text-slate-900 mb-1">{name}</div>
                    <div className="text-2xl font-black text-primary">{count}</div>
                  </div>
                </div>
              ))}
          </div>
          {Object.values(data.tenGods).every((count) => count === 0) && (
            <div className="text-center py-8 text-slate-400">{t.profile.noTenGods}</div>
          )}
        </section>
      )}

      {/* 명리학 분석 섹션 */}
      <section className="glass-card rounded-[2.5rem] p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200/50 shadow-2xl shadow-indigo-200/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
            {t.profile.myeongriAnalysis}
          </h2>
          <Badge variant="default" className="px-3 bg-indigo-500">AI Analysis</Badge>
        </div>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed whitespace-pre-line">
          {t.profile.myeongriDescription}
        </p>
        <a
          href="/myeongri"
          className="block w-full px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold text-center hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-indigo-500/30"
        >
          {t.profile.viewAnalysis}
        </a>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            {t.profile.strengthsAndCautions}
          </h2>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {data.strengths.map((s: string, i: number) => (
            <div key={i} className="flex-1 min-w-[200px] group flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-2 bg-success/10 text-success rounded-xl shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-black text-success uppercase tracking-widest">{t.profile.strength}</span>
                <p className="text-sm font-bold text-slate-800 leading-snug">{s}</p>
              </div>
            </div>
          ))}
          {data.cautions.map((c: string, i: number) => (
            <div key={i} className="flex-1 min-w-[200px] group flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-2 bg-warning/10 text-warning rounded-xl shrink-0">
                <AlertCircle size={20} />
              </div>
              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-black text-warning uppercase tracking-widest">{t.profile.caution}</span>
                <p className="text-sm font-bold text-slate-800 leading-snug">{c}</p>
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
          {t.profile.resetData}
        </button>
      </div>
    </div>
  );
}
