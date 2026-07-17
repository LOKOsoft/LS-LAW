# Maintenance Guide

Ongoing tasks for keeping a running LEXORA install healthy.

## Routine

| Task | Frequency | Command |
|---|---|---|
| Dependency updates | Monthly, or on security advisory | `npm outdated`, then update deliberately (not blindly `npm update` — check each major bump's changelog, especially Next/React/Prisma given this project's history of breaking changes between versions) |
| Database backup | Before any migration; ideally on a schedule | See `docs/BACKUP_AND_RESTORE.md` |
| Storage directory backup | Same cadence as the database | Same doc |
| Full test suite | Before every deploy | `npm run typecheck && npm run lint && npm run test && npm run build` |
| Accessibility re-check | After any shared component / design-token change | `npm run test:a11y` |

## Database migrations

```bash
# 1. Edit prisma/schema.prisma
npx prisma format
npm run db:migrate -- --name descriptive_name
```

Follow `docs/DATABASE_ARCHITECTURE.md`'s conventions (cuid ids, cascade
rules, timestamps). Every migration in this project's history so far has
been additive (new nullable fields / new models) — prefer that over
destructive changes (dropping/renaming columns) where possible, since it
keeps rollback safe (see `docs/DEPLOYMENT_GUIDE.md`).

## Adding a new module

Follow `docs/FOLDER_STRUCTURE.md`'s "Rules for adding a new module"
exactly — `features/<module>/queries.ts` → `components/<module>/*` →
`app/(roles)/<role>/<module>/page.tsx` → register in `nav.ts`/
`permission-matrix.ts`. Don't skip the nav/permission-matrix registration
step — a module with routes but no nav entry is unreachable from the UI
and easy to forget about.

## Monitoring what's actually being used

- `npx madge --circular --extensions ts,tsx src` — should report zero
  circular dependencies outside `src/generated/prisma` (auto-generated,
  expected). If it reports more, something in `src/` now has a real
  circular import — investigate before it causes a subtle bug.
- `npx knip` — reports unused files/exports/dependencies. **Read the
  output critically before deleting anything** — this project
  deliberately keeps unused shadcn UI primitives, the entire
  `lib/platform/` scaffolding tree, and several "built but not yet wired
  in" hooks/components (see `src/lib/platform/README.md` and
  `docs/KNOWN_LIMITATIONS.md`). Knip doesn't know the difference between
  "genuinely dead" and "intentional future-capability scaffolding" — a
  human has to.

## Log review

`lib/platform/logging/logger.ts` writes structured JSON to stdout/stderr.
If deployed behind a container platform, that's directly tailable by
whatever log collector is in place — no separate log-shipping
configuration needed unless a `cloud` log provider is later configured
(currently a no-op fallback to console — see `docs/FUTURE_INTEGRATIONS.md`).

## Seed data

`prisma/seed.ts` is idempotent — safe to re-run (`npm run db:seed`) any
time a clean demo state is needed. `npm run db:reset` drops, recreates,
migrates, and reseeds in one step — **destructive**, only for a local/demo
database, never a real firm's data.

## When something feels broken but isn't a real bug

Check `docs/TROUBLESHOOTING.md` first — several "it's broken" symptoms in
this project's history turned out to be a stale WSL2 dev cache, not a
code issue.
