import { CalendarFortuneResponse } from "../lib/contracts/fortune";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

import { Badge } from "./Badge";
import { cn } from "../lib/utils";

export const CalendarList = ({ items = [] }: { items?: CalendarFortuneResponse["items"] }) => {
  return (
    <div className="space-y-4 pb-8">
      {items && items.length > 0 ? (
        items.map((item, index) => {
          const config = {
            good: { variant: "success" as const, label: "Good", bg: "bg-white border-success/20" },
            normal: { variant: "default" as const, label: "Normal", bg: "bg-white border-slate-100" },
            bad: { variant: "warning" as const, label: "Focus", bg: "bg-white border-warning/20" },
          }[item.level] || { variant: "default" as const, label: "Normal", bg: "bg-white border-slate-100" };

          const dateObj = parseISO(item.date);

          return (
            <div 
              key={item.date} 
              className={cn(
                "flex items-center justify-between p-6 rounded-[2rem] border shadow-sm transition-all hover:shadow-md animate-enter",
                config.bg
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-5">
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100">
                   <span className="text-xl font-black text-slate-900 leading-none">
                    {format(dateObj, "dd")}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">
                    {format(dateObj, "EEE", { locale: ko })}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-800">
                    {format(dateObj, "MMMM d일", { locale: ko })}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                    Daily Flow Guide
                  </span>
                </div>
              </div>
              
              <Badge variant={config.variant} className="px-4 py-1.5 rounded-xl">
                {config.label}
              </Badge>
            </div>
          );
        })
      ) : (
        <div className="text-center py-20 opacity-40">
          <p className="text-sm font-black uppercase tracking-widest">분석된 데이터가 없습니다</p>
        </div>
      )}
    </div>
  );
};
