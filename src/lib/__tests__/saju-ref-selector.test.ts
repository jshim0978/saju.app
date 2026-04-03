import { describe, test, expect } from 'vitest';
import { getRelevantRefs } from '@/lib/saju-ref-selector';
import { SAJU_REFS } from '@/lib/saju-references';

describe('SAJU_REFS', () => {
  test('has 8 topic categories', () => {
    for (const k of ['personality','wealth','love','career','health','compatibility','timing','general'])
      expect(SAJU_REFS).toHaveProperty(k);
  });
  test('each has >=5 entries', () => {
    for (const k of Object.keys(SAJU_REFS))
      expect((SAJU_REFS as any)[k].length).toBeGreaterThanOrEqual(5);
  });
});

describe('getRelevantRefs', () => {
  test('valid topic returns non-empty', () => {
    expect(getRelevantRefs({dayMaster:0,topics:['personality']}).length).toBeGreaterThan(0);
  });
  test('multiple topics non-empty', () => {
    expect(getRelevantRefs({dayMaster:3,topics:['wealth','love']}).length).toBeGreaterThan(0);
  });
  test('invalid topic returns empty', () => {
    expect(getRelevantRefs({dayMaster:0,topics:['fake']})).toBe('');
  });
  test('empty topics returns empty', () => {
    expect(getRelevantRefs({dayMaster:0,topics:[]})).toBe('');
  });
  test('respects maxRefs', () => {
    const r = getRelevantRefs({dayMaster:0,topics:['personality','wealth','love','career','health'],maxRefs:3});
    const lines = r.split('\n').filter(l => /^\d+\./.test(l));
    expect(lines.length).toBeLessThanOrEqual(3);
  });
  test('works for all dayMasters 0-9', () => {
    for (let dm=0;dm<=9;dm++)
      expect(getRelevantRefs({dayMaster:dm,topics:['personality']}).length).toBeGreaterThan(0);
  });
});
