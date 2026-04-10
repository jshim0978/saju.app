/**
 * Regression tests for term explanation system.
 * Protects against:
 * - Missing explanations for critical doctrinal terms
 * - 오행 interpretation returning empty for extreme values
 * - 신강/신약 explanation returning empty
 * - 신살 explanation returning empty
 * - 12운성 stage explanations missing
 */
import { describe, it, expect } from 'vitest';
import { SAJU_TERMS } from '../saju-terminology';
import {
  getOhInterpretation,
  getSingangExplanation,
  getShinsalExplanation,
  UNSUNG_EXPLAIN,
} from '../../components/ui/TermExplainer';

describe('Term Explanation System', () => {
  const requiredTerms = [
    '격국', '용신', '기신', '신강', '신약', '조후',
    '십성', '12운성', '오행', '충', '합', '형', '지장간', '신살', '대운',
  ];

  it('SAJU_TERMS contains all required terms', () => {
    for (const term of requiredTerms) {
      expect(SAJU_TERMS).toHaveProperty(term);
      expect(SAJU_TERMS[term].shortKo).toBeTruthy();
      expect(SAJU_TERMS[term].shortEn).toBeTruthy();
    }
  });
});

describe('오행 Interpretation', () => {
  it('returns interpretation for dominant element (>=35%)', () => {
    const result = getOhInterpretation('목', 3, 8, 'ko');
    expect(result).toContain('강해요');
  });

  it('returns interpretation for minimal element (<=5%)', () => {
    const result = getOhInterpretation('수', 0, 8, 'ko');
    expect(result).toContain('부족해요');
  });

  it('returns empty for balanced element', () => {
    const result = getOhInterpretation('토', 2, 8, 'ko');
    expect(result).toBe('');
  });

  it('works in English', () => {
    const strong = getOhInterpretation('목', 3, 8, 'en');
    expect(strong).toContain('strong');
    const weak = getOhInterpretation('수', 0, 8, 'en');
    expect(weak).toContain('minimal');
  });
});

describe('신강/신약 Explanation', () => {
  it('returns non-empty for 신강', () => {
    const result = getSingangExplanation(true, 'ko');
    expect(result).toBeTruthy();
    expect(result).toContain('강한');
  });

  it('returns non-empty for 신약', () => {
    const result = getSingangExplanation(false, 'ko');
    expect(result).toBeTruthy();
    expect(result).toContain('부드러운');
  });

  it('works in English', () => {
    expect(getSingangExplanation(true, 'en')).toContain('strong');
    expect(getSingangExplanation(false, 'en')).toContain('gentle');
  });
});

describe('신살 Explanation', () => {
  it('returns non-empty Korean explanation', () => {
    const result = getShinsalExplanation('ko');
    expect(result).toBeTruthy();
    expect(result).toContain('신살');
    expect(result).toContain('귀인');
  });

  it('returns non-empty English explanation', () => {
    const result = getShinsalExplanation('en');
    expect(result).toBeTruthy();
    expect(result).toContain('Shinsal');
  });
});

describe('12운성 Stage Explanations', () => {
  const stages = ['장생', '목욕', '관대', '건록', '제왕', '쇠', '병', '사', '묘', '절', '태', '양'];

  it('has explanation for all 12 stages', () => {
    for (const stage of stages) {
      expect(UNSUNG_EXPLAIN).toHaveProperty(stage);
      expect(UNSUNG_EXPLAIN[stage].ko).toBeTruthy();
      expect(UNSUNG_EXPLAIN[stage].en).toBeTruthy();
    }
  });

  it('Korean explanations are concise (< 30 chars)', () => {
    for (const stage of stages) {
      expect(UNSUNG_EXPLAIN[stage].ko.length).toBeLessThanOrEqual(30);
    }
  });
});
