# Contributing to LEXORA

This is a reference guide for working in this codebase — the conventions
below are already how the project is built, not aspirational. When in
doubt, match what's already there rather than introducing a new pattern.

## Before you start

Read, in this order:

1. `README.md` — setup, demo credentials, scripts.
2. `docs/FOLDER_STRUCTURE.md` — the feature-based layout and the exact
   steps for adding a new module. This is the single most important doc
   in the repo for day-to-day work.
3. `docs/DATABASE_ARCHITECTURE.md`, `docs/INFORMATION_ARCHITECTURE.md`,
   `docs/ROUTE_MAP.md` — how modules, roles, and the schema fit together.
4. `docs/ARCHITECTURE_DECISIONS.md` — why things are shaped the way they
   are, so you don't accidentally re-litigate a settled decision.
5. `src/lib/platform/README.md` — if you're touching anything under
   `lib/platform/`, read this first. It explains what's real vs.
   future-capability scaffolding and why the two are kept separate.

## Local setup

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

See `README.md` for demo credentials and `.env.example` for optional
configuration.

## Coding standards

- **TypeScript, strict.** No `any` without a specific reason (and a
  comment explaining it). Prefer inferring types from Zod schemas and
  Prisma's generated client over hand-writing parallel interfaces.
- **Server Components read, Server Actions write.** Don't add a REST
  API route for CRUD — use a Server Action in `features/<module>/actions.ts`
  (see `docs/ROUTE_MAP.md` for when an `app/api/*` route is actually
  warranted: file streaming, webhooks).
- **Never call Prisma directly outside `features/<module>/{queries,actions}.ts`.**
  Always import the singleton from `lib/db/prisma.ts`.
- **Client Components cannot import real (non-`type`) functions from a file
  that also imports Prisma.** This will build successfully but crash at
  runtime in dev mode (`better-sqlite3` can't bundle into the browser) —
  seen twice in this project's history. If a Client Component needs
  server-only data on demand, add a thin Server Action wrapper (see
  `features/document-generator/actions.ts`'s `getGeneratedDocumentDetail`
  for the pattern), never a direct `queries.ts` import.
- **Reuse before you build.** Check `docs/COMPONENT_LIBRARY.md` and
  `src/hooks/*` before writing a new table, empty state, confirm dialog,
  filter hook, etc. — most patterns already exist once
  (`DataTable`, `EmptyState`, `ConfirmDialog`, `useTableFilters`, ...).
- **No premature abstraction.** Three similar lines beat a new shared
  helper used twice. Three-plus real call sites is a reasonable bar for
  extracting one.

## Accessibility

- Every interactive control needs an accessible name. An icon-only
  button needs `aria-label`; a `<Select>`/`<SelectTrigger>` whose visible
  text is only a *placeholder* (shown before any value is picked) needs
  an explicit `aria-label` too — placeholders are not accessible names
  (see `tests/accessibility/` and the fixes referenced in
  `docs/UI_GUIDELINES.md`).
- Don't render a database-stored/user-configurable color (e.g.
  `PracticeArea.color`) as text color — it can't be contrast-checked at
  render time. Use it as a decorative dot or border tint instead (see
  `components/matters/matter-header.tsx`).
- Run `npm run test:a11y` against any new page before considering it done.

## Testing

See `docs/TESTING.md` for the full breakdown. Practical rule of thumb:

- Pure logic (business rules, formatters, diff/comparison algorithms) →
  `tests/unit/`, no mocking needed.
- A query/action function that hits the database → `tests/integration/`,
  using `provisionTestDatabase()` against a real isolated SQLite file, not
  a mocked Prisma client.
- A user-facing flow spanning multiple pages → `tests/e2e/`.
- A component with real DOM structure worth asserting on → `tests/unit/components/`
  with `@testing-library/react`.

## Commit style

Look at `git log` for the tone: short, factual, states what changed and
why in a sentence or two — not a changelog of every file touched.

## Pull requests / review

Before asking for review (or merging, if you're the only one working on
this): `npm run typecheck && npm run lint && npm run test && npm run build`
should all be clean. If you touched UI, actually click through it in a
browser — a green test suite doesn't prove a feature works, only that
what's tested still passes (see `docs/DEVELOPMENT_PLAN.md`'s note on a
build succeeding while a page crashed at runtime in dev mode).
