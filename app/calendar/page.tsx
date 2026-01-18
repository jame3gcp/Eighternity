"use client";

import { useEffect, useState } from "react";
import { CalendarList } from "../../components/CalendarList";
import { CalendarFortuneResponse } from "../../lib/contracts/fortune";
import { CalendarDays } from "lucide-react";

import { Chip } from "../../components/Chip";
import { Skeleton } from "../../components/Skeleton";

export default function CalendarPage() {
  const [data, setData] = useState<CalendarFortuneResponse | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/fortune/calendar")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

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
      <div className="space-y-3">
        {[1,2,3,4,5].map((i: number) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
      </div>
    </div>
  );

  const filteredItems = filter === "all" 
    ? data.items 
    : data.items.filter(item => item.level === filter);

  return (
    <div className="flex flex-col gap-10 pb-10 animate-enter">
      <header className="space-y-3 pt-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">운세 캘린더</h1>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-wide">30 Days Energy Flow</p>
      </header>

      <section className="flex gap-2 sticky top-20 z-20 bg-background/80 backdrop-blur-md py-2 -mx-2 px-2">
        <Chip active={filter === "all"} onClick={() => setFilter("all")} className="px-5 py-2.5 rounded-2xl">전체</Chip>
        <Chip active={filter === "good"} onClick={() => setFilter("good")} className="px-5 py-2.5 rounded-2xl">Good</Chip>
        <Chip active={filter === "normal"} onClick={() => setFilter("normal")} className="px-5 py-2.5 rounded-2xl">Normal</Chip>
        <Chip active={filter === "bad"} onClick={() => setFilter("bad")} className="px-5 py-2.5 rounded-2xl">Focus</Chip>
      </section>

      <section className="space-y-3">
        <CalendarList items={filteredItems} />
      </section>
    </div>
  );
}
