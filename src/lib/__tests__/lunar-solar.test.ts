import { describe, test, expect } from 'vitest';
import { lunarToSolar } from '@/lib/lunar-solar';

describe('lunarToSolar', () => {
  test('1990 lunar new year valid', () => {
    const r = lunarToSolar(1990,1,1);
    expect(r.year).toBe(1990); expect(r.month).toBeGreaterThanOrEqual(1); expect(r.month).toBeLessThanOrEqual(2);
  });
  test('2000 mid-year valid', () => {
    const r = lunarToSolar(2000,6,15);
    expect(r.year).toBe(2000); expect(r.month).toBeGreaterThanOrEqual(6); expect(r.month).toBeLessThanOrEqual(8);
  });
  test('1960 boundary', () => {
    const r = lunarToSolar(1960,1,1);
    expect(r.year).toBe(1960);
  });
  test('2010 boundary', () => {
    const r = lunarToSolar(2010,1,1);
    expect(r.year).toBe(2010);
  });
  test('outside table uses fallback', () => {
    const r = lunarToSolar(2020,5,5);
    expect(r.year).toBe(2020); expect(r.month).toBeGreaterThanOrEqual(1); expect(r.month).toBeLessThanOrEqual(12);
  });
  test('always returns year/month/day', () => {
    for (const y of [1965,1980,1995,2005]) {
      const r = lunarToSolar(y,3,10);
      expect(typeof r.year).toBe('number');
      expect(typeof r.month).toBe('number');
      expect(typeof r.day).toBe('number');
    }
  });
});
