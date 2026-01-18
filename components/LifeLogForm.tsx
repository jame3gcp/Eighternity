"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { LifeLogRequest, MoodLevel, ConditionLevel, SleepQuality, ScheduleIntensity } from "@/lib/contracts/lifelog";

interface LifeLogFormProps {
  date?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function LifeLogForm({ date, onSuccess, onCancel }: LifeLogFormProps) {
  const today = date || new Date().toISOString().split("T")[0];
  
  const [mood, setMood] = useState<MoodLevel | null>(null);
  const [condition, setCondition] = useState<ConditionLevel | null>(null);
  const [sleep, setSleep] = useState<SleepQuality | null>(null);
  const [schedule, setSchedule] = useState<ScheduleIntensity | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const moodOptions: { value: MoodLevel; label: string; emoji: string }[] = [
    { value: "excellent", label: "최고", emoji: "😊" },
    { value: "good", label: "좋음", emoji: "🙂" },
    { value: "normal", label: "보통", emoji: "😐" },
    { value: "bad", label: "나쁨", emoji: "😔" },
    { value: "terrible", label: "최악", emoji: "😢" },
  ];

  const conditionOptions: { value: ConditionLevel; label: string; emoji: string }[] = [
    { value: "excellent", label: "최고", emoji: "💪" },
    { value: "good", label: "좋음", emoji: "👍" },
    { value: "normal", label: "보통", emoji: "👌" },
    { value: "bad", label: "나쁨", emoji: "😓" },
    { value: "terrible", label: "최악", emoji: "🤒" },
  ];

  const sleepOptions: { value: SleepQuality; label: string; emoji: string }[] = [
    { value: "excellent", label: "최고", emoji: "😴" },
    { value: "good", label: "좋음", emoji: "😌" },
    { value: "normal", label: "보통", emoji: "😑" },
    { value: "bad", label: "나쁨", emoji: "😴" },
    { value: "terrible", label: "최악", emoji: "😵" },
  ];

  const scheduleOptions: { value: ScheduleIntensity; label: string; emoji: string }[] = [
    { value: "very_busy", label: "매우 바쁨", emoji: "🔥" },
    { value: "busy", label: "바쁨", emoji: "📅" },
    { value: "normal", label: "보통", emoji: "📝" },
    { value: "light", label: "여유", emoji: "☕" },
    { value: "free", label: "한가", emoji: "🌴" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mood || !condition || !sleep || !schedule) {
      setError("모든 항목을 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const lifeLogData: LifeLogRequest = {
        date: today,
        mood,
        condition,
        sleep,
        schedule,
        notes: notes.trim() || undefined,
      };

      const response = await fetch("/api/lifelog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lifeLogData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "저장에 실패했습니다.");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* 기분 */}
      <div>
        <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wide">
          오늘의 기분
        </label>
        <div className="grid grid-cols-5 gap-2">
          {moodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMood(option.value)}
              className={`p-4 rounded-2xl border-2 transition-all ${
                mood === option.value
                  ? "border-primary bg-primary/10 shadow-lg scale-105"
                  : "border-slate-200 bg-white hover:border-primary/50"
              }`}
            >
              <div className="text-2xl mb-1">{option.emoji}</div>
              <div className="text-xs font-bold text-slate-700">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 컨디션 */}
      <div>
        <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wide">
          컨디션
        </label>
        <div className="grid grid-cols-5 gap-2">
          {conditionOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setCondition(option.value)}
              className={`p-4 rounded-2xl border-2 transition-all ${
                condition === option.value
                  ? "border-primary bg-primary/10 shadow-lg scale-105"
                  : "border-slate-200 bg-white hover:border-primary/50"
              }`}
            >
              <div className="text-2xl mb-1">{option.emoji}</div>
              <div className="text-xs font-bold text-slate-700">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 수면 */}
      <div>
        <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wide">
          수면 품질
        </label>
        <div className="grid grid-cols-5 gap-2">
          {sleepOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSleep(option.value)}
              className={`p-4 rounded-2xl border-2 transition-all ${
                sleep === option.value
                  ? "border-primary bg-primary/10 shadow-lg scale-105"
                  : "border-slate-200 bg-white hover:border-primary/50"
              }`}
            >
              <div className="text-2xl mb-1">{option.emoji}</div>
              <div className="text-xs font-bold text-slate-700">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 일정 */}
      <div>
        <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wide">
          오늘의 일정
        </label>
        <div className="grid grid-cols-5 gap-2">
          {scheduleOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSchedule(option.value)}
              className={`p-4 rounded-2xl border-2 transition-all ${
                schedule === option.value
                  ? "border-primary bg-primary/10 shadow-lg scale-105"
                  : "border-slate-200 bg-white hover:border-primary/50"
              }`}
            >
              <div className="text-2xl mb-1">{option.emoji}</div>
              <div className="text-xs font-bold text-slate-700">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 메모 */}
      <div>
        <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wide">
          추가 메모 (선택)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="오늘 하루에 대한 특별한 메모를 남겨보세요..."
          className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-primary focus:outline-none resize-none text-sm"
          rows={3}
        />
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-4 rounded-2xl border-2 border-slate-300 text-slate-700 font-black uppercase tracking-wide hover:bg-slate-50 transition-all"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !mood || !condition || !sleep || !schedule}
          className="flex-1 px-6 py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-wide shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              저장 중...
            </>
          ) : (
            <>
              <CheckCircle size={20} />
              저장하기
            </>
          )}
        </button>
      </div>
    </form>
  );
}
