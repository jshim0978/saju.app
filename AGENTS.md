<!-- Generated: 2026-03-22 | Updated: 2026-03-22 -->

# saju-app

## Purpose
A Korean fortune-telling (사주/Saju) web application built with Next.js. Users enter their birth date/time and personal preferences, then receive AI-generated Saju readings powered by GPT-4o via streaming API. Supports multiple modes: personal Saju analysis (30 items), compatibility analysis, 2026 yearly fortune, and pregnancy mode.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | Dependencies: Next.js 16, React 19, OpenAI SDK, TypeScript |
| `next.config.ts` | Next.js configuration (minimal/default) |
| `tsconfig.json` | TypeScript config with `@/*` path alias to `./src/*` |
| `.env.local` | Environment variables (contains `OPENAI_API_KEY`) |
| `next-env.d.ts` | Next.js TypeScript type definitions |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/` | Application source code (see `src/AGENTS.md`) |
| `public/` | Static assets directory (currently empty) |

## For AI Agents

### Working In This Directory
- This is a Next.js 16 app with App Router (`src/app/`)
- Uses `@/*` path alias mapping to `./src/*`
- Korean language is primary (`lang="ko"`) with English i18n support
- OpenAI GPT-4o is used for AI readings via streaming responses
- **Do not commit `.env.local`** — it contains the OpenAI API key

### Testing Requirements
- Run `npm run build` to verify no TypeScript/build errors
- Run `npm run dev` and test the full user flow: intro → birth input → questions → loading → results

### Common Patterns
- All UI is in a single large React component (`SajuApp.tsx`)
- Saju calculation logic is pure TypeScript (no external saju libraries)
- AI prompts are built from structured templates with RAG-style reference injection
- Streaming API responses via `ReadableStream` in the API route

## Dependencies

### External
- `next` ^16.2.0 — React framework with App Router
- `react` / `react-dom` ^19.2.4 — UI library
- `openai` ^6.32.0 — OpenAI API client for GPT-4o streaming
- `typescript` ^5.9.3 — Type safety

<!-- MANUAL: -->
