"use client";

import { useState } from "react";
import { Chip } from "../../components/Chip";
import { ShareButton } from "../../components/ShareButton";
import { MessageSquareQuote, Sparkles, Send, Lightbulb, Target, ArrowRight } from "lucide-react";
import { QuestionCategory, QuestionAnswer } from "@/lib/contracts/question";
import { questionTemplates } from "@/lib/ai/prompts/question";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// 카테고리 매핑 (프론트엔드 -> API)
const categoryMapping: Record<string, QuestionCategory> = {
  LOVE: "love",
  MONEY: "money",
  WORK: "work",
  HEALTH: "health",
  MOVE: "move",
  MEETING: "meeting",
  CONTACT: "contact",
};

export default function AskPage() {
  const { t, language } = useLanguage();
  const [answer, setAnswer] = useState<QuestionAnswer | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const categories = [
    { id: "LOVE", label: t.ask.categories.love, icon: "❤️" },
    { id: "MONEY", label: t.ask.categories.money, icon: "💰" },
    { id: "WORK", label: t.ask.categories.work, icon: "💼" },
    { id: "HEALTH", label: t.ask.categories.health, icon: "🌿" },
    { id: "MOVE", label: t.ask.categories.move, icon: "✈️" },
    { id: "MEETING", label: t.ask.categories.meeting, icon: "👥" },
    { id: "CONTACT", label: t.ask.categories.contact, icon: "📞" },
  ];

  // 선택된 카테고리의 템플릿 가져오기
  const getTemplatesForCategory = (categoryId: string | null) => {
    if (!categoryId) return [];
    const apiCategory = categoryMapping[categoryId];
    if (!apiCategory) return [];
    return questionTemplates
      .filter(t => t.category === apiCategory)
      .map(template => ({
        ...template,
        question: t.ask.templates[template.id as keyof typeof t.ask.templates] || template.question,
      }));
  };

  const templates = getTemplatesForCategory(selectedCategory);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedTemplate(null);
    setAnswer(null);
  };

  const handleTemplateSelect = async (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsAsking(true);
    setAnswer(null);
    
    try {
      const res = await fetch("/api/fortune/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId,
          category: selectedCategory ? categoryMapping[selectedCategory] : undefined,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || t.ask.errorMessage);
      }
      
      const data = await res.json();
      setAnswer(data.answer);
    } catch (error: any) {
      console.error("질문 답변 오류:", error);
      alert(`${t.ask.error}: ${error.message || t.ask.errorMessage}`);
    } finally {
      setIsAsking(false);
    }
  };

  const handleCategoryOnlySelect = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedTemplate(null);
    setIsAsking(true);
    setAnswer(null);
    
    try {
      const res = await fetch("/api/fortune/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: categoryMapping[categoryId],
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || t.ask.errorMessage);
      }
      
      const data = await res.json();
      setAnswer(data.answer);
    } catch (error: any) {
      console.error("질문 답변 오류:", error);
      alert(`${t.ask.error}: ${error.message || t.ask.errorMessage}`);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full min-h-[80vh] animate-enter px-4 pb-10">
      <header className="flex justify-between items-start pt-4">
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{t.ask.title}</h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wide leading-relaxed whitespace-pre-line">
            {t.ask.subtitle}
          </p>
        </div>
      </header>

      {/* 카테고리 선택 */}
      <section className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Chip
            key={cat.id}
            active={selectedCategory === cat.id}
            onClick={() => handleCategorySelect(cat.id)}
            className="rounded-[1.5rem] py-3"
          >
            <span className="mr-2">{cat.icon}</span>
            {cat.label}
          </Chip>
        ))}
      </section>

      {/* 질문 템플릿 (카테고리 선택 시 표시) */}
      {selectedCategory && templates.length > 0 && !answer && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
            {t.ask.selectQuestion}
          </h2>
          <div className="flex flex-wrap gap-2">
            {templates.map((template) => (
              <Chip
                key={template.id}
                active={selectedTemplate === template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className="rounded-xl py-2.5 px-4 text-sm"
                disabled={isAsking}
              >
                <span className="mr-2">{template.icon || "💭"}</span>
                {template.question}
              </Chip>
            ))}
            <Chip
              active={false}
              onClick={() => handleCategoryOnlySelect(selectedCategory)}
              className="rounded-xl py-2.5 px-4 text-sm border-2 border-dashed"
              disabled={isAsking}
            >
              <span className="mr-2">✨</span>
              {t.ask.generalQuestion.replace("{category}", t.ask.categories[categoryMapping[selectedCategory] as keyof typeof t.ask.categories])}
            </Chip>
          </div>
        </section>
      )}

      {/* 답변 표시 영역 */}
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
              <p className="text-slate-400 text-sm font-black uppercase tracking-[0.2em]">{t.ask.reading}</p>
            </div>
          ) : answer ? (
            <div className="relative animate-enter w-full max-w-lg mx-auto space-y-6">
              {/* 요약 카드 */}
              <div className="relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-indigo-500 text-white flex items-center justify-center rounded-[1.5rem] shadow-2xl shadow-indigo-500/30 z-20">
                  <MessageSquareQuote size={28} />
                </div>
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 pt-14 shadow-2xl shadow-slate-200/50">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-xs font-bold text-indigo-500 uppercase tracking-[0.2em]">
                        {t.ask.categories[answer.category]}
                      </span>
                      {answer.confidence && (
                        <span className="text-xs text-slate-400">
                          {t.ask.confidence} {answer.confidence}%
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-black text-slate-800 leading-[1.6] break-keep tracking-tight">
                      "{answer.summary}"
                    </p>
                  </div>
                </div>
              </div>

              {/* 이유 카드 */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="text-indigo-600" size={20} />
                  </div>
                  <div className="flex-1 text-left space-y-2">
                    <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wide">
                      {t.ask.reasoning}
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {answer.reasoning}
                    </p>
                  </div>
                </div>
              </div>

              {/* 액션 플랜 카드 */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="text-emerald-600" size={20} />
                  </div>
                  <div className="flex-1 text-left space-y-2">
                    <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wide">
                      {t.ask.actionPlan}
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {answer.actionPlan}
                    </p>
                  </div>
                </div>
              </div>

              {/* 공유 버튼 */}
              <div className="pt-4">
                <ShareButton 
                  title={t.ask.shareTitle} 
                  text={t.ask.shareText
                    .replace("{summary}", answer.summary)
                    .replace("{reasoning}", answer.reasoning)
                    .replace("{actionPlan}", answer.actionPlan)}
                  className="px-6 py-3 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                />
              </div>

              {/* 다시 질문하기 버튼 */}
              <button
                onClick={() => {
                  setAnswer(null);
                  setSelectedTemplate(null);
                }}
                className="mt-4 text-sm text-slate-500 hover:text-slate-700 flex items-center gap-2 transition-colors"
              >
                <ArrowRight size={16} className="rotate-180" />
                {t.ask.askAgain}
              </button>
            </div>
          ) : (
            <div className="space-y-8 opacity-40">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto border border-slate-100 shadow-inner">
                <Send size={40} className="text-slate-300 -rotate-12" />
              </div>
              <p className="text-slate-400 text-sm font-black uppercase tracking-[0.2em] leading-relaxed">
                {selectedCategory 
                  ? t.ask.selectTemplateOrCategory
                  : t.ask.selectCategory}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
