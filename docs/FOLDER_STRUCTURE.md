# Folder Structure

This is the actual, current `src/` layout — the canonical structure every future module must follow. Feature-based, not layer-based: a module's data logic, presentational components, and routes live in three parallel trees keyed by the same module name, not nested inside one "module folder."

```
src/
├── app/
│   ├── (roles)/<role-slug>/          one route tree per role (managing-partner, senior-partner,
│   │   ├── layout.tsx                 partner, associate, junior-associate, legal-researcher,
│   │   ├── page.tsx                   paralegal, reception, accounts, hr, office-manager,
│   │   └── <module>/                  administrator) + client/ for the Client Portal
│   │       ├── page.tsx
│   │       └── [id]/page.tsx          detail routes where the module has one
│   ├── api/                          route handlers only for things Server Actions can't do
│   │   ├── upload/route.ts            (multipart file upload, static file serving)
│   │   └── storage/[...path]/route.ts
│   ├── login/page.tsx
│   ├── layout.tsx                    root layout — wraps children in <Providers>
│   ├── globals.css                   design tokens (see DESIGN_SYSTEM.md)
│   └── page.tsx                      redirects to /login
│
├── features/<module>/                data layer, one folder per module
│   ├── queries.ts                     reads — plain async functions calling the Prisma singleton
│   ├── actions.ts                     writes — "use server" Server Actions (only if module is mutable)
│   ├── schema.ts                      Zod schemas shared by actions.ts and the client form
│   └── columns.tsx                    TanStack ColumnDef[] for modules with a table view
│
├── components/
│   ├── ui/                           shadcn/Radix primitives — generic, no app logic (button, card,
│   │                                  dialog, sheet, input, select, table, tabs, etc.)
│   ├── shared/                       reusable app-level components used across modules
│   │   ├── data-table/                the one DataTable every list view is built on
│   │   ├── charts/                    reusable chart wrapper components
│   │   ├── empty-state.tsx, error-state.tsx, status-pill.tsx, stat-card.tsx,
│   │   │   page-header.tsx, form-modal.tsx, form-drawer.tsx, global-search.tsx,
│   │   │   multi-select.tsx, confirm-dialog.tsx, timeline.tsx, role-coming-soon.tsx
│   ├── layout/                       sidebar.tsx, topbar.tsx, theme-toggle.tsx — shared app chrome
│   ├── dashboard/                    dashboard widget components (one file per widget)
│   └── <module>/                     presentational components specific to one module
│       (clients/, matters/, billing/, documents/, hearings/, tasks/, hr/, ...) —
│       tables, forms, detail tabs; imports queries' return types from features/<module>
│
├── hooks/                            shared, cross-module React hooks (see DEVELOPMENT_PLAN.md —
│                                       this folder was empty before this audit's gap-fill pass)
│
├── lib/
│   ├── auth/                         session.ts, dal.ts (requireUser), password.ts, roles.ts, constants.ts
│   ├── constants/                    nav.ts (module registry), permission-matrix.ts
│   ├── db/prisma.ts                  the one Prisma client singleton — always import from here
│   ├── storage/local-storage.ts      local filesystem read/write for /storage
│   ├── services/                     real business-rule/workflow services (errors, notifications,
│   │                                   activity/audit log, workflow stage transitions) — the "service
│   │                                   layer" the earlier audit deliberately didn't invent, because
│   │                                   this is it, backed by Prisma
│   ├── platform/                     future-SaaS scaffolding (auth/tenancy/billing/storage/
│   │                                   notifications/AI provider interfaces, config, logging, cache,
│   │                                   errors, security) — see platform/README.md; inert/local-only
│   │                                   by default, never a hard dependency
│   ├── format.ts                     date/currency/byte/initials/time-ago formatters
│   └── utils.ts                      cn() and other framework-agnostic helpers
│
├── types/                            shared cross-feature TypeScript types (narrow — most domain
│                                       types come from Prisma's generated client; this folder is
│                                       for UI-only types that don't belong to one feature)
│
├── generated/prisma/                 Prisma client output — generated, never hand-edit
│
└── proxy.ts                          this Next.js version's renamed middleware.ts — cheap
                                        cookie-presence redirect only; real auth check is in dal.ts

tests/                                 unit + integration (Vitest) and e2e/accessibility/performance/
                                        visual (Playwright) — see docs/TESTING.md
```

## Rules for adding a new module

1. **`features/<module>/`** — `queries.ts` first (reads). Add `schema.ts` + `actions.ts` only if the module has mutations. Add `columns.tsx` only if it has a table list view.
2. **`components/<module>/`** — one file per distinct view (`<module>-table.tsx`, `new-<module>-form.tsx`, `<module>-detail-tabs.tsx`). Reuse `components/shared/*` for anything generic (table, empty/error state, status pill, confirm dialog) — don't reimplement.
3. **`app/(roles)/<role>/<module>/page.tsx`** — one thin page per role that has access, calling the shared query function with `{ scopeUserId }` when the role is fee-earner-scoped. Pages are Server Components; the interactive table/form is a separate `"use client"` component imported from `components/<module>/`.
4. **Register the module** in `lib/constants/nav.ts` (add to `NAV_STRUCTURE`, add the `ModuleKey`, add to the relevant role allow-lists) and, if it has tiered access, `permission-matrix.ts`.
5. Never put a Prisma query inline in a page or component — always go through `features/<module>/queries.ts`, even for a one-off. Never call `PrismaClient` directly — import the singleton from `lib/db/prisma.ts`.

## What does *not* exist (by design)

- No `services/` layer with mock/placeholder implementations for anything the app already does for real — `features/<module>/{queries,actions}.ts` and `lib/services/*` *are* the service layer, backed by the real Prisma database. Do not add a parallel mock service layer for those. The one deliberate exception is `lib/platform/` — interfaces + mock/local implementations for capabilities the app has never had (billing, AI, multi-tenancy, cloud storage, external notifications), added to make a future hosted version cheaper to build, not to duplicate anything working today. See `lib/platform/README.md` before adding to it.
- No global Modal/Drawer state provider — dialogs and sheets manage their own `open` state locally (or via the `useDisclosure` hook added in this audit) at the point of use; there's no app-wide modal manager because nothing needs to trigger a dialog from outside its own component tree yet.
- No `redux`/global client-state store — TanStack Query (server cache) + local component state covers everything currently built.
