# AI Chat Feature — Setup & Deployment

## Required Environment Variables

Set these in Vercel Dashboard > Project Settings > Environment Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `AI_CHAT_API_KEY` | Yes | Your AI provider API key (e.g., OpenAI). **Never prefix with `NEXT_PUBLIC_`!** |
| `AI_CHAT_API_BASE` | No | API base URL. Default: `https://api.openai.com/v1`. Change for Azure, Anthropic-compatible proxies, etc. |
| `AI_CHAT_MODEL` | No | Model ID. Default: `gpt-4o-mini`. |
| `AI_CHAT_GITHUB_ORG` | No | For GitHub Models org billing/policies, set the org slug (e.g., `my-org`). |
| `AI_CHAT_GITHUB_API_VERSION` | No | GitHub API version header. Default: `2022-11-28`. |

### GitHub Models quick config

If using GitHub Models:

```
AI_CHAT_API_BASE=https://models.github.ai/inference
AI_CHAT_MODEL=openai/gpt-4.1
AI_CHAT_API_KEY=github_pat_...
```

Optional (org-scoped inference path):

```
AI_CHAT_GITHUB_ORG=your-org-slug
```

## Allowed Origins

The API route validates `Origin` / `Referer` headers. Currently allowed:

- `https://unaifly.com`
- `https://www.unaifly.com`
- `http://localhost:3000`
- `http://localhost:3001`

To add more domains, edit `ALLOWED_ORIGINS` in `src/app/api/ai-chat/route.ts`.

## Local Testing

1. Create `.env.local` in the project root:
   ```
   AI_CHAT_API_KEY=sk-your-key-here
   ```

2. Run the dev server:
   ```bash
   bun run dev
   ```

3. Click the purple Bot button (bottom-right floating buttons) to open the AI chat.

4. The chat sends requests to `/api/ai-chat` which runs server-side — your API key stays on the server.

## Vercel Deployment

1. Push code to your Git repo.
2. In Vercel Dashboard, add `AI_CHAT_API_KEY` to Environment Variables.
3. Deploy. The `/api/ai-chat` route runs as a serverless function automatically.

## Architecture

```
Browser (React state) → POST /api/ai-chat → AI Provider (OpenAI, etc.)
                         (Vercel serverless)
```

- API key lives ONLY in server-side env vars
- Chat history stored in React state (browser only, no persistence)
- Streaming SSE responses for real-time UX

## Security Measures

- **API key**: Server-only, never exposed to client
- **Rate limiting**: In-memory per-IP (10 req/min) — best-effort for serverless
- **Hard caps**: 32KB body, 20 messages, 1000 chars/message, 512 output tokens
- **Origin validation**: Only allows configured domains
- **Dedupe**: Rejects identical prompts within 10s from same IP
- **Out-of-scope filter**: Server-side keyword check rejects unrelated topics without calling the LLM
- **System prompt**: Strictly scoped to UNAiFLY business info, forbids revealing secrets/instructions
- **Client cooldown**: 3-second disable after each send

## Limitations of Serverless Rate Limiting

In-memory rate limiting on Vercel serverless has inherent limitations:

- **Cold starts**: Each new serverless instance starts with empty rate counters
- **Multiple instances**: Under load, Vercel may spawn multiple instances, each with its own counters
- **Not distributed**: There's no shared state between instances

This means the rate limiter is **best-effort** — it catches most casual abuse but won't stop a determined attacker with distributed IPs. For production hardening, consider:

- [Vercel KV](https://vercel.com/docs/storage/vercel-kv) for distributed rate limiting
- [Upstash Rate Limit](https://upstash.com/docs/oss/sdks/ts/ratelimit/overview) (Redis-based)
- Vercel's built-in [firewall rules](https://vercel.com/docs/security/vercel-firewall)

## Files

| File | Purpose |
|------|---------|
| `src/app/api/ai-chat/route.ts` | Server route with all security guardrails |
| `src/lib/businessContext.ts` | Verified business info injected into system prompt |
| `src/components/ui/ai-chat-panel.tsx` | AI chat UI component with streaming |
| `src/components/ui/chatbot-bubble.tsx` | Existing FAQ chatbot (unchanged) |
