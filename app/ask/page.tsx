"use client";

import { useState } from "react";
import { Chip } from "../../components/Chip";
import { ShareButton } from "../../components/ShareButton";
import { MessageSquareQuote, Sparkles, Send } from "lucide-react";

export default function AskPage() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: "LOVE", label: "애정운", icon: "❤️" },
    { id: "MONEY", label: "재물운", icon: "💰" },
    { id: "WORK", label: "직업운", icon: "💼" },
    { id: "HEALTH", label: "건강운", icon: "🌿" },
    { id: "MOVE", label: "이동수", icon: "✈️" },
  ];

  const handleSelect = async (category: any) => {
    setSelectedCategory(category);
    setIsAsking(true);
    setAnswer(null);
    try {
      const res = await fetch("/api/fortune/question", {
        method: "POST",
        body: JSON.stringify({ category }),
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 h-full min-h-[80vh] animate-enter">
      <header className="flex justify-between items-start pt-4">
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">무엇이든 물어보세요</h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wide leading-relaxed">
            고민이 있는 카테고리를 선택하면<br/>하늘의 방향을 제안해 드립니다.
          </p>
        </div>
      </header>

      <section className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Chip
            key={cat.id}
            active={selectedCategory === cat.id}
            onClick={() => handleSelect(cat.id)}
            className="rounded-[1.5rem] py-3"
          >
            <span className="mr-2">{cat.icon}</span>
            {cat.label}
          </Chip>
        ))}
      </section>

      <section className="flex-grow flex flex-col relative">
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center min-h-[400px]">
          {isAsking ? (
            <div className="flex flex-col items-center gap-8 animate-pulse">
              <div className="relative">
                <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center">
                  <Sparkles className="text-primary animate-spin" size={40} />
                </div>
                <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl animate-pulse"></div>
              </div>
              <p className="text-slate-400 text-sm font-black uppercase tracking-[0.2em]">방향을 읽는 중...</p>
            </div>
          ) : answer ? (
            <div className="relative animate-enter w-full max-w-sm mx-auto">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-primary text-white flex items-center justify-center rounded-[1.5rem] shadow-2xl shadow-primary/30 z-20">
                <MessageSquareQuote size={28} />
              </div>
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 pt-14 shadow-2xl shadow-slate-200/50">
                <p className="text-xl font-black text-slate-800 leading-[1.6] break-keep tracking-tight">
                  "{answer}"
                </p>
                <div className="mt-10 pt-6 border-t border-slate-50 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Heavenly Answer</span>
                  <div className="flex gap-1.5 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/20"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/20"></div>
                  </div>
                  <ShareButton 
                    title="Eighternity - 하늘의 답변" 
                    text={answer} 
                    className="px-4 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 opacity-40">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto border border-slate-100 shadow-inner">
                <Send size={40} className="text-slate-300 -rotate-12" />
              </div>
              <p className="text-slate-400 text-sm font-black uppercase tracking-[0.2em] leading-relaxed">
                위 카테고리를 선택하여<br />질문을 시작해보세요.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
