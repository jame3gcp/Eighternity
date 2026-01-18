import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DoDontCardProps {
  recommend: string;
  avoid: string;
  className?: string;
}

export const DoDontCard = ({ recommend, avoid, className }: DoDontCardProps) => {
  return (
    <div className={cn("grid grid-cols-1 gap-4", className)}>
      <div className="group p-5 bg-white border border-success/20 rounded-[2rem] shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-success/10 rounded-xl text-success">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-xs font-black text-success uppercase tracking-widest">Recommended Action</span>
        </div>
        <p className="text-slate-800 font-bold leading-relaxed">
          {recommend}
        </p>
      </div>

      <div className="group p-5 bg-white border border-warning/20 rounded-[2rem] shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-warning/10 rounded-xl text-warning">
            <AlertCircle size={18} />
          </div>
          <span className="text-xs font-black text-warning uppercase tracking-widest">Mindful Attention</span>
        </div>
        <p className="text-slate-800 font-bold leading-relaxed">
          {avoid}
        </p>
      </div>
    </div>
  );
};
