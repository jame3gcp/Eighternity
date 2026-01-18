import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DoDontCardProps {
  recommend: string;
  avoid: string;
  className?: string;
}

export const DoDontCard = ({ recommend, avoid, className }: DoDontCardProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 size={16} className="text-green-600" />
          <span className="text-xs font-semibold text-green-700">추천</span>
        </div>
        <p className="text-sm text-gray-900 leading-relaxed">
          {recommend}
        </p>
      </div>

      <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle size={16} className="text-orange-600" />
          <span className="text-xs font-semibold text-orange-700">주의</span>
        </div>
        <p className="text-sm text-gray-900 leading-relaxed">
          {avoid}
        </p>
      </div>
    </div>
  );
};
