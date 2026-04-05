# Open Questions

## comprehensive-testing-and-mobile-fix - 2026-04-04

- [ ] Should dangerouslySetInnerHTML sanitization be added as part of this plan, or deferred to a security hardening pass? — formatLLMText outputs raw HTML; XSS risk if AI response is malicious
- [ ] Should the "2026" hardcoded year in save type (line ~1710) be fixed as part of CSS/test work, or tracked separately? — It is a logic bug, not a test or CSS issue
- [ ] Should Playwright visual regression tests be added alongside the jsdom tests for mobile? — jsdom cannot truly verify visual layout; Playwright would catch overflow/clipping bugs
- [ ] Should compatibility mode missing gender input and pregnancy mode missing birth time be added as bugs-to-fix, or only as tests-that-document-known-gaps? — Tests can assert current behavior vs. desired behavior
- [ ] Is the free preview text in compatibility mode (lines 2260-2264) intentionally a hardcoded teaser, or is it a bug that shows real data before payment? — Affects how paywall tests should assert behavior
