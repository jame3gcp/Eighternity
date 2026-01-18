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
      "bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 transition-colors hover:bg-gray-50",
      className
    )}>
      <div className="flex justify-between items-center">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
          <Icon size={20} className="text-gray-600" />
        </div>
        <div className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", 
          score >= 70 ? "bg-green-100 text-green-700" : 
          score >= 40 ? "bg-blue-100 text-blue-700" : 
          "bg-orange-100 text-orange-700"
        )}>
          {score}
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-900">{title}</h4>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-1000 ease-out", 
              score >= 70 ? "bg-green-500" : 
              score >= 40 ? "bg-blue-500" : 
              "bg-orange-500"
            )}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
};
