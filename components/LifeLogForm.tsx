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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* 기분 */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          오늘의 기분
        </label>
        <div className="grid grid-cols-5 gap-2">
          {moodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMood(option.value)}
              className={`p-3 rounded-xl border transition-all ${
                mood === option.value
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="text-2xl mb-1">{option.emoji}</div>
              <div className="text-xs font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 컨디션 */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          컨디션
        </label>
        <div className="grid grid-cols-5 gap-2">
          {conditionOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setCondition(option.value)}
              className={`p-3 rounded-xl border transition-all ${
                condition === option.value
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="text-2xl mb-1">{option.emoji}</div>
              <div className="text-xs font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 수면 */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          수면 품질
        </label>
        <div className="grid grid-cols-5 gap-2">
          {sleepOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSleep(option.value)}
              className={`p-3 rounded-xl border transition-all ${
                sleep === option.value
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="text-2xl mb-1">{option.emoji}</div>
              <div className="text-xs font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 일정 */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          오늘의 일정
        </label>
        <div className="grid grid-cols-5 gap-2">
          {scheduleOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSchedule(option.value)}
              className={`p-3 rounded-xl border transition-all ${
                schedule === option.value
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="text-2xl mb-1">{option.emoji}</div>
              <div className="text-xs font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 메모 */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          추가 메모 (선택)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="오늘 하루에 대한 특별한 메모를 남겨보세요..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none resize-none text-sm bg-white"
          rows={3}
        />
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="group relative flex-1 px-6 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/60 text-slate-700 font-black uppercase tracking-wide shadow-md shadow-slate-200/50 hover:shadow-lg hover:shadow-slate-300/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">취소</span>
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !mood || !condition || !sleep || !schedule}
          className="group relative flex-1 px-6 py-4 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 text-white font-black uppercase tracking-wide shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
        >
          <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10 flex items-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>저장 중...</span>
              </>
            ) : (
              <>
                <CheckCircle size={20} className="transition-transform duration-300 group-hover:scale-110" />
                <span>저장하기</span>
              </>
            )}
          </span>
        </button>
      </div>
    </form>
  );
}
