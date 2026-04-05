<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-22 | Updated: 2026-04-05 -->

# saju

## Purpose
API route that proxies Saju reading requests to OpenAI GPT-4o-mini with streaming responses.

## Key Files

| File | Description |
|------|-------------|
| `route.ts` | POST handler — accepts `{ prompt, maxTokens, lang }`, streams GPT-4o-mini response back as `text/plain` |

## For AI Agents

### Working In This Directory
- Uses `openai` SDK with `process.env.OPENAI_API_KEY`
- System prompt is defined **inline** in this file (SYSTEM_KO / SYSTEM_EN), NOT imported from saju-prompt.ts
- The client-side prompt builder (`saju-prompt-builder.ts`) constructs the detailed saju prompt separately
- `lang` parameter selects Korean (반말 persona) or English system prompt
- Response is a `ReadableStream` with `TextEncoder` — chunked text streaming
- Model: `gpt-4o-mini`, Temperature: `0.4`
- Default `max_tokens` is `4096` (capped at 4096)
- `maxDuration = 60` for Vercel serverless function timeout
- Input validation: prompt required, max 50K chars
- Error handling: 401 (invalid key), 429 (rate limit), insufficient_quota, generic errors

### Testing Requirements
- Requires valid `OPENAI_API_KEY` in `.env.local`
- Test with POST request containing `{ prompt: "test", maxTokens: 100, lang: "ko" }`
- Verify streaming works (response arrives in chunks, not all at once)

### Common Patterns
- Streaming pattern: `for await (const chunk of stream)` → `controller.enqueue(encoder.encode(text))`

## Dependencies

### Internal
- None — system prompts are defined inline

### External
- `openai` SDK — GPT-4o-mini chat completions with streaming

<!-- MANUAL: -->
