# Deployment Guide

## Today: local / single-firm deployment

```bash
npm install                 # installs deps + runs `prisma generate`
npm run db:migrate           # applies schema to a local SQLite database
npm run db:seed              # seeds realistic demo data
npm run build                 # production build
npm run start                 # serves the production build
```

The app needs:
- A writable filesystem for `prisma/dev.db` (SQLite) and `/storage`
  (uploaded files + exported generated documents).
- Node.js (matching the version this project's `package.json`/lockfile
  were built against) and no other runtime services — no Redis, no
  external database, no cloud AI provider, no message queue.

Environment variables: see `.env.example` and `docs/CONFIGURATION.md`.
Every `LEXORA_*` var is optional; the app behaves identically to its
zero-config default without any of them set.

## Deploying to a single server/VM

Works unchanged — `npm run build && npm run start`, behind any reverse
proxy (nginx, Caddy) for TLS termination. Persist `prisma/dev.db` and
`/storage` on a real disk (not ephemeral container storage) across
restarts/redeploys.

## Deploying behind a container (single instance)

Works unchanged as long as:
1. The container has a persistent volume mounted for `prisma/dev.db` and
   `/storage`.
2. Only **one** container instance runs at a time (see "Scaling past one
   instance" below for why).

## Scaling past one instance (not supported today)

Three things break the moment there's more than one instance — see
`docs/KNOWN_LIMITATIONS.md` and `docs/ARCHITECTURE_DECISIONS.md` for the
full reasoning:

1. **SQLite** — a single-process, single-file database. Needs a real
   client-server database (Postgres) before running more than one app
   instance.
2. **Local file storage** — uploaded/exported files live on one
   instance's disk. Needs a real object-storage provider (see
   `lib/platform/storage/cloud-storage-adapter-placeholder.ts` for the
   interface a real S3/Azure/GCS adapter would implement).
3. **In-memory rate limiter and cache** — per-process state, not shared.
   Needs Redis-backed replacements (interfaces already exist, see
   `lib/platform/security/rate-limiter.ts` and
   `lib/platform/cache/redis-cache-provider-placeholder.ts`).

Sessions are the one exception — already DB-backed, so they already scale
past one instance without changes once the database itself does.

## Pre-deployment checklist

Run before any deploy, local or otherwise:

```bash
npm run typecheck
npm run lint
npm run test           # unit + integration
npm run build
```

If deploying a UI change, also run (needs a browser installed —
`npx playwright install chromium` once):

```bash
npm run test:e2e
npm run test:a11y
```

## CI/CD

No pipeline exists yet — all the above are local commands today. When
setting one up, run them in the order listed (fail fast on the cheap
checks before the slower browser-based ones). No workflow file has been
added speculatively, since the target CI provider isn't chosen yet.

## Rollback

Since deployment is currently `git pull` + rebuild on one server: rolling
back is `git checkout <previous-tag-or-commit>` + rebuild + restart. No
destructive migration has ever been part of this project's history (every
schema change so far has been additive) — see `docs/CHANGELOG.md` — so a
rollback doesn't require a database downgrade in practice. Always confirm
this holds for any new migration before treating rollback as trivial.
