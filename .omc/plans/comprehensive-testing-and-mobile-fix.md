# Comprehensive Testing & Mobile Responsiveness Plan

**Date:** 2026-04-04
**Status:** PENDING APPROVAL
**Complexity:** HIGH
**Scope:** 11 new test files, ~100+ new tests, CSS mobile fixes

---

## RALPLAN-DR Summary

### Principles
1. **Test behavior, not implementation** - Tests assert what the user sees/experiences, not internal state
2. **Bug-catching over coverage** - Every test should catch a real class of bug (regression, edge case, integration failure)
3. **Minimal mocking** - Mock only external boundaries (fetch, localStorage), render real components
4. **Parallel-safe** - All test files are independent, can be authored and run by parallel agents
5. **Mobile-first verification** - Responsiveness tests use concrete viewport assertions, not visual inspection

### Decision Drivers
1. **No UI tests exist today** - All 90 existing tests are pure logic; zero coverage for the 10 render functions in SajuApp.tsx
2. **Monolithic component** - SajuApp.tsx is 3506 lines with 10 render functions; tests must work against the monolith since refactoring is out of scope
3. **Known bugs in audit** - Free preview bypasses paywall, no input validation on compat/pregnancy, dangerouslySetInnerHTML without sanitization, loading back-button race condition

### Options Considered

**Option A: Test the monolith directly with @testing-library/react (CHOSEN)**
- Pros: No refactoring needed, tests catch real integration bugs, tests remain valid after future refactoring
- Cons: Render setup is heavier (must mock localStorage, fetch), some screens need state setup via UI interaction chains

**Option B: Extract sub-components first, then test**
- Pros: Cleaner test setup, smaller render surface per test
- Cons: Massive refactoring effort (3500-line file), high risk of introducing regressions, delays testing by days
- INVALIDATED: User explicitly said "stop fixing one-by-one" -- refactoring the monolith is out of scope. Tests come first.

### ADR
- **Decision:** Test the monolith SajuApp.tsx directly using @testing-library/react with screen-level test files
- **Drivers:** Zero UI test coverage, known bugs, user wants TDD to prevent regressions
- **Alternatives considered:** Extract-then-test (invalidated due to scope/risk)
- **Why chosen:** Fastest path to comprehensive coverage; tests survive future refactoring; catches integration bugs that unit tests miss
- **Consequences:** Test setup requires a shared helper to mock localStorage/fetch and navigate to specific screens; tests may be slower than pure unit tests
- **Follow-ups:** After tests are green, monolith can be safely decomposed with tests as safety net

---

## Context

- **Tech:** Next.js 16, React 19, Vitest + jsdom, TypeScript, @testing-library/react 16.3
- **Component:** SajuApp.tsx at src/components/SajuApp.tsx (3506 lines, 10 render functions, screens 0-9)
- **Existing tests:** 6 files, ~90 tests (all pure logic: saju-calc, prompt-builder, ref-selector, i18n, lunar-solar, sanity)
- **Screen map:** 0=Intro, 1=BirthInput, 2=Questions, 3=Loading, 4=Results, 5=Compat, 6=Pregnancy, 7=YearlyFortune, 8=Teaser, 9=ChargeScreen
- **State gating:** Consent banner blocks all screens until accepted; localStorage reads gated by `safeSetItem`

---

## Work Objectives

1. Create 11 new test files covering all untested UI features (7+ tests each)
2. Fix mobile responsiveness issues in globals.css
3. Add a shared test helper for SajuApp rendering
4. Achieve comprehensive regression coverage for all known audit bugs

---

## Guardrails

### Must Have
- Every test file has 7+ tests
- Tests use @testing-library/react queries (getByText, getByRole, queryByText)
- Tests verify user-visible behavior (text, navigation, button states)
- All tests pass with `vitest run`
- Mobile CSS fixes target 320px-428px viewports

### Must NOT Have
- No refactoring of SajuApp.tsx (tests only, CSS fixes only)
- No snapshot tests (they catch nothing useful)
- No tests that depend on CSS class names for assertions (fragile)
- No new dependencies beyond what is already installed

