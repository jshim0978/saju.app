<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-05 | Updated: 2026-04-05 -->

# payment

## Purpose
Payment flow pages for the Toss Payments integration. Handles checkout UI with consent checkboxes, payment success confirmation, and failure handling.

## Key Files

| File | Description |
|------|-------------|
| `page.tsx` | Checkout page — displays product info (AI 사주 해석 1회 이용권, ₩9,900), refund policy, 3 consent checkboxes (product confirmation, digital content notice, terms/privacy agreement), and triggers Toss payment SDK |
| `success/page.tsx` | Payment success page — calls `/api/payment/confirm` to verify with Toss API, displays order summary (order ID, amount, method, date) on success, error message on failure |
| `fail/page.tsx` | Payment failure page — displays error code/message from Toss redirect, provides retry and home navigation |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `success/` | Payment success confirmation page |
| `fail/` | Payment failure display page |

## For AI Agents

### Working In This Directory
- All pages are `'use client'` components
- `success/` and `fail/` pages use `useSearchParams()` wrapped in `<Suspense>` (required by Next.js App Router)
- Payment config (products, business info, refund policy) is centralized in `@/lib/payment-config.ts`
- Toss SDK is loaded dynamically via `@/lib/payment-provider.ts`
- CSS classes (`payment-page`, `payment-card`, `payment-btn`, etc.) are defined in `globals.css`

### Testing Requirements
- Test checkout flow: all 3 checkboxes required before pay button enables
- Test "전체 동의" (select all) toggle
- Test success page with valid/invalid query params
- Test fail page displays error code and message

### Common Patterns
- `useRouter()` for navigation (back, home, retry)
- `BUSINESS_INFO` from payment-config for footer company details
- Inline styles for most layout, CSS classes from globals for themed elements

## Dependencies

### Internal
- `@/lib/payment-config` — `PRODUCTS`, `BUSINESS_INFO`, `REFUND_POLICY`, `TOSS_CLIENT_KEY`, `generateOrderId()`
- `@/lib/payment-provider` — `TossPaymentProvider` class

### External
- `@tosspayments/tosspayments-sdk` — loaded dynamically for payment widget

<!-- MANUAL: -->
