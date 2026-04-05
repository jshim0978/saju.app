<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-05 | Updated: 2026-04-05 -->

# __tests__

## Purpose
Unit tests for the core Saju library modules. Tests pure TypeScript logic with no React dependencies.

## Key Files

| File | Description |
|------|-------------|
| `saju-calc.test.ts` | Tests for `calcSaju()`, five element counting, 십성, 신살, 12운성 calculations |
| `saju-prompt-builder.test.ts` | Tests for prompt construction — verifies all sections are included in generated prompts |
| `saju-ref-selector.test.ts` | Tests for classical reference selection — verifies relevant quotes are picked by day master and topic |
| `lunar-solar.test.ts` | Tests for lunar-to-solar calendar conversion accuracy |
| `i18n.test.ts` | Tests for `t()` translation function — verifies Korean/English key lookups |

## For AI Agents

### Working In This Directory
- Run with `npm test` or target specific: `npx vitest run src/lib/__tests__/saju-calc.test.ts`
- Tests are pure unit tests — no mocking, no API calls
- Known date fixtures are used for verifying Saju calculations against known correct results
- When modifying `saju-calc.ts`, always run these tests to verify correctness

<!-- MANUAL: -->
