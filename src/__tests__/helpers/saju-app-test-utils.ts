/**
 * Shared test utilities for rendering and navigating SajuApp.
 */
import { render, screen, fireEvent, act, waitFor, within } from '@testing-library/react';
import { vi } from 'vitest';
import type { SajuResult } from '@/lib/saju-calc';

// ─── Mock Data Factories ───

export function mockSajuResult(overrides?: Partial<SajuResult>): SajuResult {
  return {
    yStem: 0, yBranch: 0,
    mStem: 2, mBranch: 2,
    dStem: 4, dBranch: 4,
    hStem: 6, hBranch: 6,
    sajuYear: 1995, sajuMonthIdx: 0,
    ...overrides,
  };
}

export function mockUserData(overrides?: Record<string, unknown>) {
  return {
    name: '테스트', gender: 'm',
    year: 1995, month: 3, day: 15, hour: 5,
    concern: 0, state: 0,
    personality: [0, 0, 0],
    relationship: 0, wantToKnow: 0,
    ...overrides,
  };
}

// ─── localStorage Mock ───

export function createLocalStorageMock(initial: Record<string, string> = {}) {
  const store: Record<string, string> = { ...initial };
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
    _store: store, // for test inspection
  };
}

/**
 * Sets up localStorage mock. Call in beforeEach.
 * @param consent - if true, pre-accept storage consent
 * @param stars - initial star balance (default 10)
 */
export function setupLocalStorage(options: { consent?: boolean; stars?: number; profiles?: unknown[]; savedResults?: unknown[] } = {}) {
  const initial: Record<string, string> = {};
  if (options.consent) initial['saju-storage-consent'] = 'yes';
  if (options.stars !== undefined) initial['saju-stars'] = String(options.stars);
  if (options.profiles) initial['saju-profiles'] = JSON.stringify(options.profiles);
  if (options.savedResults) initial['saju-saved-results'] = JSON.stringify(options.savedResults);
  const mock = createLocalStorageMock(initial);
  Object.defineProperty(window, 'localStorage', { value: mock, writable: true, configurable: true });
  return mock;
}

// ─── Streaming Fetch Mock ───

/**
 * Creates a mock fetch that returns a ReadableStream with the given text.
 * Compatible with the app's `res.body.getReader()` pattern.
 */
export function mockStreamingFetch(text: string) {
  const encoded = new TextEncoder().encode(text);
  return vi.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' }),
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(encoded);
          controller.close();
        },
      }),
    } as Response)
  );
}

// ─── Render Helper ───

export async function renderSajuApp(options: { consent?: boolean; stars?: number } = {}) {
  const storageMock = setupLocalStorage(options);
  const fetchMock = mockStreamingFetch('테스트 AI 응답');
  global.fetch = fetchMock;

  // Dynamic import to ensure mocks are in place before module loads
  const { default: SajuApp } = await import('@/components/SajuApp');

  let result: ReturnType<typeof render>;
  await act(async () => {
    result = render(SajuApp());
  });

  // Wait for useEffect hydration (hasMounted)
  await act(async () => {
    await new Promise(r => setTimeout(r, 0));
  });

  return { result: result!, storageMock, fetchMock };
}

// ─── Navigation Helpers ───

/**
 * Accepts the consent banner by clicking the Accept button.
 */
export async function acceptConsent() {
  // Consent banner shows after hasMounted, wait for it
  const acceptBtn = await waitFor(() => screen.getByText('동의'));
  await act(async () => {
    fireEvent.click(acceptBtn);
  });
}

/**
 * Fills in birth data on screen 1 and clicks Next to go to screen 2.
 */
export async function fillBirthInput(data?: { name?: string }) {
  const nameInput = screen.getByPlaceholderText(/이름을 입력/i);
  if (data?.name) {
    fireEvent.change(nameInput, { target: { value: data.name } });
  }
  // Click Next
  const nextBtn = screen.getByText('다음');
  await act(async () => {
    fireEvent.click(nextBtn);
  });
}

/**
 * Clicks through question steps. Assumes we're on screen 2.
 */
export async function completeQuestions() {
  for (let step = 0; step < 4; step++) {
    // On last step, button text is different
    const btnText = step < 3 ? '다음' : '결과 보기';
    const btn = screen.getByText(btnText);
    await act(async () => {
      fireEvent.click(btn);
    });
  }
}

// Re-export testing library for convenience
export { render, screen, fireEvent, act, waitFor, within };
