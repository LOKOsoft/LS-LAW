# Configuration

Single source of truth: `src/lib/platform/config/` (`env.ts` reads and
defaults every env var; `app-config.ts` assembles the typed `appConfig`
object every other platform module reads from). Copy `.env.example` to
`.env` and adjust — every var is optional, and the app behaves identically
to before this file existed if none are set.

## Core

| Var | Default | Notes |
|---|---|---|
| `DATABASE_URL` | — (required) | SQLite file URL, e.g. `file:./prisma/dev.db`. Read by the Prisma CLI via `prisma.config.ts`. |
| `DATABASE_FILE_PATH` | `prisma/dev.db` | Overrides the path the app's own Prisma singleton (`lib/db/prisma.ts`) opens directly. Added so integration tests can point at an isolated throwaway DB; also usable to relocate the DB file in a real deployment. |

## Feature flags & providers (`appConfig.features`, `appConfig.providers`)

All optional, all default to the local/mock/no-op behavior:

| Var | Default | Real implementation exists? |
|---|---|---|
| `LEXORA_MULTI_TENANCY_ENABLED` | `false` | No — inert scaffolding only (`lib/platform/tenancy`). |
| `LEXORA_STORAGE_PROVIDER` | `local` | Only `local` (wraps `lib/storage/local-storage.ts`). `s3`/`azure-blob`/`gcs` throw `ProviderNotConfiguredError`. |
| `LEXORA_NOTIFICATION_CHANNELS` | `in-app` | Only `in-app` is real (writes `Notification` rows). `email`/`sms`/`whatsapp`/`push`/`desktop` log to console via a mock channel. Comma-separated to enable more than one. |
| `LEXORA_AI_PROVIDER` | `mock` | Only `mock` (deterministic, offline). `openai`/`anthropic`/`gemini` throw if selected. |
| `LEXORA_PAYMENT_PROVIDER` | `mock` | Only `mock` (in-memory, non-persisted). `stripe`/`razorpay` throw if selected. |
| `LEXORA_CACHE_PROVIDER` | `memory` | Only `memory` (in-process, TTL-based). `redis` throws if selected. |
| `LEXORA_LOG_PROVIDER` | `console` | `cloud` falls back to console with a one-time warning — no real log shipping exists yet. |
| `LEXORA_LOG_LEVEL` | `info` | `debug` \| `info` \| `warn` \| `error`. |

## Regional/branding

| Var | Default |
|---|---|
| `LEXORA_DEFAULT_LOCALE` | `en-IN` |
| `LEXORA_DEFAULT_CURRENCY` | `INR` |
| `LEXORA_DEFAULT_TIMEZONE` | `Asia/Kolkata` |
| `LEXORA_APP_BASE_URL` | `http://localhost:3000` |

Branding (`appConfig.branding`: product name, support email, logo path,
primary color) is currently hardcoded in `app-config.ts` rather than
env-driven — there's exactly one deployment of this app today, so a
config file constant is simpler than plumbing more env vars for a value
that never actually varies yet. Move it to env/DB-backed config if/when
white-labeling for multiple firms becomes real (see
`docs/FUTURE_INTEGRATIONS.md`).

## Future provider credentials

Read (via `env.ts`) but unused by any code path — placeholders so the shape
future integrations need already exists in one place: `STRIPE_SECRET_KEY`,
`RAZORPAY_KEY_ID`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `LEXORA_S3_BUCKET`,
`REDIS_URL`.

## Testing-related env vars

`vitest.config.ts` and `playwright.config.ts` don't add their own env vars;
`DATABASE_FILE_PATH` (above) is set programmatically by
`tests/integration/helpers/test-db.ts`, not meant to be set by hand.
