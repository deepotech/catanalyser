# CatAnalyzer.com — Production AI Cat Intelligence Platform

CatAnalyzer is a production-grade AI platform designed to help pet owners understand their cats through transparent, science-grounded phenotypic breed identification and bioacoustic sound interpretation.

---

## 1. Architectural Highlights

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Lucide Icons + Custom Brand Design Tokens
- **AI Engine Layer**: Pluggable server-side architecture supporting **OpenRouter**, **Google Gemini**, and offline development **Mock**.
- **Security & Privacy**:
  - Zero application disk retention of uploaded photos or audio.
  - MIME type and binary magic-byte verification (`FF D8 FF` for JPEG, `89 50 4E 47` for PNG, `RIFF...WEBP` for WebP, and audio RIFF/ID3 headers).
  - Strict Content-Security-Policy, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and restricted `Permissions-Policy`.
- **Distributed Rate Limiting**:
  - Production-ready Upstash Redis REST pipeline adapter.
  - Automatic graceful fallback to sliding-window in-memory limiter with honest degraded status reporting.
- **Observability**:
  - Sanitized structured JSON telemetry (zero leakage of media buffers, user prompts, or secrets).
  - Standardized error categorization (timeouts, quota, auth, validation).
- **SEO & Organic Growth**:
  - Complete 16-breed directory (`/cat-breeds`) with visual trait checklists, grooming guides, and Schema.org `FAQPage` / `CollectionPage`.
  - Side-by-side comparison hub (`/compare`) with 10 high-intent curated comparison pairs.
  - Dynamic `sitemap.xml` and `robots.txt` blocking `/api/`.

---

## 2. Environment Variables & Configuration

Configure `.env.local` for local execution. In production (e.g. Vercel), set these in the dashboard:

| Variable Name | Required? | Allowed Values / Purpose |
|---|---|---|
| `NODE_ENV` | Yes | `development`, `test`, `production` |
| `AI_PROVIDER` | Yes | `openrouter`, `gemini`, or `mock` (prod requires real provider) |
| `OPENROUTER_API_KEY` | If openrouter | Server-side API key from https://openrouter.ai/keys |
| `OPENROUTER_MODEL` | Optional | Default: `google/gemini-2.5-flash` |
| `GEMINI_API_KEY` | If gemini | Server-side API key from Google AI Studio |
| `GEMINI_MODEL` | Optional | Default: `gemini-2.5-flash` |
| `UPSTASH_REDIS_REST_URL`| Optional | Upstash Redis REST URL (enables multi-instance distributed rate limiting) |
| `UPSTASH_REDIS_REST_TOKEN`| Optional | Upstash Redis REST Token |
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical URL (e.g. `https://catanalyzer.com`) |
| `AI_MAX_IMAGE_MB` | Optional | Default: `10` |
| `AI_MAX_AUDIO_MB` | Optional | Default: `10` |
| `AI_MAX_AUDIO_SECONDS` | Optional | Default: `15` |
| `AI_REQUEST_TIMEOUT_MS`| Optional | Default: `20000` |
| `RATE_LIMIT_MAX_REQUESTS`| Optional | Default: `10` |
| `RATE_LIMIT_WINDOW_SECONDS`| Optional | Default: `60` |

---

## 3. Provider Switching & Safety Guardrails

Provider resolution is strictly **server-side**:

```
Client Request
      ↓
/api/identify-breed or /api/translate-cat
      ↓
Rate Limiter Check (Upstash Redis or In-Memory fallback)
      ↓
Size & Magic Byte Validation
      ↓
AI Provider Factory (Reads AI_PROVIDER)
      ↓
   ┌────────────────────────────────────────┐
   │ AI_PROVIDER=openrouter  → OpenRouter   │
   │ AI_PROVIDER=gemini      → Gemini API   │
   │ AI_PROVIDER=mock        → Mock Provider│
   └────────────────────────────────────────┘
```

> **CRITICAL PRODUCTION SAFETY RULE**:
> In production, the system will **NEVER** silently fall back to Mock if a real provider fails. If OpenRouter or Gemini encounters an outage, a controlled, user-friendly error is returned. Synthetic Mock responses are returned **only** when `AI_PROVIDER=mock` is explicitly declared.

---

## 4. Local Development

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env.local

# 3. Start local development server
pnpm dev

# 4. Build for production
pnpm build
pnpm start
```

---

## 5. Testing & Validation

The repository includes a comprehensive, multi-tiered test suite:

```bash
# Run Phase 5 launch readiness test suite (52 tests)
node tests/test_phase5.mjs

# Run Phase 6 production launch & observability test suite
node tests/test_phase6.mjs

# Run repeatable AI smoke test harness (supports MOCK and REAL modes)
node tests/ai_smoke_test.mjs --mode=REAL
node tests/ai_smoke_test.mjs --mode=MOCK
```

---

## 6. Privacy & Data Handling Model

1. **CatAnalyzer Storage**: We do **not** intentionally persist uploaded photos or audio recordings in application databases or local storage disks.
2. **Third-Party AI Inference**: Media is passed over TLS/HTTPS in transient memory to the active provider (OpenRouter or Google Gemini) strictly for the duration of inference.
3. **Telemetry**: Only high-level event telemetry and anonymized operational metadata (latency, status, error category) are tracked. No raw user media or AI output is transmitted to analytics.

For details, view the in-app policies at `/privacy`, `/terms`, and `/ai-disclaimer`.