---

## Task Flow (Execution Order)

### Phase 0: Test Infrastructure (prerequisite for all UI tests)

**File A:** `vitest.config.ts` — Add `setupFiles: ['./src/__tests__/helpers/vitest-setup.ts']`

**File B:** `src/__tests__/helpers/vitest-setup.ts` — Global stubs:
- `navigator.serviceWorker` → `{ register: vi.fn(() => Promise.resolve()) }`
- `window.matchMedia` → returns `{ matches: false, addListener: vi.fn(), removeListener: vi.fn() }`
- `URL.createObjectURL` → `vi.fn(() => 'blob:mock')`
- `URL.revokeObjectURL` → `vi.fn()`
- `navigator.share` → `vi.fn()`
- `HTMLCanvasElement.prototype.getContext` → minimal mock

**File C:** `src/__tests__/helpers/saju-app-test-utils.ts` — Shared test utilities:
- Mocks `localStorage` (with consent pre-accepted or not, configurable)
- `mockStreamingFetch(text: string)` factory → returns `{ ok: true, body: new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode(text)); c.close(); } }) }`
- Provides `renderSajuApp()` that renders `<SajuApp />` with jsdom
- Navigation helpers:
  - `acceptConsent()` — clicks Accept on consent banner
  - `navigateToScreen(n, appMode?)` — KEY: `appMode` ('saju'|'compat'|'pregnancy'|'yearly') affects which feature card is clicked and which screens are visited
    - Screens 0-2: clicks through UI (birth input → questions)
    - Screen 5 (compat): clicks compat feature card from screen 0 → goes directly to screen 5
    - Screen 6 (pregnancy): clicks pregnancy feature card from screen 0 → goes directly to screen 6
    - Screen 7 (yearly): clicks yearly feature card from screen 0 → goes to screen 1 (birth input, appMode='yearly') → must go through full flow (1→2→3→8→7)
    - Screens 3-4 (saju): requires `mockStreamingFetch` + `vi.useFakeTimers()` to skip loading delays
    - Screen 8 (teaser): same as screen 4 flow but stops at teaser before unlock
    - Screen 9 (charge): clicks star charge button in header nav
- Mock object factories:
  - `mockSajuResult()` → `{ yStem: 0, yBranch: 0, mStem: 2, mBranch: 2, dStem: 4, dBranch: 4, hStem: 6, hBranch: 6, sajuYear: 1995, sajuMonthIdx: 0 }`
  - `mockUserData()` → `{ name: '테스트', gender: 'm', year: 1995, month: 3, day: 15, hour: 5, concern: 0, state: 0, personality: [0, 0, 0], relationship: 0, wantToKnow: 0 }`
  - `mockProfile()` → SavedProfile matching mockUserData fields

**NOTE on mocking:** Screens 3+ require extensive boundary mocking (fetch + ReadableStream + timers + localStorage). This is acknowledged as necessary — the "minimal mocking" principle applies to avoiding mocking of internal React state/functions, NOT external boundaries.

**Acceptance criteria:**
- Importing helper does not fail
- `renderSajuApp()` renders the intro screen without errors
- `acceptConsent()` dismisses the consent banner
- `mockStreamingFetch('test')` returns a valid Response-like object

---

### Phase 1: Pure Logic Test Gaps (parallel, independent files)

#### 1A. saju-ref-selector — ALREADY MEETS 7+ (8 tests exist). SKIP or add edge cases only if valuable.

#### 1B. Expand lunar-solar tests (currently 6, need 7+)
**File:** `src/lib/__tests__/lunar-solar.test.ts` (extend existing)

Add 1+ test:
1. Year outside table range (e.g., 2020) uses fallback calculation

**Acceptance:** File has 7+ passing tests.

---

### Phase 2: UI Feature Tests (parallel, each file is independent)

#### 2A. Consent Banner Tests
**File:** `src/__tests__/consent-banner.test.tsx`

