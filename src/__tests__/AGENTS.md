<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-05 | Updated: 2026-04-05 -->

# __tests__

## Purpose
Root-level test files and shared test helpers for the Saju application. Uses Vitest with jsdom environment.

## Key Files

| File | Description |
|------|-------------|
| `sanity.test.ts` | Basic sanity checks — verifies core imports and app fundamentals work |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `helpers/` | Shared test utilities and Vitest setup |

## Key Files in helpers/

| File | Description |
|------|-------------|
| `helpers/vitest-setup.ts` | Vitest global setup — configures jsdom, Testing Library matchers |
| `helpers/saju-app-test-utils.ts` | Shared test utilities for SajuApp component tests |

## For AI Agents

### Working In This Directory
- Run tests with `npm test` (vitest) or `npm run test:watch`
- Vitest config is at project root `vitest.config.ts`
- jsdom environment is used for DOM testing
- `@testing-library/react` and `@testing-library/jest-dom` are available

<!-- MANUAL: -->
