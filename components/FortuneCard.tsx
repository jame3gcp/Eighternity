import { TodayFortuneResponse } from "../lib/contracts/fortune";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const FortuneCard = ({ data }: { data: TodayFortuneResponse }) => {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-8 text-white shadow-2xl shadow-indigo-200/50 animate-enter transition-transform duration-300 active:scale-[0.98]">
      {/* Abstract Background Shapes */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center gap-2 mb-6">
        <h2 className="text-indigo-100 text-sm font-semibold tracking-wide uppercase opacity-90">오늘의 운세 점수</h2>
        <div className="relative">
          <span className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-100 drop-shadow-sm">
            {data.globalScore}
          </span>
          <div className="absolute -right-4 top-2 text-indigo-200">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
        <p className="text-white/90 text-[15px] leading-relaxed font-medium text-center text-balance">
          {data.mainMessage}
        </p>
      </div>
    </div>
  );
};

export const ScoreCard = ({ title, score, icon: Icon }: { title: string, score: number, icon: any }) => {
  const getTrendIcon = (score: number) => {
    if (score >= 70) return <TrendingUp size={16} className="text-emerald-500" />;
    if (score <= 40) return <TrendingDown size={16} className="text-rose-500" />;
    return <Minus size={16} className="text-slate-400" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-600 bg-emerald-50";
    if (score <= 40) return "text-rose-600 bg-rose-50";
    return "text-slate-600 bg-slate-50";
  };

  return (
    <div className="glass-card rounded-2xl p-4 flex items-center justify-between transition-all duration-300 hover:shadow-md animate-enter">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-sm border border-slate-100`}>
          <Icon className="text-indigo-500" size={20} />
        </div>
        <span className="font-semibold text-slate-700">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 ${getScoreColor(score)}`}>
          <span>{score}</span>
          {getTrendIcon(score)}
        </div>
      </div>
    </div>
  );
};
