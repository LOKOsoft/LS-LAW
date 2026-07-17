# Future integrations

How to actually turn on a real provider for each capability in
`src/lib/platform/`. Each section: what exists today, what a real
integration needs, and where the swap point is. None of this is done —
this is the map for when it needs to be.

## Storage → S3 / Azure Blob / GCS

**Today:** `LocalStorageAdapter` wraps `lib/storage/local-storage.ts`.
**To add S3 (for example):**
1. Add the AWS SDK as a dependency.
2. Write `S3StorageAdapter implements StorageProvider` (see
   `lib/platform/storage/types.ts`) — `save()` uploads via the SDK and
   returns a `SavedFile` with `storagePath` as the S3 key/URL instead of a
   local path.
3. Update `lib/platform/storage/index.ts`'s `getStorageProvider()` to
   return it when `LEXORA_STORAGE_PROVIDER=s3`.
4. Set `LEXORA_S3_BUCKET` + AWS credentials.

No call site changes needed — `app/api/upload/route.ts` and anything else
using storage goes through the interface, not the concrete adapter.

## Payments → Stripe / Razorpay

**Today:** `MockPaymentProvider`, in-memory, non-persisted.
**To add Stripe:**
1. Add the `stripe` SDK.
2. Write `StripePaymentProvider implements PaymentProvider` (see
   `lib/platform/billing/types.ts`) — real subscription create/cancel/list
   invoices calls.
3. Add a real `Plan`/`Subscription`/`SaaSInvoice` schema — these types exist
   in `lib/platform/billing/types.ts` today but aren't backed by Prisma
   models; this is a genuinely new schema addition, not a migration of
   existing data.
4. Update `lib/platform/billing/index.ts`'s `getPaymentProvider()`.
5. Set `STRIPE_SECRET_KEY`, `LEXORA_PAYMENT_PROVIDER=stripe`.
6. Wire `FeatureGate`'s `LocalFeatureGate` to check a real subscription's
   plan features instead of always returning `true`.

## AI → OpenAI / Anthropic / Gemini

**Today:** `MockAIProvider`, fully offline, deterministic canned responses.
**To add a real provider:**
1. Add the SDK (`@anthropic-ai/sdk`, `openai`, etc.) — see the `claude-api`
   skill/reference material if integrating Claude specifically.
2. Write a provider implementing `AIProvider` (`lib/platform/ai/types.ts`) —
   the interface already covers prompt completion, embeddings, vector
   search, OCR, speech, document analysis, summarization, clause
   recommendation, and matter summarization; a real provider likely only
   implements a subset well (e.g. an LLM API covers prompt/summarization/
   clause-recommendation/matter-summary directly, but OCR/speech need a
   different service).
3. Update `lib/platform/ai/index.ts`'s `getAIProvider()`.
4. Set the relevant API key + `LEXORA_AI_PROVIDER`.

Consider whether every module UI that would call this (document analysis
in the Documents module, matter summaries on matter detail pages, clause
suggestions in the Clause Library) actually exists yet — this pass built
the provider layer, not the UI that would call it, since no such UI exists
in the app today.

## Notifications → real email/SMS/WhatsApp/push/desktop

**Today:** `InAppChannel` is real (writes `Notification` rows). Every other
channel is `MockChannel` — logs to console, sends nothing.
**To add real email (most likely first target):**
1. Add an email provider SDK (Resend, SendGrid, Postmark, etc.).
2. Write `EmailChannel implements NotificationChannel`
   (`lib/platform/notifications/types.ts`).
3. Update `lib/platform/notifications/dispatcher.ts`'s `buildChannel()` to
   return the real channel for `type === "email"`.
4. Add `"email"` to `LEXORA_NOTIFICATION_CHANNELS`.

Repeat per channel (SMS/WhatsApp typically via Twilio; push via FCM/APNs;
desktop via the Web Push API or Electron notifications if this ever ships
as a desktop app).

## Multi-tenancy

See `docs/ARCHITECTURE_DECISIONS.md`'s entry #3 for the shared-schema +
`firmId` recommendation. This is the largest real migration on this list —
touches the schema, every `features/*/queries.ts` call site, and
`src/proxy.ts`/`lib/platform/tenancy/middleware-placeholder.ts`'s tenant
resolution. Treat it as its own project.

## Caching → Redis

**Today:** `MemoryCacheProvider`, in-process.
**To add Redis:**
1. Add `ioredis` or `redis`.
2. Replace `RedisCacheProviderPlaceholder`'s throwing methods
   (`lib/platform/cache/redis-cache-provider-placeholder.ts`) with real
   `GET`/`SET`/`DEL`/`FLUSHDB`-equivalent calls.
3. Set `REDIS_URL`, `LEXORA_CACHE_PROVIDER=redis`.

Same file/class for the rate limiter's future Redis backing
(`lib/platform/security/rate-limiter.ts` — not currently provider-selected
via config the way cache is; would need the same treatment if/when it's
needed).

## Logging → a real cloud log provider

**Today:** `ConsoleLogProvider` (structured JSON to stdout/stderr) — note
this is likely sufficient forever if the deployment target scrapes stdout
(most container platforms do); see `docs/DEPLOYMENT_PREPARATION.md`.
**If direct SDK-based shipping is ever needed instead:** replace the body of
`CloudLogProviderPlaceholder.write()` (`lib/platform/logging/cloud-log-provider-placeholder.ts`)
with a real call to whatever provider (Datadog, Better Stack, CloudWatch SDK
directly instead of agent-based scraping, etc.).
