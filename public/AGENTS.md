<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-05 | Updated: 2026-04-05 -->

# public

## Purpose
Static assets served at the root URL. Includes PWA configuration and the app icon.

## Key Files

| File | Description |
|------|-------------|
| `favicon.svg` | App icon — SVG format star/constellation design |
| `manifest.json` | PWA manifest — app name "별빛 사주", theme color `#0A0E2A`, display standalone |
| `sw.js` | Service worker for PWA offline/caching support |

## For AI Agents

### Working In This Directory
- Files are served as-is at `/favicon.svg`, `/manifest.json`, `/sw.js`
- `manifest.json` is referenced in both `layout.tsx` `<link>` tag and `metadata.manifest`
- Theme color `#0A0E2A` must match `layout.tsx` viewport themeColor

<!-- MANUAL: -->
