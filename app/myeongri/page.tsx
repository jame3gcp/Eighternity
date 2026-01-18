/**
 * 명리학 종합 분석 페이지
 * 사주, 오행, 십성, 형충회합, 대운·세운을 종합적으로 분석
 */

"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2, CheckCircle2, XCircle, ChevronDown, ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/Skeleton";
import { Badge } from "@/components/Badge";

export default function MyeongriPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    // 쿠키에서 사용자 정보 확인
    const cookies = document.cookie.split(";");
    const userSajuCookie = cookies.find(c => c.trim().startsWith("user_saju="));
    
    if (userSajuCookie) {
      try {
        const cookieValue = decodeURIComponent(userSajuCookie.split("=")[1]);
        const userData = JSON.parse(cookieValue);
        setUserInfo(userData);
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
  }, []);

  const handleAnalyze = async () => {
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
        if (response.status === 401) {
          router.push("/onboarding");
          return;
        }
        throw new Error(data.error || "분석 실패");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 온보딩이 필요한 경우
  if (!userInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
          <Sparkles size={32} className="text-indigo-400" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-gray-900">온보딩이 필요합니다</h2>
          <p className="text-gray-500">명리학 분석을 위해 먼저 생년월일시를 입력해주세요.</p>
        </div>
        <a
          href="/onboarding"
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
        >
          온보딩 시작하기
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 pb-10 animate-enter">
      {/* 헤더 */}
      <header className="flex items-center gap-6 pt-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-400 p-[3px] shadow-xl shadow-indigo-200">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-indigo-500 overflow-hidden">
            <Sparkles size={48} strokeWidth={1.5} />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">명리학 종합 분석</h1>
          <p className="text-sm text-slate-500 font-bold mt-1 uppercase tracking-wide">Myeongri Analysis</p>
        </div>
      </header>

      {/* 사용자 정보 카드 */}
      <section className="glass-card rounded-[2.5rem] p-6 bg-white border-white/50 shadow-xl shadow-slate-200/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-slate-900 flex items-center gap-3 text-lg tracking-tight">
            <User size={20} className="text-indigo-500" />
            입력 정보
          </h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-gray-600">생년월일:</span>
            <span className="font-semibold text-gray-900">{userInfo.birthDate}</span>
          </div>
          {userInfo.birthTime && (
            <div className="flex items-center gap-3 text-sm">
              <Clock size={16} className="text-gray-400" />
              <span className="text-gray-600">생시:</span>
              <span className="font-semibold text-gray-900">{userInfo.birthTime}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <User size={16} className="text-gray-400" />
            <span className="text-gray-600">성별:</span>
            <span className="font-semibold text-gray-900">
              {userInfo.gender === "M" ? "남성" : userInfo.gender === "F" ? "여성" : "기타"}
            </span>
          </div>
        </div>
      </section>

      {/* 분석 시작 버튼 */}
      {!result && (
        <section className="glass-card rounded-[2.5rem] p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200/50 shadow-xl shadow-indigo-200/50">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">AI 명리학 분석</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                사주, 오행, 십성, 형충회합, 대운·세운을 종합적으로 분석하여<br />
                성격, 직업, 재물, 건강, 인연에 대한 깊이 있는 해석을 제공합니다.
              </p>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/30"
            >
              {isLoading ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  <span>AI 분석 중...</span>
                </>
              ) : (
                <>
                  <Sparkles size={24} />
                  <span>명리학 분석 시작</span>
                </>
              )}
            </button>
          </div>
        </section>
      )}

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-[2rem]" />
          <Skeleton className="h-64 w-full rounded-[2rem]" />
        </div>
      )}

      {/* 오류 표시 */}
      {error && (
        <div className="glass-card rounded-[2.5rem] p-6 bg-red-50 border-red-200 shadow-xl">
          <div className="flex items-start gap-3">
            <XCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900 mb-1">오류 발생</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 결과 표시 */}
      {result && (
        <div className="space-y-6">
          {/* 성공 메시지 */}
          <div className="glass-card rounded-[2.5rem] p-6 bg-green-50 border-green-200 shadow-xl">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-green-900 mb-1">✅ 분석 완료!</h3>
                <p className="text-sm text-green-700">
                  명리학 종합 분석이 완료되었습니다. 아래 결과를 확인하세요.
                </p>
              </div>
            </div>
          </div>

          {/* 전체 요약 */}
          {result.summary && (
            <section className="glass-card rounded-[2.5rem] p-8 bg-white border-white/50 shadow-2xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
                  <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                  전체 요약
                </h2>
                <Badge variant="default" className="px-3">Summary</Badge>
              </div>
              <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {result.summary}
              </p>
            </section>
          )}

          {/* 사주 기본 구성 */}
          {result.pillars && (
            <section className="glass-card rounded-[2.5rem] p-8 bg-white border-white/50 shadow-2xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
                  <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                  사주 기본 구성
                </h2>
                <Badge variant="default" className="px-3">Pillars</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(result.pillars).map(([key, pillar]: [string, any]) => (
                  <div key={key} className="text-center p-4 bg-slate-50 rounded-2xl">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                      {key === "year" ? "연주" : key === "month" ? "월주" : key === "day" ? "일주" : "시주"}
                    </div>
                    <div className="text-2xl font-black text-slate-900 mb-2">
                      {pillar.gan}{pillar.zhi}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {pillar.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 오행 분포 */}
          {result.fiveElements && (
            <section className="glass-card rounded-[2.5rem] p-8 bg-white border-white/50 shadow-2xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
                  <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                  오행 분포
                </h2>
                <Badge variant="default" className="px-3">Five Elements</Badge>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(result.fiveElements.distribution || {}).map(([key, value]: [string, any]) => (
                    <div key={key} className="text-center p-3 bg-slate-50 rounded-xl">
                      <div className="text-xs font-bold text-gray-500 mb-1">
                        {key === "wood" ? "목" : key === "fire" ? "화" : key === "earth" ? "토" : key === "metal" ? "금" : "수"}
                      </div>
                      <div className="text-xl font-black text-slate-900">{value}%</div>
                    </div>
                  ))}
                </div>
                
                {/* 오행 균형 설명 */}
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <h3 className="text-sm font-bold text-indigo-900 mb-2 uppercase tracking-widest">오행 균형</h3>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {result.fiveElements.balance}
                  </p>
                </div>

                {/* 각 오행 상세 분석 */}
                {result.fiveElements.detailedAnalysis && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-widest">오행별 상세 분석</h3>
                    {Object.entries(result.fiveElements.detailedAnalysis).map(([key, value]: [string, any]) => (
                      value && (
                        <div key={key} className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                          <h4 className="text-base font-bold text-slate-900 mb-2">
                            {key === "wood" ? "목(木)" : key === "fire" ? "화(火)" : key === "earth" ? "토(土)" : key === "metal" ? "금(金)" : "수(水)"} 오행
                          </h4>
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                            {value}
                          </p>
                        </div>
                      )
                    ))}
                  </div>
                )}

                {/* 우세/약한 오행 */}
                <div className="grid grid-cols-2 gap-4">
                  {result.fiveElements.dominant && result.fiveElements.dominant.length > 0 && (
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                      <h4 className="text-xs font-bold text-green-900 mb-2 uppercase tracking-widest">우세한 오행</h4>
                      <p className="text-sm text-gray-700">
                        {result.fiveElements.dominant.map((e: string) => 
                          e === "wood" ? "목" : e === "fire" ? "화" : e === "earth" ? "토" : e === "metal" ? "금" : "수"
                        ).join(", ")}
                      </p>
                    </div>
                  )}
                  {result.fiveElements.weak && result.fiveElements.weak.length > 0 && (
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <h4 className="text-xs font-bold text-amber-900 mb-2 uppercase tracking-widest">약한 오행</h4>
                      <p className="text-sm text-gray-700">
                        {result.fiveElements.weak.map((e: string) => 
                          e === "wood" ? "목" : e === "fire" ? "화" : e === "earth" ? "토" : e === "metal" ? "금" : "수"
                        ).join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* 십성 분석 */}
          {result.tenGods && (
            <section className="glass-card rounded-[2.5rem] p-8 bg-white border-white/50 shadow-2xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
                  <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                  십성(十神) 분석
                </h2>
                <Badge variant="default" className="px-3">Ten Gods</Badge>
              </div>
              <div className="space-y-6">
                {/* 십성 분포 */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-widest">십성 분포</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {(Object.entries(result.tenGods.distribution || {}) as [string, number][])
                      .filter(([_, count]) => count > 0)
                      .sort(([_, a], [__, b]) => b - a)
                      .map(([name, count]) => (
                        <div key={name} className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                          <div className="text-center">
                            <div className="text-sm font-black text-slate-900 mb-1">{name}</div>
                            <div className="text-xl font-black text-indigo-600">{count}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* 십성 특성 */}
                {result.tenGods.characteristics && Object.keys(result.tenGods.characteristics).length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-widest">십성별 특성</h3>
                    <div className="space-y-3">
                      {Object.entries(result.tenGods.characteristics).map(([name, description]: [string, any]) => (
                        <div key={name} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <h4 className="text-base font-bold text-slate-900 mb-2">{name}</h4>
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                            {description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 십성 흐름 */}
                {result.tenGods.flow && (
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <h3 className="text-sm font-bold text-indigo-900 mb-2 uppercase tracking-widest">십성 흐름</h3>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {result.tenGods.flow}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 형충회합 */}
          {result.relationships && (
            <section className="glass-card rounded-[2.5rem] p-8 bg-white border-white/50 shadow-2xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
                  <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                  형충회합
                </h2>
                <Badge variant="default" className="px-3">Relationships</Badge>
              </div>
              <div className="space-y-6">
                {/* 충(沖) */}
                {result.relationships.conflicts && result.relationships.conflicts.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-red-900 mb-3 uppercase tracking-widest">충(沖)</h3>
                    <div className="space-y-3">
                      {result.relationships.conflicts.map((conflict: any, idx: number) => (
                        <div key={idx} className="p-4 bg-red-50 rounded-xl border border-red-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-bold text-red-900">{conflict.pillar}</span>
                            <Badge variant="default" className="px-2 py-0.5 text-xs bg-red-200 text-red-900">
                              {conflict.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                            {conflict.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 합(合) */}
                {result.relationships.combinations && result.relationships.combinations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-green-900 mb-3 uppercase tracking-widest">합(合)</h3>
                    <div className="space-y-3">
                      {result.relationships.combinations.map((combination: any, idx: number) => (
                        <div key={idx} className="p-4 bg-green-50 rounded-xl border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-bold text-green-900">{combination.pillars.join(" ↔ ")}</span>
                            <Badge variant="default" className="px-2 py-0.5 text-xs bg-green-200 text-green-900">
                              {combination.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                            {combination.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 형(刑) */}
                {result.relationships.punishments && result.relationships.punishments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-amber-900 mb-3 uppercase tracking-widest">형(刑)</h3>
                    <div className="space-y-3">
                      {result.relationships.punishments.map((punishment: any, idx: number) => (
                        <div key={idx} className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-bold text-amber-900">{punishment.pillars.join(" ↔ ")}</span>
                            <Badge variant="default" className="px-2 py-0.5 text-xs bg-amber-200 text-amber-900">
                              {punishment.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                            {punishment.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 해(害) */}
                {result.relationships.harms && result.relationships.harms.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-orange-900 mb-3 uppercase tracking-widest">해(害)</h3>
                    <div className="space-y-3">
                      {result.relationships.harms.map((harm: any, idx: number) => (
                        <div key={idx} className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-bold text-orange-900">{harm.pillars.join(" ↔ ")}</span>
                            <Badge variant="default" className="px-2 py-0.5 text-xs bg-orange-200 text-orange-900">
                              {harm.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                            {harm.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 대운·세운 */}
          {result.luck && (
            <section className="glass-card rounded-[2.5rem] p-8 bg-white border-white/50 shadow-2xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
                  <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                  대운·세운
                </h2>
                <Badge variant="default" className="px-3">Luck</Badge>
              </div>
              <div className="space-y-6">
                {/* 현재 운세 */}
                {result.luck.current && (
                  <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                    <h3 className="text-base font-bold text-indigo-900 mb-4 uppercase tracking-widest">현재 운세</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-2">현재 대운</h4>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {result.luck.current.daeun}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-2">현재 세운</h4>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {result.luck.current.seun}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-2">종합 운세</h4>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {result.luck.current.overall}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 대운 */}
                {result.luck.daeun && result.luck.daeun.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-widest">대운(大運)</h3>
                    <div className="space-y-3">
                      {result.luck.daeun.slice(0, 5).map((daeun: any, idx: number) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-bold text-slate-900">{daeun.age}</span>
                            <span className="text-sm font-semibold text-indigo-600">{daeun.pillar}</span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                            {daeun.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 세운 */}
                {result.luck.seun && result.luck.seun.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-widest">세운(歲運) - 최근 10년</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {result.luck.seun.slice(0, 10).map((seun: any, idx: number) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="text-xs font-bold text-slate-500 mb-1">{seun.year}년</div>
                          <div className="text-sm font-semibold text-indigo-600 mb-1">{seun.pillar}</div>
                          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                            {seun.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 종합 분석 */}
          {result.analysis && (
            <section className="glass-card rounded-[2.5rem] p-8 bg-white border-white/50 shadow-2xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
                  <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                  종합 분석
                </h2>
                <Badge variant="default" className="px-3">Analysis</Badge>
              </div>
              <div className="space-y-6">
                {Object.entries(result.analysis).map(([key, value]: [string, any]) => (
                  <div key={key} className="p-5 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl border-l-4 border-indigo-500">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      {key === "personality" ? "성격" : 
                       key === "career" ? "직업" : 
                       key === "wealth" ? "재물" : 
                       key === "health" ? "건강" : "인연"}
                    </h3>
                    <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">{value}</p>
                  </div>
                ))}
              </div>
            </section>
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
            <section className="glass-card rounded-[2.5rem] p-6 bg-gray-50 border-gray-200 shadow-xl">
              <h2 className="text-lg font-bold text-gray-900 mb-4">🔍 상세 정보 (JSON)</h2>
              <pre className="text-xs bg-white p-4 rounded-lg overflow-auto border border-gray-200 max-h-[600px]">
                {JSON.stringify(result, null, 2)}
              </pre>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
