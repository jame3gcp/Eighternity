/**
 * 명리학 저장소 단위 테스트
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  saveMyeongriAnalysis, 
  getMyeongriAnalysis, 
  hasMyeongriAnalysis,
  deleteMyeongriAnalysis 
} from '../myeongriStore';
import { MyeongriAnalysisResponse } from '@/lib/contracts/myeongri';

// Mock Supabase client
vi.mock('@/lib/db/supabase', () => ({
  getSupabaseServerClient: vi.fn(),
}));

describe('MyeongriStore', () => {
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  const mockAnalysis: MyeongriAnalysisResponse = {
    pillars: {
      year: { gan: '甲', zhi: '子', explanation: '테스트 설명' },
      month: { gan: '丙', zhi: '寅', explanation: '테스트 설명' },
      day: { gan: '戊', zhi: '午', explanation: '테스트 설명' },
      hour: { gan: '庚', zhi: '申', explanation: '테스트 설명' },
    },
    fiveElements: {
      distribution: { wood: 20, fire: 30, earth: 25, metal: 15, water: 10 },
      balance: '균형',
      dominant: ['fire'],
      weak: ['water'],
      detailedAnalysis: {
        wood: '목 오행 분석',
        fire: '화 오행 분석',
        earth: '토 오행 분석',
        metal: '금 오행 분석',
        water: '수 오행 분석',
      },
    },
    tenGods: {
      distribution: { '比肩': 2, '劫財': 1 },
      characteristics: { '比肩': '특성 설명' },
      flow: '십성 흐름 설명',
    },
    relationships: {
      conflicts: [],
      combinations: [],
      punishments: [],
      harms: [],
    },
    luck: {
      daeun: [],
      seun: [],
      current: { daeun: '현재 대운', seun: '현재 세운', overall: '종합 운세' },
    },
    analysis: {
      personality: '성격 분석',
      career: '직업 분석',
      wealth: '재물 분석',
      health: '건강 분석',
      relationships: '인연 분석',
    },
    summary: '전체 요약',
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    // 메모리 저장소 초기화를 위해 deleteMyeongriAnalysis 사용
    await deleteMyeongriAnalysis(mockUserId);
  });

  describe('saveMyeongriAnalysis', () => {
    it('메모리 저장소에 저장 (Supabase 없을 때)', async () => {
      const { getSupabaseServerClient } = await import('@/lib/db/supabase');
      vi.mocked(getSupabaseServerClient).mockResolvedValue(null);

      const result = await saveMyeongriAnalysis(mockUserId, mockAnalysis);
      
      expect(result).toEqual(mockAnalysis);
      
      // 메모리 저장소에서 확인
      const retrieved = await getMyeongriAnalysis(mockUserId);
      expect(retrieved).toEqual(mockAnalysis);
    });

    it('Supabase에 저장 (UUID 형식)', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        upsert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { analysis_result: mockAnalysis },
          error: null,
        }),
      };

      const { getSupabaseServerClient } = await import('@/lib/db/supabase');
      vi.mocked(getSupabaseServerClient).mockResolvedValue(mockSupabase as any);

      const result = await saveMyeongriAnalysis(mockUserId, mockAnalysis);
      
      expect(result).toEqual(mockAnalysis);
      expect(mockSupabase.from).toHaveBeenCalledWith('myeongri_analyses');
      expect(mockSupabase.upsert).toHaveBeenCalled();
    });
  });

  describe('getMyeongriAnalysis', () => {
    it('저장된 분석 결과 조회', async () => {
      // 먼저 저장
      const { getSupabaseServerClient } = await import('@/lib/db/supabase');
      vi.mocked(getSupabaseServerClient).mockResolvedValue(null);
      
      await saveMyeongriAnalysis(mockUserId, mockAnalysis);
      
      // 조회
      const result = await getMyeongriAnalysis(mockUserId);
      
      expect(result).toEqual(mockAnalysis);
    });

    it('존재하지 않는 분석 결과 조회 시 null 반환', async () => {
      const { getSupabaseServerClient } = await import('@/lib/db/supabase');
      vi.mocked(getSupabaseServerClient).mockResolvedValue(null);
      
      const result = await getMyeongriAnalysis('non-existent-user-id');
      
      expect(result).toBeNull();
    });
  });

  describe('hasMyeongriAnalysis', () => {
    it('분석 결과 존재 여부 확인', async () => {
      const { getSupabaseServerClient } = await import('@/lib/db/supabase');
      vi.mocked(getSupabaseServerClient).mockResolvedValue(null);
      
      // 저장 전
      expect(await hasMyeongriAnalysis(mockUserId)).toBe(false);
      
      // 저장 후
      await saveMyeongriAnalysis(mockUserId, mockAnalysis);
      expect(await hasMyeongriAnalysis(mockUserId)).toBe(true);
    });
  });

  describe('deleteMyeongriAnalysis', () => {
    it('분석 결과 삭제', async () => {
      const { getSupabaseServerClient } = await import('@/lib/db/supabase');
      vi.mocked(getSupabaseServerClient).mockResolvedValue(null);
      
      // 저장
      await saveMyeongriAnalysis(mockUserId, mockAnalysis);
      expect(await hasMyeongriAnalysis(mockUserId)).toBe(true);
      
      // 삭제
      await deleteMyeongriAnalysis(mockUserId);
      expect(await hasMyeongriAnalysis(mockUserId)).toBe(false);
    });
  });
});
