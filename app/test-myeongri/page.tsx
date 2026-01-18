"use client";

import { useState } from "react";
import { Sparkles, Loader2, CheckCircle2, XCircle, ChevronDown } from "lucide-react";

export default function TestMyeongriPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleTest = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/myeongri/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "분석 실패");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6 pt-8">
        {/* 헤더 */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">명리학 분석 테스트</h1>
          </div>
          <p className="text-gray-600">
            OpenAI를 사용한 명리학 종합 분석 시스템을 테스트합니다.
          </p>
        </div>

        {/* 안내 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-900">
            <strong>⚠️ 주의:</strong> 먼저 온보딩을 완료해야 합니다. 
            <a href="/onboarding" className="underline ml-1">온보딩 페이지로 이동</a>
          </p>
        </div>

        {/* 테스트 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={handleTest}
            disabled={isLoading}
            className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>분석 중...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>명리학 분석 시작</span>
              </>
            )}
          </button>
        </div>

        {/* 오류 표시 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <XCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">오류 발생</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 결과 표시 */}
        {result && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-1">✅ 분석 성공!</h3>
                  <p className="text-sm text-green-700">
                    명리학 분석이 완료되었습니다. 아래 결과를 확인하세요.
                  </p>
                </div>
              </div>
            </div>

            {/* 요약 */}
            {result.summary && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">📝 전체 요약</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {result.summary}
                </p>
              </div>
            )}

            {/* 사주 구성 */}
            {result.pillars && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">📊 사주 기본 구성</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(result.pillars).map(([key, pillar]: [string, any]) => (
                    <div key={key} className="space-y-2">
                      <div className="text-sm font-semibold text-gray-500 uppercase">
                        {key === "year" ? "연주" : key === "month" ? "월주" : key === "day" ? "일주" : "시주"}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {pillar.gan}{pillar.zhi}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {pillar.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 오행 분포 */}
            {result.fiveElements && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">🔮 오행 분포</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(result.fiveElements.distribution || {}).map(([key, value]: [string, any]) => (
                      <div key={key} className="text-center">
                        <div className="text-sm font-semibold text-gray-500">
                          {key === "wood" ? "목" : key === "fire" ? "화" : key === "earth" ? "토" : key === "metal" ? "금" : "수"}
                        </div>
                        <div className="text-lg font-bold text-gray-900">{value}%</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 mt-4">{result.fiveElements.balance}</p>
                  {result.fiveElements.dominant && result.fiveElements.dominant.length > 0 && (
                    <div className="text-sm">
                      <span className="font-semibold">우세한 오행:</span>{" "}
                      <span className="text-gray-700">
                        {result.fiveElements.dominant.map((e: string) => 
                          e === "wood" ? "목" : e === "fire" ? "화" : e === "earth" ? "토" : e === "metal" ? "금" : "수"
                        ).join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 종합 분석 */}
            {result.analysis && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">💡 종합 분석</h2>
                <div className="space-y-4">
                  {Object.entries(result.analysis).map(([key, value]: [string, any]) => (
                    <div key={key} className="border-l-4 border-indigo-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {key === "personality" ? "성격" : 
                         key === "career" ? "직업" : 
                         key === "wealth" ? "재물" : 
                         key === "health" ? "건강" : "인연"}
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 상세 정보 토글 */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-gray-700 flex items-center justify-center gap-2 transition-colors"
            >
              <span>{showDetails ? "상세 정보 숨기기" : "상세 정보 보기"}</span>
              <ChevronDown
                size={20}
                className={`transition-transform ${showDetails ? "rotate-180" : ""}`}
              />
            </button>

            {/* 상세 정보 */}
            {showDetails && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">🔍 상세 정보 (JSON)</h2>
                <pre className="text-xs bg-white p-4 rounded-lg overflow-auto border border-gray-200">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
