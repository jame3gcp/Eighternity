/**
 * 감정 파형 그래프 컴포넌트
 * 시간에 따른 감정 변화를 시각화
 */

"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { EmotionWavePoint, EmotionType } from "@/lib/contracts/emotion";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

interface EmotionWaveGraphProps {
  points: EmotionWavePoint[];
  height?: number;
}

// 감정별 색상 매핑
const emotionColors: Record<EmotionType, string> = {
  joy: "#10b981", // green
  sadness: "#3b82f6", // blue
  anger: "#ef4444", // red
  fear: "#8b5cf6", // purple
  anxiety: "#f59e0b", // amber
  calm: "#06b6d4", // cyan
  excitement: "#f97316", // orange
  fatigue: "#6b7280", // gray
  focus: "#6366f1", // indigo
  confusion: "#ec4899", // pink
  satisfaction: "#22c55e", // green-500
  disappointment: "#64748b", // slate
};

// 감정 한글명 (export)
export const emotionLabels: Record<EmotionType, string> = {
  joy: "기쁨",
  sadness: "슬픔",
  anger: "분노",
  fear: "두려움",
  anxiety: "불안",
  calm: "평온",
  excitement: "흥분",
  fatigue: "피로",
  focus: "집중",
  confusion: "혼란",
  satisfaction: "만족",
  disappointment: "실망",
};

export function EmotionWaveGraph({ points, height = 300 }: EmotionWaveGraphProps) {
  // 데이터 포맷팅
  const chartData = points.map((point) => {
    const timestamp = parseISO(point.timestamp);
    return {
      time: format(timestamp, "HH:mm", { locale: ko }),
      timestamp: point.timestamp,
      [point.emotion]: point.intensity,
      emotion: point.emotion,
      context: point.context,
    };
  });

  // 나타난 감정들 추출
  const emotions = Array.from(new Set(points.map(p => p.emotion))) as EmotionType[];

  if (points.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-400">
        <p>감정 데이터가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
          />
          <YAxis 
            domain={[0, 100]}
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
            label={{ value: "강도", angle: -90, position: "insideLeft", style: { fontSize: "12px" } }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length > 0) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      {format(parseISO(data.timestamp), "MM월 dd일 HH:mm", { locale: ko })}
                    </p>
                    {payload.map((entry: any, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: emotionColors[entry.dataKey as EmotionType] }}
                        />
                        <span className="text-sm text-gray-700">
                          {emotionLabels[entry.dataKey as EmotionType]}: {entry.value}%
                        </span>
                      </div>
                    ))}
                    {data.context && (
                      <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
                        {data.context}
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            formatter={(value) => emotionLabels[value as EmotionType] || value}
            wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
          />
          {emotions.map((emotion) => (
            <Line
              key={emotion}
              type="monotone"
              dataKey={emotion}
              stroke={emotionColors[emotion]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name={emotion}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
