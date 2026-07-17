# Testing

Didn't exist before this pass — `playwright-core` was a devDependency used
ad hoc for manual verification (see `docs/DEVELOPMENT_PLAN.md`'s Client
Management completion pass), but there was no test runner, no config, no
committed tests. This sets up all six categories the SaaS-readiness request
asked for, with one real (not placeholder) example test per category, all
verified passing against the real dev server and a real database.

## Running tests

```bash
npm run test              # unit + integration (Vitest) — no dev server needed
npm run test:e2e           # Playwright — starts the dev server itself if one isn't already running
npm run test:a11y          # accessibility (axe-core via Playwright)
npm run test:performance   # coarse page-load budget checks
npm run test:visual        # visual regression (screenshot diff)
npm run test:visual:update # regenerate visual baselines after an intentional UI change
```

Playwright's `webServer` config starts `npm run dev` automatically if
`localhost:3000` isn't already serving; set `reuseExistingServer` behavior
via the `CI` env var (see `playwright.config.ts`).

**First-time setup:** `npx playwright install chromium` (downloads a browser
binary; only needs to run once per machine). `npm run db:seed` at least once
— the e2e/a11y/performance/visual tests exercise the real seeded demo login.

## Unit tests (`tests/unit/`, Vitest)

Pure-function tests with no DB, no browser — `lib/format.ts` formatters,
`lib/platform/security/file-validation.ts`, and
`lib/platform/auth/permission-service.ts`'s matrix lookups. Runs in `jsdom`.

## Integration tests (`tests/integration/`, Vitest)

Test real query functions (`features/*/queries.ts`) against a real,
isolated SQLite database — not mocks. `tests/integration/helpers/test-db.ts`'s
`provisionTestDatabase()` runs `prisma db push` against a throwaway temp
file and points the app's Prisma singleton at it via `DATABASE_FILE_PATH`
(see `lib/db/prisma.ts`). Each test file provisions and tears down its own
database; nothing touches `prisma/dev.db`.

**Gotcha if you add a new integration test:** `DATABASE_FILE_PATH` must be
set (by calling `provisionTestDatabase()`) *before* your test file's first
`import("@/lib/db/prisma")` or anything that transitively imports it — the
Prisma singleton reads its DB path once at module load. Use dynamic
`await import(...)` inside `beforeAll`, not a static top-level import, for
any module under `@/lib` or `@/features` your integration test needs (see
`tests/integration/clients-queries.test.ts` for the pattern).

## End-to-end tests (`tests/e2e/`, Playwright)

Drive a real browser against the real running app: login with a seeded
demo user, invalid-credentials handling. Extend this directory for other
critical user flows (creating a matter, uploading a document, etc.) as they
become important enough to guard against regression.

## Accessibility tests (`tests/accessibility/`, Playwright + axe-core)

Runs axe-core's WCAG 2.0/2.1 A/AA ruleset against a page and asserts zero
violations. Currently covers `/login`; add a page per test file as the app's
public-facing surface grows.

## Performance tests (`tests/performance/`, Playwright)

Coarse budgets (e.g. "the login page responds within 5 seconds"), not
micro-benchmarks — meant to catch someone accidentally adding a
multi-second blocking call, not to track millisecond-level regressions.
Tune thresholds if the machine running these is meaningfully slower/faster
than expected.

## Visual regression tests (`tests/visual/`, Playwright)

`expect(page).toHaveScreenshot()` diffs against a committed baseline PNG
(`tests/visual/*.spec.ts-snapshots/`). First run writes the baseline (commit
it); subsequent runs fail if the page's rendered appearance changed. Run
`npm run test:visual:update` after an intentional visual change to
regenerate the baseline.

## A known environment quirk (not a test bug)

Next dev mode (Turbopack) compiles each route tree lazily on first request.
The very first hit to a role's route tree in a fresh `next dev` process can
take several seconds — `playwright.config.ts` sets a generous
`expect.timeout` (15s) to tolerate this; it's not a real regression if a
test is slow only on its first run against a freshly started server.

Separately: this project's `.next` build cache can go stale after rapid
dev-server restarts on WSL2 (`DrvFs`'s inotify unreliability — see
`docs/DEVELOPMENT_PLAN.md`'s follow-up list). If a route inexplicably 404s
right after restarting `next dev`, `rm -rf .next` and restart again before
assuming it's a code bug.

## What's not covered yet

No CI pipeline runs any of this automatically — these are local commands
today. Wiring `npm run test`, `test:e2e`, etc. into a CI workflow is real
follow-up work once this project has a CI provider configured (see
`docs/DEPLOYMENT_PREPARATION.md`).
