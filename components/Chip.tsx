import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

function Chip({ className, active, children, ...props }: ChipProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-bold transition-all border",
        active 
          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.05]" 
          : "bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:bg-slate-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { Chip };
