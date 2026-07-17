# Release Notes — v1.0

## Overview

LEXORA v1.0 is a complete, working practice-management platform for a
local/single-firm deployment, plus a full interface-driven readiness layer
for a future commercial SaaS version — built across three passes without
ever requiring an external service, cloud AI provider, or internet
connection to run.

## What's included

### Core practice management (original V1.0 build)

Every persona in the PRD — Managing Partner, Senior Partner, Partner,
Associate, Junior Associate, Legal Researcher, Paralegal, Reception,
Accounts, HR, Office Manager, Administrator, and a separate Client Portal —
with a role-appropriate dashboard and module set. Clients, Matters, Court
Cases, Hearings, Tasks, Calendar, Meetings, Notes, Documents, Document
Generator (template library), Clause Library, Knowledge Base, Research,
Billing, Finance, HR, Attendance, Leaves, Reports, Analytics, Notifications,
Settings, and Audit Logs are all real, Prisma-backed modules — not
placeholders. Real authentication (`crypto.scrypt` + DB-backed sessions).

### Workflow engine (this release)

Matter stage pipeline (Inquiry → Archive) and document approval pipeline
(Draft → Review → Partner Approval → Client Approval → Signed → Filed),
each with rule-based transition validation, wired into the UI via matter
stage controls, hearing update dialogs, and payment recording.

### SaaS-readiness platform layer (`src/lib/platform/`)

Interface-driven scaffolding for auth/permissions, multi-tenancy, billing/
subscriptions, storage, notifications, AI, centralized configuration,
structured logging, caching, typed error handling, and security headers/
rate-limiting — all defaulting to local/mock providers so the app's
behavior is unchanged today. See `src/lib/platform/README.md`.

### AI-first legal engine layer

- **AI Document Generator** — 15 legal document types generated
  deterministically from structured forms, with a full draft → review →
  revision → approval → export workflow (export creates a real file in the
  Documents module).
- **Document Comparison Engine** — real line-level diff (added/removed/
  modified/moved) between two versions of a generated document.
- **Risk Analysis Engine** — 8 configurable, rule-based checks over live
  data (missing signatures/approvals, expired contracts, upcoming
  limitation periods, overdue invoices/hearings/tasks, missing mandatory
  documents).
- **Smart Timeline** — unified chronological event feed per matter.
- **Clause Library & Knowledge Engine** enhancements — jurisdiction, risk
  level, clause relationships, cross-references, full-text search, real
  usage tracking.
- **Matter Assistant** — real pending-task/deadline surfacing plus
  AI-provider-backed (currently mock) narrative summaries and meeting
  briefs.
- **AI provider architecture** — a full `AIProvider` interface, prompt
  registry/pipeline, model manager, and fallback strategy, with a
  genuinely functional local-only Ollama provider and inert placeholders
  for other local runtimes and cloud providers (none connected).

### Production/enterprise hardening (this release)

- Global `loading.tsx`/`error.tsx`/`not-found.tsx` (previously: Next's
  unstyled defaults).
- WCAG AA accessibility fixes across the shared design system — color
  contrast (status pills, tabs, sidebar navigation), missing accessible
  names on icon-only buttons and filter dropdowns used app-wide, a
  disconnected mobile quick-actions button.
- A confirmation dialog wired into the one previously-unconfirmed
  destructive action (court list deletion).
- Expanded automated test coverage: unit, component, integration
  (real isolated-database), workflow/business-rule, and accessibility
  tests.
- `CONTRIBUTING.md` and this documentation set.

## Demo credentials

See `README.md`.

## Upgrading from a prior local install

```bash
git pull
npm install
npm run db:migrate
npm run dev
```

No manual data migration is needed — all schema changes in this release
are additive (new nullable fields, new models); existing seeded/demo data
is unaffected.