Tests (7):
1. Banner appears on first render (no localStorage consent)
2. Banner does NOT appear when consent already in localStorage
3. Clicking "Accept" sets localStorage and hides banner
4. Clicking "Decline" hides banner but does NOT set localStorage
5. Banner blocks interaction with app behind it (z-index 99999, full overlay)
6. Banner shows correct text in Korean (default lang)
7. Hydration safety: banner only renders after `hasMounted` is true (no SSR mismatch)

**Acceptance:** 7 passing tests. Specifically catches the hydration bug that was just fixed.

#### 2B. Birth Input Form Tests
**File:** `src/__tests__/birth-input.test.tsx`

Tests (8):
1. Renders name input, gender toggle, calendar type toggle, date selects, time grid
2. Gender toggle switches between male/female
3. Calendar type toggle switches between solar/lunar
4. Day select adjusts max days when month changes (Feb = 28/29, Apr = 30)
5. Time grid: selecting a time highlights it
6. "Unknown time" option deselects any chosen time
7. Exact time checkbox shows hour/minute selects when checked
8. Next button navigates to question screen (screen 2)

**Acceptance:** 8 passing tests. Catches the date validation bug.

#### 2C. Question Flow Tests
**File:** `src/__tests__/question-flow.test.tsx`

Tests (8):
1. Shows 4 progress dots, first is active
2. Step 0 shows concern options (6 options)
3. Clicking an option selects it (visual feedback)
4. "Next" button advances to step 1
5. "Prev" button goes back to step 0
6. Step 3 (last): button text changes to "view results" (not "next")
7. Completing step 3 triggers profile auto-save to localStorage
8. Back button from step 0 returns to birth input (screen 1)

**Acceptance:** 8 passing tests. Catches the button label bug that was just fixed.

#### 2D. Loading Screen Tests
**File:** `src/__tests__/loading-screen.test.tsx`

Tests (7):
1. Shows loading animation (crystal ball emoji)
2. Shows first loading step text immediately
3. After 1500ms, advances to second loading step
4. After 3000ms, advances to third loading step
5. Back button navigates to questions screen
6. Cleanup: timers are cleared on unmount (no memory leak)
7. Loading steps have "done"/"active" state classes applied correctly

**Acceptance:** 7 passing tests. Uses `vi.useFakeTimers()`.

#### 2E. Results Display Tests
**File:** `src/__tests__/results-display.test.tsx`

Tests (8):
1. Shows four pillars (year, month, day, hour) with stem/branch characters
2. Shows element balance chart (5 elements with counts)
3. Shows day master profile name and description
4. AI text section renders formatted HTML via dangerouslySetInnerHTML
5. Save button stores result to localStorage via safeSetItem
6. Share button exists and is clickable (actual html2canvas/blob chain needs Playwright — jsdom cannot test canvas)
7. Shows yongsin (favorable element) information
8. Translate button toggles between ko/en

**Acceptance:** 8 passing tests. Note: Test 6 verifies button presence and click handler invocation only.

#### 2F. Compatibility Mode Tests
**File:** `src/__tests__/compatibility-mode.test.tsx`

Tests (9):
1. Shows two person input forms (person 1 and person 2)
2. Relationship type selector shows 6 options
3. Changing relationship type resets previous results
4. Name inputs update state correctly
5. Paywall shows star cost of 5 (compat uses 5-star paywall, distinct from 10-star teaser)
6. Sufficient stars (>=5): clicking unlock deducts 5 stars
7. Insufficient stars (<5): shows "not enough stars" message with charge button
8. **Free preview bypass is NOT accessible** — no visible link that calls runCompatAnalysis() without star deduction (catches audit bug at line 2270)
9. Changing any person data resets analysis results (compatKey mechanism)
10. Back button returns to intro screen

**Acceptance:** 9 passing tests. Catches the free preview bypass bug.

#### 2G. Pregnancy Mode Tests
**File:** `src/__tests__/pregnancy-mode.test.tsx`

