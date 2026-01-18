"use client";

import { useEffect, useState } from "react";
import { CalendarFortuneResponse, CalendarFortuneItem } from "../../lib/contracts/fortune";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "../../components/Skeleton";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, startOfWeek, endOfWeek } from "date-fns";
import { ko, enUS } from "date-fns/locale";
import { cn } from "../../lib/utils";

export default function CalendarPage() {
  const { t, language } = useLanguage();
  const [data, setData] = useState<CalendarFortuneResponse | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetch(`/api/fortune/calendar?lang=${language}`)
      .then((res) => {
        if (res.status === 401) {
          window.location.href = "/onboarding";
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setData(data);
      });
  }, [language]);

  // 날짜별 운세 맵 생성
  const fortuneMap = new Map<string, CalendarFortuneItem>();
  if (data) {
    data.items.forEach(item => {
      fortuneMap.set(item.date, item);
    });
  }

  // 현재 월의 시작일과 종료일
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // 달력 그리드를 위한 주의 시작일과 종료일 (일요일부터 토요일까지)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // 일요일 시작
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 }); // 토요일 종료
  
  // 달력에 표시할 모든 날짜 생성
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getFortuneLevel = (date: Date): "good" | "normal" | "bad" | null => {
    const dateStr = format(date, "yyyy-MM-dd");
    return fortuneMap.get(dateStr)?.level || null;
  };

  const getLevelColor = (level: "good" | "normal" | "bad" | null) => {
    if (!level) return "bg-white text-slate-400";
    switch (level) {
      case "good":
        return "bg-white text-green-600";
      case "normal":
        return "bg-white text-indigo-600";
      case "bad":
        return "bg-white text-amber-600";
      default:
        return "bg-white text-slate-400";
    }
  };

  const getLevelBadgeColor = (level: "good" | "normal" | "bad" | null) => {
    if (!level) return "text-slate-400";
    switch (level) {
      case "good":
        return "text-green-600";
      case "normal":
        return "text-indigo-600";
      case "bad":
        return "text-amber-600";
      default:
        return "text-slate-400";
    }
  };

  const getLevelBadge = (level: "good" | "normal" | "bad" | null) => {
    if (!level) return "";
    switch (level) {
      case "good":
        return "✓";
      case "normal":
        return "○";
      case "bad":
        return "!";
      default:
        return "";
    }
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  if (!data) return (
    <div className="flex flex-col gap-10 pb-10 animate-enter">
      <header className="space-y-3 pt-4">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-32" />
      </header>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-16 rounded-2xl" />
        <Skeleton className="h-10 w-16 rounded-2xl" />
        <Skeleton className="h-10 w-16 rounded-2xl" />
      </div>
      <Skeleton className="h-96 w-full rounded-2xl" />
    </div>
  );

  return (
    <div className="flex flex-col gap-8 pb-10 animate-enter px-4">
      <header className="space-y-3 pt-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{t.calendar.title}</h1>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-wide">{t.calendar.subtitle}</p>
      </header>

      {/* 월 네비게이션 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700 transition-colors"
          >
            {t.calendar.today}
          </button>
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </div>
        <h2 className="text-xl font-black text-slate-900">
          {format(currentDate, language === "ko" ? "yyyy년 M월" : "MMMM yyyy", {
            locale: language === "ko" ? ko : enUS,
          })}
        </h2>
        <div className="w-24"></div> {/* 공간 맞추기 */}
      </div>

      {/* 달력 그리드 */}
      <section className="glass-card rounded-[2.5rem] p-6 bg-white border-white/50 shadow-2xl shadow-slate-200/50 overflow-hidden">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', borderBottom: '2px solid #e2e8f0' }}>
          {t.calendar.weekdays.map((day, index) => (
            <div
              key={index}
              className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest py-3"
              style={{
                borderRight: index !== 6 ? '1px solid #e2e8f0' : 'none',
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 달력 날짜 그리드 */}
        <div className="grid grid-cols-7" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', border: '1px solid #e2e8f0', borderTop: 'none' }}>
          {calendarDays.map((date, index) => {
            const dateStr = format(date, "yyyy-MM-dd");
            const fortune = fortuneMap.get(dateStr);
            const level = fortune?.level || null;
            const isCurrentDay = isToday(date);
            const isInCurrentMonth = isCurrentMonth(date);
            const isLastInRow = (index + 1) % 7 === 0;
            const isLastRow = index >= calendarDays.length - 7;

            return (
              <div
                key={dateStr}
                className={cn(
                  "aspect-square p-2 transition-all duration-200 flex flex-col items-center justify-center relative cursor-pointer hover:bg-slate-50",
                  getLevelColor(level),
                  !isInCurrentMonth && "opacity-40",
                  isCurrentDay && "ring-2 ring-indigo-500 ring-offset-1"
                )}
                style={{
                  borderRight: isLastInRow ? 'none' : '1px solid #e2e8f0',
                  borderBottom: isLastRow ? 'none' : '1px solid #e2e8f0',
                }}
                title={fortune ? `${dateStr}: ${level}` : dateStr}
              >
                {/* 날짜 숫자 */}
                <div className={cn(
                  "text-sm font-bold mb-1",
                  isCurrentDay ? "text-indigo-600" : isInCurrentMonth ? "text-slate-900" : "text-slate-400"
                )}>
                  {format(date, "d")}
                </div>
                
                {/* 운세 레벨 배지 - 색상 적용 */}
                {level && (
                  <div 
                    className="text-xs font-black"
                    style={{
                      color: level === "good" ? "#16a34a" : level === "normal" ? "#4f46e5" : level === "bad" ? "#d97706" : "#94a3b8"
                    }}
                  >
                    {getLevelBadge(level)}
                  </div>
                )}
                
                {/* 오늘 날짜 표시 */}
                {isCurrentDay && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* 범례 */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-6 flex-nowrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black" style={{ color: "#16a34a" }}>✓</span>
            <span className="text-xs font-medium text-slate-600">{t.calendar.good}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black" style={{ color: "#4f46e5" }}>○</span>
            <span className="text-xs font-medium text-slate-600">{t.calendar.normal}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black" style={{ color: "#d97706" }}>!</span>
            <span className="text-xs font-medium text-slate-600">{t.calendar.bad}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">{language === "ko" ? "데이터 없음" : "No data"}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
