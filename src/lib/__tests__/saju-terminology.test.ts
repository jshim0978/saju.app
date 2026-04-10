import { describe, it, expect } from 'vitest';
import { SAJU_TERMS, getTermExplanation, getTerminologyPromptBlock } from '../saju-terminology';

describe('Saju Terminology Dictionary', () => {
  const requiredTerms = [
    '격국', '용신', '기신', '신강', '신약', '조후',
    '십성', '12운성', '오행', '충', '합', '형', '지장간', '신살', '대운',
  ];

  it('contains all required terms', () => {
    for (const term of requiredTerms) {
      expect(SAJU_TERMS).toHaveProperty(term);
    }
  });

  it('every term has all required fields', () => {
    for (const [key, entry] of Object.entries(SAJU_TERMS)) {
      expect(entry.term).toBeTruthy();
      expect(entry.shortKo).toBeTruthy();
      expect(entry.shortEn).toBeTruthy();
      expect(entry.whyKo).toBeTruthy();
      expect(entry.whyEn).toBeTruthy();
      expect(entry.detailKo).toBeTruthy();
      expect(entry.detailEn).toBeTruthy();
      expect(['high', 'medium', 'low']).toContain(entry.confidence);
      expect(typeof entry.interpretive).toBe('boolean');
    }
  });

  it('getTermExplanation returns Korean by default', () => {
    const result = getTermExplanation('격국');
    expect(result).not.toBeNull();
    expect(result!.short).toMatch(/[가-힣]/);
    expect(result!.term).toBe('격국');
  });

  it('getTermExplanation returns English when requested', () => {
    const result = getTermExplanation('격국', 'en');
    expect(result).not.toBeNull();
    expect(result!.short).toMatch(/^[A-Z]/);
  });

  it('getTermExplanation returns null for unknown terms', () => {
    expect(getTermExplanation('없는용어')).toBeNull();
  });

  it('interpretive terms are marked correctly', () => {
    // These are interpretive (LLM-inferred, not deterministic)
    expect(SAJU_TERMS['격국'].interpretive).toBe(true);
    expect(SAJU_TERMS['용신'].interpretive).toBe(true);
    expect(SAJU_TERMS['대운'].interpretive).toBe(true);
    // These are deterministic
    expect(SAJU_TERMS['오행'].interpretive).toBe(false);
    expect(SAJU_TERMS['십성'].interpretive).toBe(false);
    expect(SAJU_TERMS['충'].interpretive).toBe(false);
  });
});

describe('Terminology Prompt Block', () => {
  it('generates Korean block', () => {
    const block = getTerminologyPromptBlock('ko');
    expect(block).toContain('전문 용어 설명 규칙');
    expect(block).toContain('격국');
    expect(block).toContain('용신');
    expect(block).toContain('오행');
  });

  it('generates English block', () => {
    const block = getTerminologyPromptBlock('en');
    expect(block).toContain('Technical Term Explanation Rules');
    expect(block).toContain('structural pattern');
  });

  it('includes all required terms', () => {
    const block = getTerminologyPromptBlock('ko');
    for (const key of Object.keys(SAJU_TERMS)) {
      expect(block).toContain(SAJU_TERMS[key].term);
    }
  });

  it('includes guidance for interpretive framing', () => {
    const block = getTerminologyPromptBlock('ko');
    expect(block).toContain('해석적 개념');
    expect(block).toContain('~으로 보여');
  });
});
