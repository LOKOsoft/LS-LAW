# Backup and Restore

LEXORA's entire persistent state is two things on disk: the SQLite
database file and the `/storage` directory. Both are gitignored (never
committed) and both need a real backup strategy in any deployment beyond
local development.

## What to back up

| Path | Contents |
|---|---|
| `prisma/dev.db` | Every table — firms, users, clients, matters, documents metadata, invoices, generated documents, everything. |
| `prisma/dev.db-journal` (if present) | SQLite's write-ahead journal — back up alongside the main file to avoid a torn/inconsistent snapshot. |
| `/storage` | Every uploaded document and every exported AI-generated document (the actual file bytes; the database only stores the path/metadata). |

Losing `/storage` without the database is recoverable metadata pointing
at nothing; losing the database without `/storage` is orphaned files with
no record of what they are. **Back up both together, atomically if
possible.**

## Backing up

Stop write traffic (or accept a small inconsistency window) before
copying — SQLite backups taken while the app is actively writing can be
corrupted if not done correctly.

**Simplest correct approach** (small/local deployments): use SQLite's own
backup mechanism rather than a raw file copy, since a raw `cp` while the
database is open can capture a partial write:

```bash
sqlite3 prisma/dev.db ".backup '/path/to/backups/dev-$(date +%Y%m%d-%H%M%S).db'"
tar czf "/path/to/backups/storage-$(date +%Y%m%d-%H%M%S).tar.gz" storage/
```

Schedule both together (cron, systemd timer, or your platform's
scheduled-job mechanism) — see `docs/MAINTENANCE_GUIDE.md` for suggested
cadence.

## Before any migration

Always back up before running `npm run db:migrate` against a real
(non-demo) database — even though every migration in this project's
history has been additive, a backup taken 30 seconds before a migration
costs nothing and eliminates the entire risk category.

## Restoring

```bash
# Stop the app first.
cp /path/to/backups/dev-<timestamp>.db prisma/dev.db
tar xzf /path/to/backups/storage-<timestamp>.tar.gz -C ./
# Restart the app.
```

Verify the restored database's schema matches the currently-deployed
code's expectations — if the backup predates a migration that's since
been applied to the codebase, run `npm run db:migrate` again after
restoring (Prisma's migration history table lives inside the database
file itself, so a restore correctly reverts which migrations are
considered "applied" too).

## Destructive operations to never run against real data

- `npm run db:reset` — drops, recreates, migrates, and reseeds. Local/demo
  use only.
- Deleting `/storage` — irreversible without a backup; every document
  reference in the database becomes a broken link.

## What this project does NOT provide

- No automated backup scheduling is built into the app itself — the
  commands above are meant to be wired into your deployment platform's
  own scheduling mechanism.
- No point-in-time recovery beyond whatever granularity your backup
  schedule provides — SQLite has no built-in continuous replication in
  this project's current architecture.
- No encrypted backups by default — encrypt the backup files themselves
  at the infrastructure layer (e.g. an encrypted storage bucket) if the
  deployment's compliance requirements call for it; this is outside the
  application's own scope.
