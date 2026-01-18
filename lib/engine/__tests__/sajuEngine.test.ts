/**
 * 사주 계산 엔진 단위 테스트
 */

import { describe, it, expect } from 'vitest';
import { getSajuProfile, getYearPillar, getDayPillar } from '../sajuEngine';

describe('SajuEngine', () => {
  describe('getYearPillar', () => {
    it('1900년 = 경자년', () => {
      expect(getYearPillar(1900)).toBe('庚子');
    });

    it('1984년 = 갑자년', () => {
      expect(getYearPillar(1984)).toBe('甲子');
    });

    it('2000년 = 경진년', () => {
      expect(getYearPillar(2000)).toBe('庚辰');
    });
  });

  describe('getDayPillar', () => {
    it('1924년 2월 5일 = 갑자일 (기준일)', () => {
      expect(getDayPillar(1924, 2, 5)).toBe('甲子');
    });

    it('1984년 11월 16일 계산', () => {
      const result = getDayPillar(1984, 11, 16);
      expect(result).toMatch(/^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/);
    });
  });

  describe('getSajuProfile', () => {
    it('기본 사주 프로필 계산', () => {
      const profile = getSajuProfile('1984-11-16', '01:00');
      
      expect(profile).toHaveProperty('pillars');
      expect(profile).toHaveProperty('fiveElements');
      expect(profile).toHaveProperty('dayMaster');
      
      expect(profile.pillars.year).toMatch(/^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/);
      expect(profile.pillars.month).toMatch(/^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/);
      expect(profile.pillars.day).toMatch(/^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/);
      expect(profile.pillars.hour).toMatch(/^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/);
      
      // 오행 합계가 100인지 확인
      const sum = Object.values(profile.fiveElements).reduce((a, b) => a + b, 0);
      expect(sum).toBe(100);
    });

    it('생시가 없을 때 시주는 未知', () => {
      const profile = getSajuProfile('1984-11-16', null);
      expect(profile.pillars.hour).toBe('未知');
    });

    it('오행 분포 검증', () => {
      const profile = getSajuProfile('1984-11-16', '01:00');
      
      Object.values(profile.fiveElements).forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      });
    });
  });
});
