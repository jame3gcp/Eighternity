import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

function Chip({ className, active, children, ...props }: ChipProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-bold transition-all duration-300 ease-out overflow-hidden group",
        active 
          ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 text-white border-0 shadow-xl shadow-indigo-500/30 scale-[1.02]" 
          : "bg-white/80 backdrop-blur-sm text-slate-600 border border-slate-200/60 hover:border-indigo-300/60 hover:bg-gradient-to-br hover:from-indigo-50/50 hover:to-purple-50/50 hover:shadow-md hover:shadow-indigo-500/10 hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      {...props}
    >
      {active && (
        <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export { Chip };
