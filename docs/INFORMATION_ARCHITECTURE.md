# Information Architecture

How LEXORA's modules, roles, and navigation fit together. Source of truth for role→module access is code, not this doc: [`src/lib/constants/nav.ts`](../src/lib/constants/nav.ts) (nav structure + per-role `ModuleKey[]` allow-lists) and [`src/lib/constants/permission-matrix.ts`](../src/lib/constants/permission-matrix.ts) (the F/C/V/— matrix rendered in Settings). If this doc and the code ever disagree, the code wins — update this doc to match.

## Roles (13, from the `Role` enum)

Managing Partner, Senior Partner, Partner, Associate, Junior Associate, Legal Researcher, Paralegal, Reception, Accounts, HR, Office Manager, Administrator, and Client (Client Portal — a separate shell, not a nav-driven role route).

Each staff role gets its own route tree at `src/app/(roles)/<role-slug>/`, its own `layout.tsx` (calls `requireUser()` for the DB-backed auth + role-match check), and a role-scoped module set resolved by `buildNavSections(basePath, allowedKeys)`.

## Module registry

One flat list of modules drives every role's sidebar, quick actions, and search — there is no per-role hardcoded nav tree. Modules are grouped into 8 sections:

| Section | Modules |
|---|---|
| Overview | Dashboard |
| CRM | Clients, Companies, Contacts |
| Practice | Matters, Court Cases, Hearings, Tasks, Calendar, Meetings, Notes |
| Documents & Knowledge | Documents, Document Generator, Template Library, Clause Library, Knowledge Base, Research |
| Finance | Billing, Finance |
| People | HR, Attendance, Leaves |
| Insights | Reports, Analytics |
| System | Notifications, Settings, Audit Logs |

A role's visible nav is `NAV_STRUCTURE` filtered down to its `ModuleKey[]` allow-list — sections with zero visible items are dropped entirely (see `buildNavSections`).

## Role → module access model

Access is defined as explicit allow-lists per role in `nav.ts`, derived by starting from `ALL_MODULE_KEYS` and subtracting what that role shouldn't see:

- **Managing Partner / Administrator**: `ALL_MODULE_KEYS` — full visibility (Administrator additionally gets full Settings/Audit Logs *control*, not just visibility).
- **Senior Partner** (the baseline fee-earner set): everything except HR, Attendance, Leaves, Reports, Analytics, Settings, Audit Logs.
- **Partner, Associate**: mirror Senior Partner exactly.
- **Junior Associate, Paralegal**: Senior Partner's set minus Finance.
- **Legal Researcher**: Senior Partner's set minus Hearings, Billing, Finance (research-focused).
- **Reception**: `dashboard, clients, calendar, notifications` only (front-desk).
- **Accounts**: `dashboard, clients, matters, calendar, documents, billing, finance, reports, notifications` (firm-wide finance).
- **HR**: `dashboard, hr, attendance, leaves, reports, notifications`.
- **Office Manager**: `dashboard, calendar, billing, hr, reports, notifications, settings`.

The permission matrix (`permission-matrix.ts`) additionally encodes **F/C/V/—** (Full / Create / View / None) *within* a visible module per role — e.g. Reception can Create clients but has no access to Matters at all; Legal Researcher has Full access to Knowledge Base/Research but only View on Documents. Nav visibility is the coarse gate; the matrix is the fine-grained action-level gate that individual `actions.ts` files and UI (hide/disable buttons) should respect when a module supports more than one access tier per role.

## Client Portal

A structurally separate shell (`src/app/(roles)/client/`) with its own minimal-chrome layout, not part of the module registry above. Scoped to exactly one `Client` row via `User.clientId`. Tabs: Overview, Documents, Invoices, Messages — deliberately narrow, since portal users are external clients, not staff.

## Entity model → module mapping

Every nav module maps to one or more Prisma models (see [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md) for the full schema):

| Module | Primary model(s) |
|---|---|
| Clients | `Client` |
| Companies / Contacts | `Company`, `Contact` |
| Matters | `Matter`, `MatterTeamMember` |
| Court Cases | `CourtCase` |
| Hearings | `Hearing` |
| Tasks | `Task` |
| Calendar | derived from `Hearing.scheduledAt` + `Meeting.scheduledAt` (no separate `CalendarEvent` model) |
| Meetings | `Meeting` |
| Notes | `Note` |
| Documents | `DocumentFolder`, `DocumentFile`, `DocumentVersion` |
| Document Generator / Template Library | `Template` |
| Clause Library | `Clause` |
| Knowledge Base | `KnowledgeArticle` |
| Research | shares `KnowledgeArticle`-adjacent queries (see `src/features/research/queries.ts`) |
| Billing | `Invoice`, `InvoiceLineItem`, `Payment`, `Retainer`, `TimeEntry` |
| Finance | `Expense` + billing aggregates |
| HR | `User` (staff-role subset) |
| Attendance | `AttendanceRecord` |
| Leaves | `LeaveRequest` |
| Reports / Analytics | cross-cutting aggregate queries, no dedicated model |
| Notifications | `Notification` |
| Settings | `Firm`, `Office`, `PracticeArea`, `CourtListEntry`, plus live `User` management and the permission matrix (static data, not DB-backed) |
| Audit Logs | `ActivityLog` |
| Announcements | `Announcement` (surfaced on dashboards, not a standalone nav module) |

## Navigation resolution flow

1. `nav.ts` defines the flat `NAV_STRUCTURE` once.
2. Each role's `layout.tsx` calls `buildNavSections(roleBasePath, roleModuleKeys)` to get its filtered, href-resolved sections.
3. `Sidebar` renders sections; `Topbar`'s global search and quick actions draw from the same resolved list, so a role can never see a nav link, a search result, or a quick action for a module it doesn't have access to — one registry, three surfaces.
4. **Gap (tracked in [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)):** the `Breadcrumb` primitive (`src/components/ui/breadcrumb.tsx`) exists but nothing currently derives breadcrumb trails from the pathname + `NAV_STRUCTURE` — pages don't render breadcrumbs today. A `useBreadcrumbs()` hook was added under this audit (`src/hooks/use-breadcrumbs.ts`) to close this; wiring it into every role layout's header is follow-up work, not done as part of this pass.
