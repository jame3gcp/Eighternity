/**
 * 명리학 분석 API 통합 테스트
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST, GET } from '../myeongri/analyze/route';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Mock dependencies
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

vi.mock('@/lib/storage/userStore', () => ({
  getOrCreateUserId: vi.fn().mockResolvedValue('test-user-id'),
}));

vi.mock('@/lib/storage/myeongriStore', () => ({
  getMyeongriAnalysis: vi.fn(),
  saveMyeongriAnalysis: vi.fn(),
}));

vi.mock('@/lib/ai/openai', () => ({
  analyzeMyeongri: vi.fn(),
}));

describe('Myeongri API Integration Tests', () => {
  const mockUserData = {
    birthDate: '1984-11-16',
    birthTime: '01:00',
    gender: 'M',
    userId: 'test-user-id',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock cookies
    vi.mocked(cookies).mockReturnValue({
      get: vi.fn().mockReturnValue({
        value: JSON.stringify(mockUserData),
      }),
    } as any);
  });

  describe('POST /api/myeongri/analyze', () => {
    it('저장된 분석 결과가 있으면 재사용', async () => {
      const { getMyeongriAnalysis } = await import('@/lib/storage/myeongriStore');
      const mockAnalysis = {
        summary: '테스트 분석 결과',
        pillars: {
          year: { gan: '甲', zhi: '子', explanation: '테스트' },
          month: { gan: '丙', zhi: '寅', explanation: '테스트' },
          day: { gan: '戊', zhi: '午', explanation: '테스트' },
          hour: { gan: '庚', zhi: '申', explanation: '테스트' },
        },
        fiveElements: {
          distribution: { wood: 20, fire: 30, earth: 25, metal: 15, water: 10 },
          balance: '균형',
          dominant: [],
          weak: [],
          detailedAnalysis: {},
        },
        tenGods: {
          distribution: {},
          characteristics: {},
          flow: '',
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
          current: { daeun: '', seun: '', overall: '' },
        },
        analysis: {
          personality: '',
          career: '',
          wealth: '',
          health: '',
          relationships: '',
        },
      };
      
      vi.mocked(getMyeongriAnalysis).mockResolvedValue(mockAnalysis as any);

      const request = new NextRequest('http://localhost:3000/api/myeongri/analyze', {
        method: 'POST',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.summary).toBe('테스트 분석 결과');
      expect(getMyeongriAnalysis).toHaveBeenCalledWith('test-user-id');
    });

    it('저장된 분석 결과가 없으면 새로 분석', async () => {
      const { getMyeongriAnalysis, saveMyeongriAnalysis } = await import('@/lib/storage/myeongriStore');
      const { analyzeMyeongri } = await import('@/lib/ai/openai');
      
      vi.mocked(getMyeongriAnalysis).mockResolvedValue(null);
      
      const mockAnalysis = {
        summary: '새로운 분석 결과',
        pillars: {},
        fiveElements: {},
        tenGods: {},
        relationships: {},
        luck: {},
        analysis: {},
      };
      
      vi.mocked(analyzeMyeongri).mockResolvedValue(mockAnalysis as any);
      vi.mocked(saveMyeongriAnalysis).mockResolvedValue(mockAnalysis as any);

      const request = new NextRequest('http://localhost:3000/api/myeongri/analyze', {
        method: 'POST',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.summary).toBe('새로운 분석 결과');
      expect(analyzeMyeongri).toHaveBeenCalled();
      expect(saveMyeongriAnalysis).toHaveBeenCalled();
    });

    it('사용자 정보가 없으면 401 반환', async () => {
      vi.mocked(cookies).mockReturnValue({
        get: vi.fn().mockReturnValue(null),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/myeongri/analyze', {
        method: 'POST',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('No user info');
    });
  });

  describe('GET /api/myeongri/analyze', () => {
    it('저장된 분석 결과 조회', async () => {
      const { getMyeongriAnalysis } = await import('@/lib/storage/myeongriStore');
      const mockAnalysis = {
        summary: '저장된 분석 결과',
        pillars: {},
        fiveElements: {},
        tenGods: {},
        relationships: {},
        luck: {},
        analysis: {},
      };
      
      vi.mocked(getMyeongriAnalysis).mockResolvedValue(mockAnalysis as any);

      const request = new NextRequest('http://localhost:3000/api/myeongri/analyze');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.summary).toBe('저장된 분석 결과');
    });

    it('분석 결과가 없으면 404 반환', async () => {
      const { getMyeongriAnalysis } = await import('@/lib/storage/myeongriStore');
      vi.mocked(getMyeongriAnalysis).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/myeongri/analyze');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Analysis not found');
    });
  });
});