Tests (7):
1. Shows mother data input (name, year, month, day, hour)
2. Shows due date inputs (year, month, day)
3. Due date day adjusts when month changes (same as birth input validation)
4. Back button returns to intro screen
5. Analysis button triggers fetch
6. Results display formatted AI text
7. Save button stores pregnancy result to localStorage

**Acceptance:** 7 passing tests.

#### 2H. Star Balance / Teaser Paywall Tests
**File:** `src/__tests__/star-paywall.test.tsx`

NOTE: This tests the TEASER paywall (screen 8, 10-star cost) for main saju/yearly readings. The compat paywall (5-star cost) is tested in 2F.

Tests (9):
1. First visit: initializes 10 free stars in localStorage (only after consent)
2. Star balance displays correctly in header navigation
3. Teaser screen shows star cost of 10
4. With 10+ stars: unlock button is active and clickable
5. Clicking unlock deducts 10 stars and navigates to results (screen 4 for saju, screen 7 for yearly)
6. With <10 stars: unlock button shows reduced opacity / not enough message
7. Charge button navigates to charge screen (screen 9)
8. **Free preview bypass is NOT accessible** — verify no visible link/button that calls `setTeaserUnlocked(true)` without star deduction (catches audit bug at line 3306)
9. Star balance persists across re-renders (reads from localStorage)

**Acceptance:** 9 passing tests.

#### 2I. Profile System Tests
**File:** `src/__tests__/profile-system.test.tsx`

Tests (7):
1. No profiles initially: profile section not shown on birth input
2. After completing questions, profile auto-saved to localStorage
3. Saved profile appears as clickable button on birth input screen
4. Clicking profile loads all user data (name, gender, year, month, day, hour, etc.)
5. Duplicate profiles (same name+date) update instead of creating new
6. Max 10 profiles (oldest trimmed via slice(-10))
7. Profiles persist across component re-mount

**Acceptance:** 7 passing tests.

#### 2J. Mobile Responsiveness Tests (DOM structure only)
**File:** `src/__tests__/mobile-responsiveness.test.tsx`

**IMPORTANT:** jsdom cannot compute CSS layouts, evaluate media queries, or verify overflow. These tests assert DOM structure, CSS class presence, and inline styles ONLY. Layout assertions (actual overflow, column counts, computed widths) require Playwright and are out of scope for this phase.

Tests (7):
1. App container div has className `app-container` (CSS applies max-width)
2. Consent banner overlay has `position: fixed` and `inset: 0` inline styles
3. All `.btn` elements in birth input have `minHeight` style or CSS class for 48px touch target
4. Time grid renders 12 time option elements (structure is correct for CSS grid to lay out)
5. Feature cards: 4 cards exist with correct CSS class `feature-card`
6. Date select-row elements exist with appropriate structure (3 selects: year/month/day)
7. AI text section has appropriate wrapper div for CSS styling

**TODO (Playwright, future phase):**
- Verify no horizontal scroll at 320px
- Verify media query breakpoints apply correctly
- Verify actual computed touch target sizes
- Visual regression screenshots at 320px/375px/428px

**Acceptance:** 7 passing tests (DOM structure assertions).

---

#### 2K. Charge Screen Tests (screen 9)
**File:** `src/__tests__/charge-screen.test.tsx`

Tests (7):
1. Charge screen renders with star balance display
2. Shows at least 2 purchase options with star amounts and prices
3. Purchase button shows test mode alert (current implementation)
4. After purchase, star balance increases by correct amount
5. Updated star balance persists to localStorage
6. Back button returns to previous screen
7. No overlapping badges — each option shows at most one badge element at top-right

**Acceptance:** 7 passing tests.

---

### Phase 3: Mobile CSS Fixes
**File:** `src/app/globals.css`

Fixes needed (based on audit + existing media queries analysis):

