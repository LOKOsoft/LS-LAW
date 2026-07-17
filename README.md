# LEXORA — The Operating System for Modern Law Firms

LEXORA is a zero-cost, fully local practice-management platform for law firms —
matters, clients, billing, documents, and firm operations in one place. No paid
services, no cloud dependency.

**Version 1.0 scope:** real authentication and every persona in the PRD is
fully built — Managing Partner, Senior Partner, Partner, Associate, Junior
Associate, Legal Researcher, Paralegal, Reception, Accounts, HR, Office
Manager, and Administrator each get a role-appropriate dashboard and module
set, plus a separate branded Client Portal. Companies/Contacts, Court Cases,
Meetings/Notes/Research, Notifications, Audit Logs, and Attendance/Leaves are
all real modules now, not tabs or placeholders.

## Tech stack

Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · shadcn/ui
(Radix primitives) · Prisma 7 + `better-sqlite3` driver adapter · SQLite ·
React Hook Form + Zod · TanStack Table / Query · Recharts · Framer Motion ·
local file storage under `/storage`. Auth is hand-rolled (no external
provider): `crypto.scrypt` password hashing + DB-backed sessions.

## Getting started

```bash
npm install                 # installs dependencies and runs `prisma generate`
npm run db:migrate           # applies the schema to a local SQLite database
npm run db:seed              # seeds realistic demo data (firm, clients, matters, billing…)
npm run dev                  # starts the dev server at http://localhost:3000
```

The root URL redirects to `/login`. Sign in with any seeded user's email and
the shared demo password below — you'll land on that user's role home.

### Demo credentials

All seeded users share one password: **`Lexora@123`**

| Role | Email |
|---|---|
| Managing Partner | `arjun.mehta@lexoralaw.com` |
| Senior Partner | `kavita.rao@lexoralaw.com` / `rohan.deshpande@lexoralaw.com` |
| Partner | `meera.kapoor@lexoralaw.com` |
| Associate | `ananya.iyer@lexoralaw.com` |
| Junior Associate | `aditya.rao@lexoralaw.com` |
| Legal Researcher | `ishaan.kulkarni@lexoralaw.com` |
| Paralegal | `sameer.khan@lexoralaw.com` |
| Reception | `neha.sharma@lexoralaw.com` |
| Accounts | `rahul.verma@lexoralaw.com` |
| HR | `fatima.sheikh@lexoralaw.com` |
| Office Manager | `ritu.chawla@lexoralaw.com` |
| Administrator | `vivek.anand@lexoralaw.com` |
| Client Portal | `portal@novatechsolutions.com` |

### Other useful scripts

```bash
npm run db:studio   # browse/edit the local database with Prisma Studio
npm run db:reset     # drop, recreate, migrate, and reseed the database
npm run typecheck    # tsc --noEmit
npm run lint          # eslint
npm run build         # production build
npm run analyze       # production build with the bundle analyzer report

npm run test           # unit + integration tests (Vitest)
npm run test:e2e        # end-to-end tests (Playwright, needs the dev server)
npm run test:a11y       # accessibility checks (axe-core via Playwright)
npm run test:performance # coarse page-load budget checks
npm run test:visual      # visual regression screenshots
```

See `docs/TESTING.md` for what each test category covers and how to run them locally.

## Data & storage

- The database is a single file at `prisma/dev.db` (SQLite), gitignored.
- Uploaded documents are written to `/storage` (gitignored), organized by
  matter/client. The Documents module's upload button writes real files here
  via `app/api/upload/route.ts`; files are served back via
  `app/api/storage/[...path]/route.ts`.
- `prisma/seed.ts` is idempotent — it clears and repopulates all tables, so
  it's safe to re-run any time you want a clean demo state.

## Architecture notes

- **Auth**: `src/lib/auth/session.ts` creates a DB-backed `Session` row and
  sets an httpOnly cookie holding only the session id. `src/proxy.ts` (this
  Next.js version renamed `middleware.ts` → `proxy.ts`) does a cheap,
  cookie-presence-only redirect to `/login`. The real, DB-backed check —
  including the role-match redirect — happens in `requireUser()`
  (`src/lib/auth/dal.ts`), called from every role's `layout.tsx`.
- **Server Components read, Server Actions write.** Pages fetch data directly
  via a Prisma singleton (`src/lib/db/prisma.ts`); mutations go through
  colocated `"use server"` actions under `src/features/<module>/actions.ts`,
  validated with Zod schemas shared with the client-side forms. Every mutating
  action calls `revalidatePath("/", "layout")` so it refreshes correctly
  regardless of which role route the user is on.
- **One shared `DataTable`** (`src/components/shared/data-table`) wrapping
  TanStack Table backs every module's list view — column defs and data are the
  only per-module code.
- **Feature-based structure**: `src/features/<module>/{queries,actions,schema,columns}.ts`
  colocated with `src/components/<module>/*` presentational components and
  `src/app/(roles)/<role>/<module>/page.tsx` routes, one route tree per role.
- **Role scoping**: query functions take an optional `{ scopeUserId }` — when
  provided, results are filtered to matters the user leads or is a team member
  on (`matterScopeFilter` in `src/features/matters/queries.ts`). Managing
  Partner/Accounts/HR/Office Manager/Administrator call unscoped for firm-wide
  visibility; the fee-earner roles (Senior Partner, Partner, Associate, Junior
  Associate, Legal Researcher, Paralegal) call scoped.
- **Nav is data-driven**: `src/lib/constants/nav.ts` defines every module once
  with an icon/path/description, and a per-role `ModuleKey[]` allow-list
  (derived from the PRD's §5.4 permission matrix) determines each role's
  sidebar, quick actions, and command palette — not separate hardcoded nav
  trees per role.
- **Client Portal** (`/client`) is a separate, minimal-chrome shell (no
  sidebar) gated by `requirePortalUser()`, scoped to exactly one `Client`
  record via `User.clientId`.

## SaaS-readiness layer (`src/lib/platform`)

The app still runs entirely locally with zero external services and zero
required configuration. `src/lib/platform` adds interface-driven scaffolding
— auth/permission/session contracts, multi-tenancy, billing/subscriptions,
storage, notifications, AI, config, logging, caching, and security — so a
future hosted version doesn't require re-architecting call sites, just
writing a new provider and flipping a config value. See
`src/lib/platform/README.md` for the module-by-module rules and
`docs/FUTURE_INTEGRATIONS.md` for how to actually turn one on.
