# Route Map

All routes live under `src/app/`. Role access per route is governed by each role's `ModuleKey[]` allow-list in `nav.ts` — see [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md). This doc lists the URL surface; it does not restate access rules.

## Public / entry routes

| Route | Purpose |
|---|---|
| `/` | Redirects to `/login` |
| `/login` | Login form (Server Action-based auth) |

## Role route trees — `/(roles)/<role>/...`

Every staff role has `layout.tsx` (auth + role-match guard) and `page.tsx` (dashboard). Below it, the same module slugs repeat across roles — only the *set* of modules present differs per role (per the allow-lists in `nav.ts`).

**Full module set** (Managing Partner, Administrator get all of these; other fee-earner roles get a subset — see IA doc):

```
/<role>/
/<role>/clients            /<role>/clients/[clientId]
/<role>/clients/archived
/<role>/clients/duplicates          not present for accounts (read-only role, no merge/import)
/<role>/clients/relationship-manager
/<role>/clients/import               not present for accounts
/<role>/companies
/<role>/contacts
/<role>/matters            /<role>/matters/[matterId]
/<role>/court-cases
/<role>/hearings
/<role>/tasks
/<role>/calendar
/<role>/meetings
/<role>/notes
/<role>/documents
/<role>/document-generator
/<role>/template-library
/<role>/clause-library
/<role>/knowledge-base
/<role>/research
/<role>/billing
/<role>/finance
/<role>/hr
/<role>/attendance
/<role>/leaves
/<role>/reports
/<role>/analytics
/<role>/notifications
/<role>/settings
/<role>/audit-logs
```

### Per-role actual route trees (what exists on disk today)

| Role slug | Modules present |
|---|---|
| `managing-partner` | full set (all above) |
| `administrator` | full set (all above) |
| `senior-partner`, `partner`, `associate`, `junior-associate` | clients, companies, contacts, matters, court-cases, hearings, calendar, meetings, notes, documents, document-generator, template-library, clause-library, knowledge-base, research, billing, tasks — no hr/attendance/leaves/reports/analytics/settings/audit-logs. `junior-associate` additionally has no `finance`. |
| `legal-researcher` | same as above minus hearings, billing, finance |
| `paralegal` | same as senior-partner minus finance |
| `reception` | `clients`, `calendar`, `notifications` only |
| `accounts` | `clients`, `matters`, `calendar`, `documents`, `billing`, `finance`, `reports`, `notifications` |
| `hr` | `attendance`, `leaves`, `notifications`, `reports`, plus its own `hr/` route (people ops) |
| `office-manager` | `calendar`, `billing`, `hr`, `reports`, `notifications`, `settings` |

Every role slug also has `/notifications` (present on all 12 staff roles).

### Clients sub-routes (all 10 roles with a `clients` folder)

`clients/archived` (restorable soft-delete list), `clients/duplicates` (name/email/phone match detection + merge), `clients/relationship-manager` (roster grouped by relationship manager), `clients/import` (CSV bulk import with row-level validation preview). `accounts` is the one role whose `ClientsTable`/`ArchivedClientsTable` render with `canManage={false}`/`canRestore={false}` — it keeps `archived` and `relationship-manager` (read-only views) but has no `duplicates`/`import` routes at all, matching its View-only tier in the permission matrix.

## Client Portal — `/(roles)/client/...`

Structurally separate, minimal-chrome shell:

```
/client/                    Overview
/client/documents
/client/invoices
/client/messages
```

## API routes (`src/app/api/`)

| Route | Purpose |
|---|---|
| `POST /api/upload` | Multipart document upload, writes to `/storage` |
| `GET /api/storage/[...path]` | Serves uploaded files back from `/storage` |

These two are the only real API routes — everything else is Server Components (reads) + Server Actions (writes) inside `features/<module>/actions.ts`, not REST endpoints. Do not add new `app/api/` routes for CRUD; use a Server Action instead. Only add an `app/api/*` route when the client genuinely needs a URL (file streaming, webhooks) rather than a form submission/mutation.

## Detail route pattern

Two modules currently have a `[id]` detail route: `clients/[clientId]` and `matters/[matterId]`, present per-role wherever that role has access to the module. Both render a shared `*-header.tsx` + `*-detail-tabs.tsx` component pair from `components/<module>/`, fed by a single `getClientById`/`getMatterById`-style query. Follow this pattern (header + tabs, one detail query) for any new module that grows a detail view — don't invent a new detail-page shape per module.
