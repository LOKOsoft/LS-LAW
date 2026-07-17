# Deployment preparation

LEXORA runs today as a single local Node process against a single SQLite
file and the local filesystem. This document is what changes — and what
deliberately doesn't — between that and a real deployment, at whatever
point that becomes a real goal rather than a preparation exercise.

## What already works unchanged in a single-server deployment

- `npm run build && npm run start` — standard Next.js production build/serve.
- SQLite + `better-sqlite3` works fine as a single-process, single-server
  database. No code change needed to deploy as-is on one server/VM.
- Local file storage (`/storage`) works fine as long as the deployment has a
  persistent disk (not ephemeral container storage that resets on restart/
  redeploy) and only ever runs one instance.

## What breaks the moment there's more than one instance

- **SQLite file storage.** `better-sqlite3` opens a local file; two
  processes/instances can't safely share one, and horizontal scaling
  (multiple app instances behind a load balancer) needs a real client-server
  database (Postgres/MySQL) instead. This is a real migration, not covered
  by anything added in this pass — `prisma/schema.prisma`'s models are
  standard Prisma and would port to Postgres with a provider change plus a
  fresh migration history; the `Float` money fields (see
  `docs/ARCHITECTURE_DECISIONS.md`) are the one thing worth revisiting
  during that migration, not after.
- **Local file storage.** Needs a real object-storage provider (S3/Azure
  Blob/GCS) — see `src/lib/platform/storage/cloud-storage-adapter-placeholder.ts`
  for the interface a real adapter would implement. Uploaded files living on
  one instance's disk aren't visible to other instances or across a
  redeploy without a persistent volume.
- **In-memory rate limiter and cache.** Both reset per-process and aren't
  shared across instances (see `docs/SECURITY.md` and `docs/PERFORMANCE.md`).
  A distributed brute-force attempt just resets its counter by hitting a
  different instance; cached values diverge per instance. Both have a Redis
  placeholder ready to swap in (`lib/platform/cache/redis-cache-provider-placeholder.ts`).
- **Sessions** are DB-backed already (not in-memory), so this one already
  scales past one instance without changes — noted here because it's the
  exception, not the rule.

## Environment/config

See `docs/CONFIGURATION.md` for the full list. Nothing here is required for
the app to run as it does today; every `LEXORA_*` var has a safe default.

## Multi-tenancy

Not implemented — see `docs/ARCHITECTURE_DECISIONS.md`'s entry #3 for the
recommended shared-schema + `firmId` approach and why it wasn't done
speculatively. Treat "add real multi-tenancy" as its own project with its
own migration plan, not something to bolt on during a deploy.

## Billing/licensing

Not implemented — `src/lib/platform/billing/` is fully mock. A real
deployment offered as a paid product needs a real payment provider
integration (Stripe/Razorpay) behind the existing `PaymentProvider`
interface, plus a real `Plan`/`Subscription` schema (see
`docs/FUTURE_INTEGRATIONS.md`).

## Observability

`src/lib/platform/logging/logger.ts` writes structured JSON to
stdout/stderr today (`ConsoleLogProvider`). That's directly tailable by any
standard container log collector (CloudWatch, Datadog, etc. via their
stdout-scraping agents) with zero code change — a real "cloud log provider"
integration (`cloud-log-provider-placeholder.ts`) would only be needed for
direct SDK-based log shipping instead of stdout scraping.

## CI/CD

Does not exist yet. `npm run typecheck`, `npm run lint`, `npm run test`,
`npm run test:e2e` (needs a browser + the dev server, see
`docs/TESTING.md`), and `npm run build` are the commands a CI pipeline
should run, in that order (fail fast on the cheap checks first). No
workflow file has been added — doing so without knowing the target CI
provider would be a speculative choice this pass avoided making.

## Rollout order if this becomes real

1. Move off SQLite to Postgres (only after multi-instance becomes a real
   requirement — don't do this speculatively either).
2. Real cloud storage adapter (S3 or equivalent) + swap
   `LEXORA_STORAGE_PROVIDER`.
3. Real payment provider integration behind `PaymentProvider`.
4. Multi-tenancy (`firmId` scoping) — see architecture decision #3.
5. Real external notification channels (email first, most likely need).
6. Real AI provider, if the product direction actually wants an AI feature
   (nothing in the PRD currently requires one — this was built because the
   request asked for the scaffolding, not because there's a planned feature
   behind it).
