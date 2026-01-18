import { QuestionCategory } from "../lib/contracts/fortune";
import { Users, Heart, Coins, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export const CategoryButtons = ({ onSelect }: { onSelect: (id: QuestionCategory) => void }) => {
  const { t } = useLanguage();
  
  const categories: { id: QuestionCategory; label: string; icon: any; color: string }[] = [
    { id: "meeting", label: t.ask.categories.meeting, icon: Users, color: "text-blue-500 bg-blue-50" },
    { id: "love", label: t.ask.categories.love, icon: Heart, color: "text-rose-500 bg-rose-50" },
    { id: "money", label: t.ask.categories.money, icon: Coins, color: "text-amber-500 bg-amber-50" },
    { id: "contact", label: t.ask.categories.contact, icon: Phone, color: "text-green-500 bg-green-50" },
    { id: "move", label: t.ask.categories.move, icon: MapPin, color: "text-purple-500 bg-purple-50" },
  ];
  return (
    <div className="grid grid-cols-5 gap-3 px-2">
      {categories.map((cat, i) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className="group relative flex flex-col items-center gap-2.5 animate-enter"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="relative p-4.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-md shadow-slate-200/50 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:shadow-indigo-500/20 group-active:scale-95 group-active:translate-y-0 overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <cat.icon size={22} className={`relative z-10 ${cat.color.split(" ")[0]} transition-transform duration-300 group-hover:scale-110`} />
          </div>
          <span className="text-[11px] font-bold text-slate-600 group-hover:text-indigo-600 transition-colors duration-300 tracking-wide">
            {cat.label}
          </span>
        </button>
      ))}
    </div>
  );
};
