"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingRequest } from "../../../lib/contracts/user";
import { ArrowRight, Clock, Calendar, Users } from "lucide-react";

import { Chip } from "../../../components/Chip";
import { Sparkles } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<OnboardingRequest>({
    birthDate: "",
    birthTime: null,
    gender: "M",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // birthTime이 빈 문자열이면 null로 변환
      const submitData = {
        ...formData,
        birthTime: formData.birthTime === "" ? null : formData.birthTime,
      };
      
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });
      
      if (res.ok) {
        router.push("/home");
      } else {
        const errorData = await res.json();
        console.error("Onboarding error:", errorData);
        alert(`오류: ${errorData.error || "알 수 없는 오류가 발생했습니다."}`);
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      alert("요청 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pt-8 pb-10 min-h-screen px-4 animate-enter">
      <div className="space-y-4">
        <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
          <Sparkles size={24} className="text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 leading-[1.2]">
            당신의 하루를<br />
            더 쉽게.
          </h1>
          <p className="text-gray-500 text-sm">생년월일을 입력해주세요</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 animate-enter delay-100">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Calendar size={16} />
              생년월일
            </label>
            <input
              required
              type="date"
              className="w-full p-4 bg-white border border-gray-200 rounded-xl text-base font-medium text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Clock size={16} />
              태어난 시간
            </label>
            <div className="flex flex-col gap-3">
              <input
                type="time"
                className="w-full p-4 bg-white border border-gray-200 rounded-xl text-base font-medium text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                disabled={formData.birthTime === null}
                value={formData.birthTime || ""}
                onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
              />
              <div className="flex gap-2">
                <Chip 
                  type="button"
                  active={formData.birthTime === null}
                  onClick={() => setFormData({ ...formData, birthTime: null })}
                  className="flex-grow py-3 rounded-xl"
                >
                  시간 모름
                </Chip>
                <Chip 
                  type="button"
                  active={formData.birthTime !== null}
                  onClick={() => {
                    // 시간 선택 버튼 클릭 시, 이미 시간이 있으면 유지, 없으면 기본값 설정
                    setFormData({ ...formData, birthTime: formData.birthTime || "12:00" });
                  }}
                  className="flex-grow py-3 rounded-xl"
                >
                  시간 선택
                </Chip>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Users size={16} />
              성별
            </label>
            <div className="flex gap-2">
              <Chip 
                type="button"
                active={formData.gender === "M"}
                onClick={() => setFormData({ ...formData, gender: "M" })}
                className="flex-1 py-3 rounded-xl"
              >
                남성
              </Chip>
              <Chip 
                type="button"
                active={formData.gender === "F"}
                onClick={() => setFormData({ ...formData, gender: "F" })}
                className="flex-1 py-3 rounded-xl"
              >
                여성
              </Chip>
              <Chip 
                type="button"
                active={formData.gender === "O"}
                onClick={() => setFormData({ ...formData, gender: "O" })}
                className="flex-1 py-3 rounded-xl"
              >
                기타
              </Chip>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-4 bg-gray-900 text-white rounded-xl font-semibold text-base active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800"
          >
            {isLoading ? (
              <span className="animate-pulse">분석 중...</span>
            ) : (
              <>
                <span>시작하기</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
          <p className="text-center text-xs text-gray-500 leading-relaxed px-4">
            "결정은 당신의 몫, 우리는 방향만 제안해요"<br />
            개인정보는 분석 목적으로만 안전하게 사용됩니다.
          </p>
        </div>
      </form>
    </div>
  );
}
