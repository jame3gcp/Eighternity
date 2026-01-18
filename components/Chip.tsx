import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

function Chip({ className, active, children, ...props }: ChipProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200",
        active 
          ? "bg-gray-900 text-white" 
          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { Chip };
