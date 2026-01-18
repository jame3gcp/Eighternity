"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingRequest } from "../../../lib/contracts/user";
import { ArrowRight, Clock, Calendar, Info } from "lucide-react";

import { Chip } from "../../../components/Chip";
import { Sparkles } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<OnboardingRequest>({
    birthDate: "",
    birthTime: null,
    gender: "M",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/home");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 pt-12 pb-10 min-h-screen animate-enter">
      <div className="space-y-6">
        <div className="w-14 h-14 bg-primary rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-primary/30">
          <Sparkles size={28} />
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-slate-900 leading-[1.1] tracking-tighter">
            당신의 하루를<br />
            더 쉽게.
          </h1>
          <p className="text-slate-500 text-lg font-bold uppercase tracking-wide">Enter your birth info</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10 animate-enter delay-100">
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 flex items-center gap-2 uppercase tracking-[0.2em]">
              <Calendar size={14} />
              생년월일
            </label>
            <div className="relative group">
              <input
                required
                type="date"
                className="w-full p-6 bg-white border border-slate-100 rounded-[2rem] text-xl font-black text-slate-900 shadow-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 flex items-center gap-2 uppercase tracking-[0.2em]">
              <Clock size={14} />
              태어난 시간
            </label>
            <div className="flex flex-col gap-4">
              <input
                type="time"
                className="w-full p-6 bg-white border border-slate-100 rounded-[2rem] text-xl font-black text-slate-900 shadow-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none disabled:bg-slate-50 disabled:text-slate-200"
                disabled={formData.birthTime === null}
                value={formData.birthTime || ""}
                onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
              />
              <div className="flex gap-2">
                <Chip 
                  type="button"
                  active={formData.birthTime === null}
                  onClick={() => setFormData({ ...formData, birthTime: null })}
                  className="flex-grow rounded-[1.5rem] py-4"
                >
                  시간 모름
                </Chip>
                <Chip 
                  type="button"
                  active={formData.birthTime !== null}
                  onClick={() => setFormData({ ...formData, birthTime: "12:00" })}
                  className="flex-grow rounded-[1.5rem] py-4"
                >
                  시간 선택
                </Chip>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full p-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-500/40 active:scale-[0.98] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-3">
              {isLoading ? (
                <span className="animate-pulse">Analyzing...</span>
              ) : (
                <>
                  <span>시작하기</span>
                  <ArrowRight size={24} className="transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </span>
          </button>
          <p className="text-center text-xs text-slate-400 font-bold leading-relaxed px-4">
            “결정은 당신의 몫, 우리는 방향만 제안해요”<br />
            개인정보는 분석 목적으로만 안전하게 사용됩니다.
          </p>
        </div>
      </form>
    </div>
  );
}
