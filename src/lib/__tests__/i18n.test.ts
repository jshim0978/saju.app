import { describe, test, expect } from 'vitest';
import { T, t } from '@/lib/i18n';

describe('i18n T object', () => {
  const keys = Object.keys(T);
  test('has >100 keys', () => expect(keys.length).toBeGreaterThan(100));
  test('every key has ko string', () => { for (const k of keys) expect(typeof T[k].ko).toBe('string'); });
  test('every key has en string', () => { for (const k of keys) expect(typeof T[k].en).toBe('string'); });
  test('no Korean in en values (except langToggle)', () => {
    const re = /[가-힣]/;
    for (const k of keys) {
      if (k === 'langToggle' || T[k].en === '') continue;
      expect(re.test(T[k].en), `"${k}" en has Korean: "${T[k].en}"`).toBe(false);
    }
  });
  test('langToggle en is 한국어', () => expect(T['langToggle'].en).toBe('한국어'));
});

describe('t() function', () => {
  test('ko returns Korean', () => expect(t('appTitle','ko')).toBe(T['appTitle'].ko));
  test('en returns English', () => expect(t('appTitle','en')).toBe(T['appTitle'].en));
  test('nonexistent returns key', () => expect(t('xyz_no','ko')).toBe('xyz_no'));
  test('empty en falls back to ko', () => {
    const k = Object.keys(T).find(k => T[k].en === '' && T[k].ko !== '');
    if (k) expect(t(k,'en')).toBe(T[k].ko);
  });
  test('critical keys non-empty both langs', () => {
    for (const k of ['appTitle','next','prev','restart','saveResult']) {
      expect(t(k,'ko').length).toBeGreaterThan(0);
      expect(t(k,'en').length).toBeGreaterThan(0);
    }
  });
});