1. **Add missing media query for 375px** (iPhone SE/Mini) - currently jumps from 480px to 340px
2. **Fix select-row overflow** - `.select-row` needs `flex-wrap: wrap` or reduced gap at small widths
3. **Fix pillar-grid text size** - Hanja characters too small on 320px; increase font-size in `@media (max-width: 480px)`
4. **Fix card padding** - `.card` needs reduced padding at 320px (currently no specific override)
5. **Fix option-grid columns** - Question options need `grid-template-columns: 1fr 1fr` at 360px instead of 3-col
6. **Fix button touch targets** - Ensure all `.btn` and `.paywall-cta` have `min-height: 48px` on mobile
7. **Fix exact-time-inputs layout** - Selects overflow at narrow widths; add flex-wrap
8. **Fix llm-text readability** - Increase line-height and font-size in llm sections for mobile

**Acceptance criteria:**
- No horizontal scroll on any screen at 320px viewport width
- All touch targets are 48px minimum
- Text is readable (14px minimum) on all screens at 320px
- Existing desktop layout unchanged

---

## Detailed TODOs by Executor Agent

| # | Task | File(s) | Depends On | Est. Tests |
|---|------|---------|------------|------------|
| 0 | Create test helper utilities | `src/__tests__/helpers/saju-app-test-utils.ts` | None | 0 (infra) |
| 1A | Expand saju-ref-selector tests | `src/lib/__tests__/saju-ref-selector.test.ts` | None | +2 |
| 1B | Expand lunar-solar tests | `src/lib/__tests__/lunar-solar.test.ts` | None | +2 |
| 2A | Consent banner tests | `src/__tests__/consent-banner.test.tsx` | Task 0 | 7 |
| 2B | Birth input form tests | `src/__tests__/birth-input.test.tsx` | Task 0 | 8 |
| 2C | Question flow tests | `src/__tests__/question-flow.test.tsx` | Task 0 | 8 |
| 2D | Loading screen tests | `src/__tests__/loading-screen.test.tsx` | Task 0 | 7 |
| 2E | Results display tests | `src/__tests__/results-display.test.tsx` | Task 0 | 8 |
| 2F | Compatibility mode tests | `src/__tests__/compatibility-mode.test.tsx` | Task 0 | 9 |
| 2G | Pregnancy mode tests | `src/__tests__/pregnancy-mode.test.tsx` | Task 0 | 7 |
| 2H | Star/paywall tests | `src/__tests__/star-paywall.test.tsx` | Task 0 | 8 |
| 2I | Profile system tests | `src/__tests__/profile-system.test.tsx` | Task 0 | 7 |
| 2J | Mobile responsiveness tests | `src/__tests__/mobile-responsiveness.test.tsx` | Task 0 | 7 |
| 3 | Mobile CSS fixes | `src/app/globals.css` | Task 2J | 0 (CSS) |

**Total new tests:** ~80+
**Total after completion:** ~170+ tests across 17 files

---

## Parallelization Strategy

```
Phase 0 (sequential): Task 0 - test helper
Phase 1 (parallel):   Task 1A + 1B (pure logic, no dependency on Task 0)
Phase 2 (parallel):   Tasks 2A-2J (all depend on Task 0, but independent of each other)
Phase 3 (sequential): Task 3 (CSS fixes, after 2J provides the test assertions)
```

Agents can work on Phase 1 and Phase 0 simultaneously. Once Task 0 is done, all Phase 2 tasks can run in parallel across up to 10 agents.

---

## Success Criteria

1. All existing 90 tests still pass (no regressions)
2. 80+ new tests added, all passing
3. Every feature area has 7+ tests
4. Known audit bugs are covered by at least one test each:
   - Consent hydration: Test 2A.7
   - Date validation: Test 2B.4
   - Button label: Test 2C.6
   - Paywall bypass: Tests 2F.6, 2H.3-4
   - Loading back button: Test 2D.5
5. No horizontal scroll at 320px viewport on any screen
6. `vitest run` completes with 0 failures

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| SajuApp.tsx is too large to render in jsdom | Test helper navigates to specific screens; tests only assert visible content |
| fetch mocking for streaming responses is complex | Use simple string response mock; streaming is presentation-only |
| CSS assertions in jsdom are limited | Assert class presence and inline styles; recommend Playwright for visual regression later |
| Some render functions depend on calcSaju results | Test helper provides pre-computed mock SajuResult objects |
