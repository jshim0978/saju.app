<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-22 | Updated: 2026-03-22 -->

# app

## Purpose
Next.js App Router directory containing the root layout, home page, global styles, and API routes for the Saju application.

## Key Files

| File | Description |
|------|-------------|
| `layout.tsx` | Root HTML layout — sets `lang="ko"`, loads Google Fonts (Noto Sans KR, Gamja Flower, Gowun Dodum), metadata for SEO |
| `page.tsx` | Home page — renders `<SajuApp />` component |
| `globals.css` | ~820 lines of global CSS — dark cosmic theme with glassmorphism, star animations, pillar grids, paywall UI, responsive styles |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `api/` | Backend API routes (see `api/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- `layout.tsx` uses external Google Fonts via `<link>` tag (not `next/font`)
- `globals.css` defines CSS custom properties (`--primary`, `--bg1`, etc.) and all component styles globally
- The page is a thin wrapper that delegates to `SajuApp` component
- Dark theme with gold/pink accents: `#0A0E2A` background, `#F0C75E` primary

### Testing Requirements
- Verify fonts load correctly in browser
- Check responsive behavior at `max-width: 380px` breakpoint

### Common Patterns
- CSS uses glassmorphism: `backdrop-filter: blur()`, semi-transparent backgrounds
- Element-specific color classes: `.elem-wood`, `.elem-fire`, `.elem-earth`, `.elem-metal`, `.elem-water`
- Animations: `twinkle`, `fadeIn`, `heartBeat`, `spin`, `pulse`

<!-- MANUAL: -->
