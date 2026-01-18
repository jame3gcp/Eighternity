import { Compass } from "lucide-react";
import { cn } from "../lib/utils";

interface CompassCardProps {
  score: number;
  message: string;
  className?: string;
}

export const CompassCard = ({ score, message, className }: CompassCardProps) => {
  const getStatus = (score: number) => {
    if (score >= 70) return { label: "Excellent Energy", color: "text-success bg-success/10 border-success/20", glow: "from-success/30" };
    if (score >= 40) return { label: "Steady Flow", color: "text-primary bg-primary/10 border-primary/20", glow: "from-primary/30" };
    return { label: "Mindful Day", color: "text-warning bg-warning/10 border-warning/20", glow: "from-warning/30" };
  };

  const status = getStatus(score);

  return (
    <div className={cn(
      "relative overflow-hidden rounded-[3rem] bg-white/40 p-10 border border-white/60 shadow-2xl shadow-indigo-100/20 animate-enter backdrop-blur-3xl",
      className
    )}>
      <div className={cn("absolute -top-32 -right-32 h-80 w-80 rounded-full bg-gradient-to-br blur-[100px] opacity-40 pointer-events-none", status.glow)}></div>
      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-gradient-to-tr from-purple-500/20 blur-[100px] opacity-30 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center gap-6">
        <div className={cn("px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border backdrop-blur-md", status.color)}>
          {status.label}
        </div>
        
        <div className="relative flex items-center justify-center py-4">
          <span className="text-[120px] font-black tracking-tighter text-slate-900 leading-none drop-shadow-2xl">
            {score}
          </span>
          <div className="absolute -right-12 top-0 text-primary/30 animate-float">
            <Compass size={48} strokeWidth={1.5} />
          </div>
        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent my-2"></div>

        <div className="p-2">
          <p className="text-slate-800 text-2xl leading-[1.4] font-black text-balance tracking-tight">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
