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
