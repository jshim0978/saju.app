<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-05 | Updated: 2026-04-05 -->

# payment

## Purpose
Server-side payment confirmation API. Validates payment data and calls Toss Payments confirm API to finalize transactions.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `confirm/` | POST endpoint for payment confirmation |

## Key Files

| File | Description |
|------|-------------|
| `confirm/route.ts` | POST handler — accepts `{ paymentKey, orderId, amount }`, validates amount against known `PRODUCTS`, calls Toss confirm API with Basic auth (`TOSS_SECRET_KEY`), returns order summary or error |

## For AI Agents

### Working In This Directory
- `TOSS_SECRET_KEY` is server-only (never expose to client)
- Amount validation: checks `amount` matches a known product price from `PRODUCTS` array — prevents price tampering
- Toss API auth: `Basic` + base64(`secretKey + ":"`)
- TODO: order persistence to database is not yet implemented (see TODO comment in route.ts)
- Error responses are in Korean

### Testing Requirements
- Test with valid payment triplet (paymentKey, orderId, amount)
- Test with mismatched amount (should reject)
- Test with missing fields (should return 400)
- Requires `TOSS_SECRET_KEY` in `.env.local`

### Common Patterns
- `NextResponse.json()` for structured JSON responses
- Toss API URL: `https://api.tosspayments.com/v1/payments/confirm`

## Dependencies

### Internal
- `@/lib/payment-config` — `PRODUCTS` array for amount validation

### External
- Toss Payments REST API (server-to-server, no SDK needed)

<!-- MANUAL: -->
