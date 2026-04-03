<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-22 | Updated: 2026-03-22 -->

# components

## Purpose
React UI components for the Saju application. Currently contains a single large monolithic component that handles the entire user interface.

## Key Files

| File | Description |
|------|-------------|
| `SajuApp.tsx` | Main application component (~2000+ lines) — manages all screens: intro, birth input, questions, loading, results, compatibility, pregnancy mode, yearly fortune. Includes SVG star background generation, localStorage persistence, and streaming AI response display |

## For AI Agents

### Working In This Directory
- `SajuApp.tsx` is a `'use client'` component with extensive `useState`/`useEffect`/`useCallback`/`useMemo` usage
- The component manages a multi-step wizard flow via `step` state variable
- Multiple modes: `saju` (main reading), `compat` (compatibility), `yearly` (2026 fortune), `preg` (pregnancy)
- SVG star background is generated procedurally with 4/5/6/8-point star paths
- AI results are streamed via `fetch` to `/api/saju` and displayed progressively
- User data and results are persisted to `localStorage`
- i18n is handled via `t(key, lang)` function from `@/lib/i18n`

### Testing Requirements
- Test all wizard steps: intro → birth input → 5 questions → loading → results
- Test lunar calendar toggle and time selection (12 시주 options)
- Test compatibility mode (2 people input)
- Test result saving/loading from localStorage
- Test language toggle (Korean/English)

### Common Patterns
- Imports all Saju calculation functions from `@/lib/saju-calc`
- Builds AI prompts via `buildSajuPrompts()` from `@/lib/saju-prompt-builder`
- Uses `getRelevantRefs()` for RAG-style reference injection into prompts
- CSS classes reference globals from `globals.css` (no CSS modules)

## Dependencies

### Internal
- `@/lib/saju-calc` — Saju calculation engine (heavenly stems, earthly branches, five elements)
- `@/lib/saju-prompt-builder` — Constructs structured prompts for GPT-4o
- `@/lib/saju-prompt` — `UserData` type definition
- `@/lib/saju-ref-selector` — RAG reference selection for prompt enrichment
- `@/lib/lunar-solar` — Lunar-to-solar calendar conversion
- `@/lib/i18n` — Internationalization (Korean/English)

<!-- MANUAL: -->
