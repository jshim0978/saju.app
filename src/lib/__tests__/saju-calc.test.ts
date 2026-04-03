import { describe, test, expect } from 'vitest';
import {
  calcSaju, getOhCount, calcSipsung, getSipsung, calcShinsal, get12Unsung,
  getSajuMonth, isBeforeIpchun,
  CG, JJ, CG_HANJA, JJ_HANJA, OH_CG, OH_JJ, OH_EN, OH_ICON, OH_HANJA,
  PROFILES
} from '@/lib/saju-calc';

describe('Array constants', () => {
  test('CG has 10 stems', () => expect(CG).toHaveLength(10));
  test('JJ has 12 branches', () => expect(JJ).toHaveLength(12));
  test('CG_HANJA has 10', () => expect(CG_HANJA).toHaveLength(10));
  test('JJ_HANJA has 12', () => expect(JJ_HANJA).toHaveLength(12));
  test('OH_CG has 10', () => expect(OH_CG).toHaveLength(10));
  test('OH_JJ has 12', () => expect(OH_JJ).toHaveLength(12));
  test('OH_EN maps 5 elements', () => {
    expect(Object.keys(OH_EN)).toHaveLength(5);
    expect(OH_EN['목']).toBe('wood');
    expect(OH_EN['수']).toBe('water');
  });
  test('OH_ICON maps 5', () => expect(Object.keys(OH_ICON)).toHaveLength(5));
  test('OH_HANJA maps 5', () => expect(Object.keys(OH_HANJA)).toHaveLength(5));
  test('stems are unique', () => expect(new Set(CG).size).toBe(10));
  test('branches are unique', () => expect(new Set(JJ).size).toBe(12));
});

describe('PROFILES', () => {
  test('has 0-9 entries', () => { for (let i=0;i<=9;i++) expect(PROFILES[i]).toBeDefined(); });
  test('each has required fields', () => {
    for (let i=0;i<=9;i++) {
      const p = PROFILES[i];
      for (const f of ['name','short','desc','trait','strength','weakness']) {
        expect(typeof (p as any)[f]).toBe('string');
        expect((p as any)[f].length).toBeGreaterThan(0);
      }
    }
  });
});

describe('isBeforeIpchun', () => {
  test('Jan 1 = true', () => expect(isBeforeIpchun(1,1)).toBe(true));
  test('Feb 3 = true', () => expect(isBeforeIpchun(2,3)).toBe(true));
  test('Feb 4 = false', () => expect(isBeforeIpchun(2,4)).toBe(false));
  test('Mar 1 = false', () => expect(isBeforeIpchun(3,1)).toBe(false));
  test('Dec 31 = false', () => expect(isBeforeIpchun(12,31)).toBe(false));
});

describe('getSajuMonth', () => {
  test('Feb 3 => 11', () => expect(getSajuMonth(2,3)).toBe(11));
  test('Feb 4 => 0', () => expect(getSajuMonth(2,4)).toBe(0));
  test('Mar 6 => 1', () => expect(getSajuMonth(3,6)).toBe(1));
  test('Jun 6 => 4', () => expect(getSajuMonth(6,6)).toBe(4));
  test('Dec 7 => 10', () => expect(getSajuMonth(12,7)).toBe(10));
  test('always 0-11', () => {
    for (let m=1;m<=12;m++) for (const d of [1,15,28]) {
      const r = getSajuMonth(m,d);
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThanOrEqual(11);
    }
  });
});

