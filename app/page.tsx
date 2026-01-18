"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Sparkles } from "lucide-react";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const hasSaju = document.cookie.includes("user_saju");
    setTimeout(() => {
      if (hasSaju) {
        router.replace("/home");
      } else {
        router.replace("/onboarding");
      }
    }, 1000);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-6 animate-enter">
      <div className="w-20 h-20 bg-primary rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-primary/40 animate-bounce">
        <Sparkles size={40} />
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Eighternity</h1>
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Reading the Flow</p>
      </div>
    </div>
  );
}
