<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-22 | Updated: 2026-03-22 -->

# saju

## Purpose
API route that proxies Saju reading requests to OpenAI GPT-4o with streaming responses.

## Key Files

| File | Description |
|------|-------------|
| `route.ts` | POST handler — accepts `{ prompt, maxTokens }`, streams GPT-4o response back as `text/plain` |

## For AI Agents

### Working In This Directory
- Uses `openai` SDK with `process.env.OPENAI_API_KEY`
- System prompt is imported from `@/lib/saju-prompt` (`SAJU_SYSTEM_PROMPT`)
- Response is a `ReadableStream` with `TextEncoder` — chunked text streaming
- Temperature is set to `0.4` for consistent but creative readings
- Default `max_tokens` is `10000`; caller can override via `maxTokens` body param
- Error responses return Korean error messages with status 500

### Testing Requirements
- Requires valid `OPENAI_API_KEY` in `.env.local`
- Test with POST request containing `{ prompt: "test", maxTokens: 100 }`
- Verify streaming works (response arrives in chunks, not all at once)

### Common Patterns
- Streaming pattern: `for await (const chunk of stream)` → `controller.enqueue(encoder.encode(text))`

## Dependencies

### Internal
- `@/lib/saju-prompt` — provides `SAJU_SYSTEM_PROMPT` constant

### External
- `openai` SDK — GPT-4o chat completions with streaming

<!-- MANUAL: -->
