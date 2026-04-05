<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-22 | Updated: 2026-04-05 -->

# src

## Purpose
Contains all application source code: the Next.js App Router pages/API, the main React component, and the core Saju calculation and prompt-building library.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js App Router: layout, page, API routes (see `app/AGENTS.md`) |
| `components/` | React UI components (see `components/AGENTS.md`) |
| `lib/` | Core business logic: Saju calculations, prompt building, i18n (see `lib/AGENTS.md`) |
| `__tests__/` | Root-level sanity tests (`sanity.test.ts`) |

## For AI Agents

### Working In This Directory
- Use `@/` import alias (maps to `./src/`)
- The app follows a clear separation: `lib/` = pure logic, `components/` = UI, `app/` = routing/API
- All files are TypeScript (`.ts` or `.tsx`)

<!-- MANUAL: -->
