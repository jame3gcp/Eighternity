import { QuestionCategory } from "../lib/contracts/fortune";
import { Users, Heart, Coins, Phone, MapPin } from "lucide-react";

const categories: { id: QuestionCategory; label: string; icon: any; color: string }[] = [
  { id: "meeting", label: "만남", icon: Users, color: "text-blue-500 bg-blue-50" },
  { id: "love", label: "연애", icon: Heart, color: "text-rose-500 bg-rose-50" },
  { id: "money", label: "재물", icon: Coins, color: "text-amber-500 bg-amber-50" },
  { id: "contact", label: "연락", icon: Phone, color: "text-green-500 bg-green-50" },
  { id: "move", label: "이동", icon: MapPin, color: "text-purple-500 bg-purple-50" },
];

export const CategoryButtons = ({ onSelect }: { onSelect: (id: QuestionCategory) => void }) => {
  return (
    <div className="grid grid-cols-5 gap-3 px-2">
      {categories.map((cat, i) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className="group flex flex-col items-center gap-2 animate-enter"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className={`p-4 rounded-2xl shadow-sm border border-slate-100 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md group-active:scale-95 bg-white`}>
            <cat.icon size={22} className={cat.color.split(" ")[0]} />
          </div>
          <span className="text-[11px] font-semibold text-slate-500 group-hover:text-slate-800 transition-colors">
            {cat.label}
          </span>
        </button>
      ))}
    </div>
  );
};
