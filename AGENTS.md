<!-- Generated: 2026-03-22 | Updated: 2026-04-05 -->

# saju-app (별빛 사주 | Starlight Saju)

## Purpose
A Korean fortune-telling (사주/Saju) web application built with Next.js. Users enter their birth date/time and personal preferences, then receive AI-generated Saju readings powered by GPT-4o-mini via streaming API. Supports 4 modes: personal Saju analysis (17 deep items), compatibility analysis, 2026 yearly fortune, and pregnancy mode. Full bilingual support (Korean/English).

## Key Files

| File | Description |
|------|-------------|
| `package.json` | Dependencies: Next.js 16, React 19, OpenAI SDK, Toss Payments SDK, html2canvas, TypeScript |
| `next.config.ts` | Next.js configuration (minimal/default) |
| `tsconfig.json` | TypeScript config with `@/*` path alias to `./src/*` |
| `vitest.config.ts` | Vitest test configuration with jsdom environment |
| `.env.local` | Environment variables (`OPENAI_API_KEY`, `TOSS_SECRET_KEY`, `NEXT_PUBLIC_TOSS_CLIENT_KEY`, business info overrides) |
| `.env.example` | Environment variable template (currently only `OPENAI_API_KEY` — Toss keys not yet templated) |
| `next-env.d.ts` | Next.js TypeScript type definitions |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/` | Application source code (see `src/AGENTS.md`) |
| `public/` | Static assets: `favicon.svg`, `manifest.json`, `sw.js` (PWA support) (see `public/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- This is a Next.js 16 app with App Router (`src/app/`)
- Uses `@/*` path alias mapping to `./src/*`
- Korean language is primary (`lang="ko"`) with full English i18n support
- OpenAI **GPT-4o-mini** is used for AI readings via streaming responses
- **Do not commit `.env.local`** — it contains the OpenAI API key and Toss Payments keys
- PWA enabled via `manifest.json` and `sw.js` service worker

### Testing Requirements
- Run `npm test` (vitest) to run unit tests
- Run `npm run build` to verify no TypeScript/build errors
- Run `npm run dev` and test the full user flow: intro → birth input → questions → loading → results

### Common Patterns
- All UI is in a single large React component (`SajuApp.tsx`, ~3760 lines)
- Saju calculation logic is pure TypeScript (no external saju libraries)
- AI prompts are built from structured templates with RAG-style classical reference injection
- Streaming API responses via `ReadableStream` in the API route
- Screen navigation via `currentScreen` state (0-9), mode via `appMode` state
- Payment: Toss Payments SDK (client) + REST API confirm (server), abstract `PaymentProvider` pattern
- Legal pages: privacy, terms, refund — all use `BUSINESS_INFO` from `payment-config.ts`
- Image export: `html2canvas` for image sharing

## Dependencies

### External
- `next` ^16.2.0 — React framework with App Router
- `react` / `react-dom` ^19.2.4 — UI library
- `openai` ^6.32.0 — OpenAI API client for GPT-4o-mini streaming
- `@tosspayments/tosspayments-sdk` ^2.6.0 — Toss Payments SDK for payment processing
- `html2canvas` ^1.4.1 — Screenshot/image capture for result sharing
- `typescript` ^5.9.3 — Type safety

### Dev Dependencies
- `vitest` ^4.1.0 — Test runner
- `@testing-library/react` ^16.3.2 — React component testing
- `jsdom` ^29.0.1 — DOM environment for tests

<!-- MANUAL: -->