describe('calcSaju', () => {
  test('valid ranges', () => {
    const r = calcSaju(1990,5,15,6);
    expect(r.yStem).toBeGreaterThanOrEqual(0); expect(r.yStem).toBeLessThanOrEqual(9);
    expect(r.yBranch).toBeGreaterThanOrEqual(0); expect(r.yBranch).toBeLessThanOrEqual(11);
    expect(r.mStem).toBeGreaterThanOrEqual(0); expect(r.mStem).toBeLessThanOrEqual(9);
    expect(r.mBranch).toBeGreaterThanOrEqual(0); expect(r.mBranch).toBeLessThanOrEqual(11);
    expect(r.dStem).toBeGreaterThanOrEqual(0); expect(r.dStem).toBeLessThanOrEqual(9);
    expect(r.dBranch).toBeGreaterThanOrEqual(0); expect(r.dBranch).toBeLessThanOrEqual(11);
  });
  test('hour -1 => hStem/hBranch -1', () => {
    const r = calcSaju(1990,5,15,-1);
    expect(r.hStem).toBe(-1); expect(r.hBranch).toBe(-1);
  });
  test('before ipchun adjusts sajuYear', () => {
    expect(calcSaju(2000,1,1,0).sajuYear).toBe(1999);
  });
  test('after ipchun keeps sajuYear', () => {
    expect(calcSaju(2000,3,1,0).sajuYear).toBe(2000);
  });
  test('deterministic', () => {
    expect(calcSaju(1985,12,31,3)).toEqual(calcSaju(1985,12,31,3));
  });
  test('handles 1960', () => {
    const r = calcSaju(1960,6,15,0);
    expect(r.yStem).toBeGreaterThanOrEqual(0);
  });
  test('handles 2010', () => {
    const r = calcSaju(2010,3,15,5);
    expect(r.yStem).toBeGreaterThanOrEqual(0);
  });
});

describe('getOhCount', () => {
  test('totals 8 with hour', () => {
    const c = getOhCount(calcSaju(1990,5,15,6));
    expect(c['목']+c['화']+c['토']+c['금']+c['수']).toBe(8);
  });
  test('totals 6 without hour', () => {
    const c = getOhCount(calcSaju(1990,5,15,-1));
    expect(c['목']+c['화']+c['토']+c['금']+c['수']).toBe(6);
  });
  test('all non-negative', () => {
    const c = getOhCount(calcSaju(1995,8,20,3));
    for (const k of ['목','화','토','금','수']) expect(c[k]).toBeGreaterThanOrEqual(0);
  });
});

describe('calcSipsung', () => {
  const valid = ['비견','겁재','식신','상관','편재','정재','편관','정관','편인','정인'];
  test('same stem = 비견', () => expect(calcSipsung(0,0)).toBe('비견'));
  test('all combos valid', () => {
    for (let i=0;i<10;i++) for (let j=0;j<10;j++) expect(valid).toContain(calcSipsung(i,j));
  });
});

describe('getSipsung', () => {
  test('has 년간/월간/시간', () => {
    const r = getSipsung(calcSaju(1990,5,15,6));
    expect(r).toHaveProperty('년간');
    expect(r).toHaveProperty('월간');
    expect(r).toHaveProperty('시간');
  });
  test('no 일간', () => {
    expect(getSipsung(calcSaju(1990,5,15,6))).not.toHaveProperty('일간');
  });
  test('no 시간 when hour=-1', () => {
    expect(getSipsung(calcSaju(1990,5,15,-1))).not.toHaveProperty('시간');
  });
});

describe('calcShinsal', () => {
  const validNames = ['도화살','역마살','화개살','홍염살','괴강살','백호살','천을귀인','문창귀인','양인살','귀문관살','고진살','과숙살','장성살'];
  test('returns array of strings', () => {
    const r = calcShinsal(calcSaju(1990,5,15,6));
    expect(Array.isArray(r)).toBe(true);
    r.forEach(s => expect(typeof s).toBe('string'));
  });
  test('no duplicates', () => {
    const r = calcShinsal(calcSaju(1990,5,15,6));
    expect(new Set(r).size).toBe(r.length);
  });
  test('valid names only', () => {
    for (let y=1980;y<=2000;y+=5) {
      calcShinsal(calcSaju(y,6,15,3)).forEach(s => expect(validNames).toContain(s));
    }
  });
});

describe('get12Unsung', () => {
  const valid = ['장생','목욕','관대','건록','제왕','쇠','병','사','묘','절','태','양'];
  test('returns 년지/월지/일지/시지', () => {
    const r = get12Unsung(calcSaju(1990,5,15,6));
    expect(r).toHaveProperty('년지');
    expect(r).toHaveProperty('월지');
    expect(r).toHaveProperty('일지');
    expect(r).toHaveProperty('시지');
  });
  test('시지 empty when hour=-1', () => {
    expect(get12Unsung(calcSaju(1990,5,15,-1))['시지']).toBe('');
  });
  test('valid stage names', () => {
    for (let d=1;d<=10;d++) {
      const r = get12Unsung(calcSaju(1990,5,d,0));
      expect(valid).toContain(r['일지']);
    }
  });
});
