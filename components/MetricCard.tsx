import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  score: number;
  icon: LucideIcon;
  className?: string;
}

export const MetricCard = ({ title, score, icon: Icon, className }: MetricCardProps) => {
  const getScoreStyles = (score: number) => {
    if (score >= 70) return "text-success bg-success/10 border-success/20";
    if (score >= 40) return "text-primary bg-primary/10 border-primary/20";
    return "text-warning bg-warning/10 border-warning/20";
  };

  const styles = getScoreStyles(score);

  return (
    <div className={cn(
      "glass-card p-6 flex flex-col gap-4 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] border-white/60",
      className
    )}>
      <div className="flex justify-between items-start">
        <div className="p-3.5 rounded-[1.2rem] bg-white/80 border border-white/40 text-slate-400 shadow-sm backdrop-blur-sm">
          <Icon size={24} strokeWidth={1.5} className="text-primary/60" />
        </div>
        <div className={cn("px-3 py-1 rounded-full text-xs font-black border backdrop-blur-md", styles)}>
          {score}
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">{title}</h4>
        <div className="w-full h-2 bg-slate-100/50 rounded-full overflow-hidden p-[1px] border border-slate-200/30">
          <div 
            className={cn("h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.1)]", 
              score >= 70 ? "bg-success" : score >= 40 ? "bg-primary" : "bg-warning"
            )}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
};
