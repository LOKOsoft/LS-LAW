# LEXORA — The Operating System for Modern Law Firms

LEXORA is a zero-cost, fully local practice-management platform for law firms —
matters, clients, billing, documents, and firm operations in one place. No paid
services, no cloud dependency, no login required in this phase.

**Phase 1 scope:** the Managing Partner role only. Every role has its own URL
(`/managing-partner`, `/senior-partner`, `/associate`, `/paralegal`,
`/reception`, `/accounts`, `/hr`, `/client`) with no authentication — the
architecture is ready for auth to be added later without restructuring routes.

## Tech stack

Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · shadcn/ui
(Radix primitives) · Prisma 7 + `better-sqlite3` driver adapter · SQLite ·
React Hook Form + Zod · TanStack Table / Query · Recharts · Framer Motion ·
local file storage under `/storage`.

## Getting started

```bash
npm install                 # installs dependencies and runs `prisma generate`
npm run db:migrate           # applies the schema to a local SQLite database
npm run db:seed              # seeds realistic demo data (firm, clients, matters, billing…)
npm run dev                  # starts the dev server at http://localhost:3000
```

The root URL redirects to `/managing-partner`, which is the fully built
dashboard for this phase.

### Other useful scripts

```bash
npm run db:studio   # browse/edit the local database with Prisma Studio
npm run db:reset     # drop, recreate, migrate, and reseed the database
npm run typecheck    # tsc --noEmit
npm run lint          # eslint
npm run build         # production build
```

## Data & storage

- The database is a single file at `prisma/dev.db` (SQLite), gitignored.
- Uploaded documents are written to `/storage` (gitignored), organized by
  matter/client. The Documents module's upload button writes real files here
  via `app/api/upload/route.ts`; files are served back via
  `app/api/storage/[...path]/route.ts`.
- `prisma/seed.ts` is idempotent — it clears and repopulates all tables, so
  it's safe to re-run any time you want a clean demo state.

## Architecture notes

- **No auth, by design (for now).** Role routing is purely path-based. Adding
  real authentication later means introducing a session/identity layer and
  gating these existing routes — no rework of the page structure required.
- **Server Components read, Server Actions write.** Pages fetch data directly
  via a Prisma singleton (`src/lib/db/prisma.ts`); mutations (creating a
  client, matter, task, hearing, invoice, note, or toggling a favorite) go
  through colocated `"use server"` actions under `src/features/<module>/actions.ts`,
  validated with Zod schemas shared with the client-side forms.
- **One shared `DataTable`** (`src/components/shared/data-table`) wrapping
  TanStack Table backs every module's list view — column defs and data are the
  only per-module code.
- **Feature-based structure**: `src/features/<module>/{queries,actions,schema,columns}.ts`
  colocated with `src/components/<module>/*` presentational components and
  `src/app/(roles)/managing-partner/<module>/page.tsx` routes.
