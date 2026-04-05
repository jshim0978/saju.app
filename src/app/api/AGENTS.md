<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-22 | Updated: 2026-04-05 -->

# api

## Purpose
Container directory for Next.js API route handlers — Saju AI readings and payment processing.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `saju/` | Saju AI reading API endpoint (see `saju/AGENTS.md`) |
| `payment/` | Payment confirmation API (see `payment/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- All API routes use Next.js App Router conventions (`route.ts` with exported HTTP method handlers)
- `saju/route.ts` returns streaming `ReadableStream` (text/plain), `payment/confirm/route.ts` returns JSON via `NextResponse.json()`
- Server-only secrets (`OPENAI_API_KEY`, `TOSS_SECRET_KEY`) must never be exposed to the client
- Both routes have input validation and structured error responses

### Testing Requirements
- API routes require valid environment variables in `.env.local`
- Test streaming endpoint with POST + body `{ prompt, maxTokens, lang }`
- Test payment endpoint with POST + body `{ paymentKey, orderId, amount }`

<!-- MANUAL: -->
