# LEXORA — Product Requirements Document

**The Operating System for Modern Law Firms**

| | |
|---|---|
| **Document type** | Master Product Requirements Document (PRD) |
| **Product** | LEXORA |
| **Owner** | Product & Engineering Leadership |
| **Status** | Living document — source of truth for all product and engineering decisions |
| **Audience** | Product, Engineering, Design, QA, Legal Operations, Executive Sponsors |

This document is the master blueprint for LEXORA. It is written so that a
development team can design, build, test, and ship the entire application —
from a single-partner boutique practice to a 2,000-lawyer global firm —
without needing to ask clarifying questions about scope, behavior, or intent.
Where a decision has not yet been made, this document states the default
assumption explicitly rather than leaving a gap.

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Mission](#2-mission)
3. [Target Users](#3-target-users)
4. [User Personas](#4-user-personas)
5. [Information Architecture](#5-information-architecture)
6. [Module Specifications](#6-module-specifications)
7. [Core Workflows](#7-core-workflows)
8. [Data Model](#8-data-model)
9. [Business Rules](#9-business-rules)
10. [Validation Rules](#10-validation-rules)
11. [File Storage Structure & Naming Conventions](#11-file-storage-structure--naming-conventions)
12. [Status, Priority & Lifecycle Systems](#12-status-priority--lifecycle-systems)
13. [Non-Functional Requirements](#13-non-functional-requirements)
14. [Future AI Features](#14-future-ai-features)
15. [Future Automation Features](#15-future-automation-features)
16. [Future Integrations](#16-future-integrations)
17. [Development Roadmap](#17-development-roadmap)

---

## 1. Product Vision

Law firms run on more disconnected tools than almost any other professional
services industry: practice management in one system, billing in another,
document storage in a shared drive, research in a browser tab, client
communication in email, and firm knowledge trapped in the heads of senior
partners. LEXORA's vision is to become the **single operating system** a law
firm runs on — the one place a Managing Partner opens in the morning to see
the state of the entire firm, and the one place a first-year associate opens
to know exactly what to do next.

LEXORA is built to feel like the software teams already love — Linear's
speed, Notion's flexibility, Stripe's precision, Vercel's polish — applied to
the specific, high-stakes, deadline-driven, trust-based world of legal
practice. It should never feel like "enterprise software." It should feel
inevitable: the way a modern law firm obviously ought to run.

LEXORA is designed to scale from a solo practitioner to the largest law
firms in the world without changing its underlying model — only its
configuration. The same matter lifecycle, the same document vault, the same
billing engine that serves a two-person boutique also serves a multinational
firm with dozens of practice groups, hundreds of partners, and thousands of
active matters, differentiated by permissions, firm configuration, and scale,
not by a different product.

## 2. Mission

To give every person in a law firm — from the Managing Partner to the
receptionist to the client waiting for an update — a single, fast, reliable,
beautifully designed place to do their part of the firm's work, so that:

- **No matter is ever at risk** because a deadline, hearing date, or filing
  requirement was tracked in someone's personal notebook instead of a system
  of record.
- **No revenue is ever lost** because billable time or an expense was never
  captured, or an invoice was never sent.
- **No client is ever left wondering** what is happening with their matter.
- **No institutional knowledge walks out the door** when a partner retires,
  because templates, clauses, research, and precedent live in the firm's
  system, not in one person's file cabinet.
- **Every role, from Managing Partner to Paralegal, has software that fits
  the way they actually work**, not a generic CRM repurposed for legal use.

## 3. Target Users

LEXORA is built for **law firms of every size and structure**:

- **Solo practitioners** who need enterprise-grade organization without
  enterprise-grade complexity or cost.
- **Boutique and mid-size firms** (5–100 lawyers) who are outgrowing
  spreadsheets, shared drives, and disconnected point tools.
- **Large and enterprise law firms** (100–2,000+ lawyers, multiple offices,
  multiple practice groups) who need firm-wide visibility, granular
  permissions, audit-grade compliance, and the ability to configure the
  system to match complex organizational structures.
- **In-house legal departments** (future-facing) who manage matters, outside
  counsel, and contracts with the same rigor as a law firm.

LEXORA is **role-first, not feature-first**: every module exists because a
specific persona needs it to do their job, and every persona has a
purpose-built home screen rather than a single undifferentiated dashboard.

## 4. User Personas

Each persona below defines how that role experiences LEXORA: what they are
responsible for, what a normal day looks like, what they are trying to
achieve, what currently makes their job harder than it should be, what they
are allowed to see and do inside the system, and which modules are core to
their daily work versus occasional use.

Permissions are expressed at three levels: **Full** (create, read, update,
delete, and configure), **Contribute** (create, read, update within scope —
typically limited to matters/records they are assigned to), **View** (read
only), and **None** (module hidden or inaccessible). Firm-wide financial and
administrative data is restricted by default to roles with a legitimate
business need; the Administrator can grant broader access through Settings →
Permissions (see [§6.31](#631-settings)).

---

### 4.1 Managing Partner

**Responsibilities**
- Owns overall firm performance: revenue, profitability, utilization, client
  retention, and growth.
- Sets firm-wide strategy, practice area investment, and partner
  compensation inputs.
- Final escalation point for major client relationships, conflicts, and
  risk decisions.
- Approves firm-wide configuration: offices, practice areas, billing
  policy, branding.

**Daily Workflow**
1. Opens the Executive Dashboard first thing — reviews revenue vs. target,
   pending bills, today's hearings, and firm-wide alerts.
2. Scans Recent Activity and Announcements for anything requiring attention.
3. Reviews Reports (weekly/monthly cadence) for practice area performance
   and lawyer utilization.
4. Spot-checks a handful of high-value matters for status.
5. Approves large invoices, write-offs, or fee arrangements referred by
   partners.
6. Uses Quick Actions to open new matters or clients personally originated.

**Goals**
- See the entire firm's health in under 60 seconds each morning.
- Catch revenue leakage (unbilled time, stalled invoices) before it
  compounds.
- Ensure no matter is silently at risk of a missed deadline.
- Make data-driven decisions about headcount, practice investment, and
  compensation.

**Pain Points**
- Historically, firm-wide visibility required chasing partners for status
  updates or waiting for month-end reports from Accounts.
- Revenue and utilization data lived in spreadsheets that were stale the
  moment they were exported.
- No single view combined pipeline, billing, and people data.

**Permissions**
- **Full** access to all modules, all matters, all financial data, and all
  Settings/Firm Configuration.
- Only role (besides Administrator) that can view firm-wide compensation
  inputs and partner-level profitability.

**Modules Used** (daily): Dashboard, Matters, Clients, Billing, Finance,
Reports, Tasks, Calendar. (frequent): HR, Analytics, Announcements, Audit
Logs. (occasional): Settings, Firm Configuration.

---

### 4.2 Senior Partner

**Responsibilities**
- Owns a portfolio of the firm's largest and most strategic client
  relationships and matters.
- Leads a practice group or major client team; mentors partners and
  associates.
- Sets matter strategy, approves major filings and settlement positions.
- Contributes to firm governance and business development.

**Daily Workflow**
1. Reviews their personal matter list and today's hearing/deadline queue.
2. Reviews drafts prepared by associates awaiting their review/approval.
3. Attends client calls/meetings logged via Meetings.
4. Reviews and approves time entries and invoices for their matters.
5. Assigns tasks to associates and paralegals on active matters.

**Goals**
- Never miss a deadline or hearing across a large, complex matter load.
- Delegate confidently, knowing task status and document versions are
  visible without asking.
- Maintain strong client relationships through timely updates.
- Maximize billable realization on their book of business.

**Pain Points**
- Tracking dozens of concurrent matters across email, calendar, and paper
  files is error-prone.
- No easy way to see "what is everyone on my team doing right now" without
  interrupting them.
- Approving invoices required manually reconciling time entries against
  memory.

**Permissions**
- **Full** on matters and clients they own or are assigned to as
  Lead/Associate on the matter team; **View** on other partners' matters
  unless shared.
- **Contribute** on Billing for their own matters (can approve/edit draft
  invoices tied to their matters); **View** on firm-wide Finance.
- **None** on firm-wide HR/Payroll and other partners' compensation.

**Modules Used** (daily): Dashboard (personal view), Matters, Tasks,
Calendar, Hearings, Documents, Billing. (frequent): Clients, Meetings,
Notes, Document Generator, Clause Library. (occasional): Reports,
Knowledge Base.

---

### 4.3 Partner

**Responsibilities**
- Manages an active caseload of matters, typically within one or two
  practice areas.
- Directly responsible for client communication, strategy, and final
  work-product quality on their matters.
- Supervises associates and paralegals staffed to their matters.
- Contributes to billing (time entries, narrative review, fee discussions).

**Daily Workflow**
1. Reviews today's schedule (hearings, meetings, deadlines).
2. Works through the task board for matters they lead.
3. Reviews and marks up documents/drafts from associates.
4. Logs time entries and notes throughout the day.
5. Communicates with clients directly for matters they own.

**Goals**
- Keep every matter moving without personally tracking every detail.
- Produce excellent work product efficiently, reusing firm templates and
  clauses rather than starting from scratch.
- Maintain full visibility into billing status for their matters.

**Pain Points**
- Constant context-switching between matters with no single "my work today"
  view.
- Time entry is often done from memory at end of day/week, causing lost
  billable time.
- Hard to know which document version is the "current" one when
  collaborating with associates.

**Permissions**
- **Full** on matters they are Lead on; **Contribute** on matters they are a
  team member on; **View** on firm-wide matters list (metadata only, not
  full content) unless explicitly shared.
- **Contribute** on Billing for their own matters; **None** on firm-wide
  Finance/HR.

**Modules Used** (daily): Dashboard (personal), Tasks, Calendar, Hearings,
Documents, Matters. (frequent): Clients, Billing, Document Generator, Clause
Library, Meetings, Notes. (occasional): Knowledge Base, Reports (own
performance only).

---

### 4.4 Associate

**Responsibilities**
- Executes substantive legal work assigned by partners: drafting, research,
  filing preparation, hearing preparation.
- Maintains matter documentation and keeps task status current.
- Logs billable time accurately and promptly.
- Communicates status to supervising partner.

**Daily Workflow**
1. Opens their personal task queue, sorted by due date/priority.
2. Works through drafting/research tasks, using Document Generator, Template
   Library, and Clause Library.
3. Uploads drafts to the matter's Documents tab for partner review.
4. Logs time entries against tasks/matters as work is completed.
5. Updates task status (To Do → In Progress → In Review) as work
   progresses.
6. Attends internal case-strategy meetings and hearings alongside partners.

**Goals**
- Always know exactly what to work on next and by when.
- Produce high-quality drafts quickly by starting from firm-approved
  templates and clauses rather than blank pages.
- Get partner feedback on drafts without version confusion.
- Hit personal utilization targets.

**Pain Points**
- Ambiguity about task priority and ownership across multiple partners'
  requests.
- Recreating boilerplate clauses/documents that already exist somewhere in
  the firm.
- Feedback on drafts arrives via email/track-changes with no link back to
  the matter.

**Permissions**
- **Contribute** on matters they are assigned to (documents, tasks, notes,
  time entries); **View** on matter metadata for matters in their practice
  group.
- **None** on firm-wide Billing/Finance/HR; **View** own time entries and
  utilization only.

**Modules Used** (daily): Tasks, Documents, Document Generator, Clause
Library, Template Library, Calendar. (frequent): Matters, Hearings,
Research, Knowledge Base, Notes. (occasional): Meetings, Billing (time entry
only).

---

### 4.5 Junior Associate

**Responsibilities**
- Performs foundational legal work under close supervision: legal research,
  first-draft document preparation, cite-checking, hearing bundle
  preparation, diligence review.
- Learns firm precedent, templates, and clause standards.
- Logs time and keeps assigned tasks updated in real time.

**Daily Workflow**
1. Reviews assigned tasks (typically narrower and more numerous than a
   senior associate's).
2. Conducts research via the Research module, saving findings to the
   matter and/or Knowledge Base.
3. Drafts using firm templates with heavy reliance on the Clause Library to
   ensure compliance with firm standards.
4. Submits work for review, marking tasks "In Review."
5. Logs time in small increments throughout the day.

**Goals**
- Build competence and speed using firm-standard templates and precedent
  rather than guessing at format.
- Get clear, fast feedback loops with supervising associates/partners.
- Understand exactly what "done" looks like for each task.

**Pain Points**
- Uncertainty about which template/clause version is current and firm-
  approved.
- Fear of missing something because visibility into the full matter picture
  is limited.
- Time tracking discipline is hardest to maintain in this role — smallest
  tasks are most likely to go unlogged.

**Permissions**
- **Contribute** limited to tasks/documents explicitly assigned; **View**
  on the matters they are staffed to (not firm-wide).
- **None** on Billing (beyond personal time entry), Finance, HR, Settings.

**Modules Used** (daily): Tasks, Research, Documents, Clause Library,
Template Library. (frequent): Knowledge Base, Calendar, Notes. (occasional):
Matters (limited view), Hearings.

---

### 4.6 Legal Researcher

**Responsibilities**
- Provides deep legal research support across multiple matters and practice
  groups (case law, statutes, regulatory guidance, precedent).
- Maintains and grows the firm's Knowledge Base with practice notes,
  guides, and precedent summaries.
- Supports brief and memo preparation with citation-checked research
  output.

**Daily Workflow**
1. Reviews research requests queued as Tasks, tagged by matter and
   deadline.
2. Conducts research using the Research module; logs sources and findings.
3. Publishes reusable findings (statutes, case summaries, regulatory
   updates) to the Knowledge Base.
4. Attaches research memos directly to the requesting matter's Documents
   tab.
5. Flags precedent-setting developments to relevant practice group leads.

**Goals**
- Deliver accurate, well-sourced research quickly, without duplicating work
  already done elsewhere in the firm.
- Build a Knowledge Base that measurably reduces research time over time.
- Be discoverable and taskable by any practice group, not siloed to one.

**Pain Points**
- No central place to search "has anyone at the firm already researched
  this exact issue?"
- Research findings often lived only in one matter's file and were
  invisible to the rest of the firm.
- Difficult to track research request volume and turnaround time.

**Permissions**
- **Contribute** on Research and Knowledge Base (firm-wide); **View** on
  matters they are assigned a research task for (read-only on matter
  content beyond their task).
- **None** on Billing, Finance, HR, client contact details beyond what is
  necessary for the research context.

**Modules Used** (daily): Research, Tasks, Knowledge Base. (frequent):
Documents, Clause Library, Matters (limited view). (occasional): Calendar,
Notes.

---

### 4.7 Paralegal

**Responsibilities**
- Provides direct case support: document preparation, filing logistics,
  hearing bundle assembly, deadline calendaring, client file organization.
- Maintains document vault hygiene (naming, versioning, tagging) for
  assigned matters.
- Coordinates with court staff, process servers, and vendors.

**Daily Workflow**
1. Reviews today's filing deadlines and hearing prep checklist.
2. Organizes and uploads documents to the correct matter folder, applying
   tags.
3. Prepares hearing bundles and confirms attendance logistics.
4. Updates task status and logs time against matter work.
5. Coordinates directly with Reception and Accounts on client file logistics
   and expense receipts.

**Goals**
- Ensure nothing related to filings or hearing logistics is ever missed.
- Keep the document vault clean and easy for attorneys to navigate.
- Be the reliable operational backbone that lets attorneys focus on
  substantive work.

**Pain Points**
- Deadlines tracked in personal calendars/notebooks with no firm-wide
  backup.
- Document versioning chaos when multiple people touch the same file.
- No visibility into the bigger matter picture, making prioritization hard
  when juggling many matters at once.

**Permissions**
- **Contribute** on Documents, Tasks, Hearings, Notes for matters they are
  assigned to; **View** on matter metadata.
- **None** on Billing/Finance/HR beyond logging their own time and matter
  expenses.

**Modules Used** (daily): Tasks, Documents, Hearings, Calendar.
(frequent): Matters (limited), Notes, Document Generator, Clause Library.
(occasional): Clients, Knowledge Base.

---

### 4.8 Receptionist

**Responsibilities**
- First point of contact for clients, visitors, and callers.
- Manages front-office scheduling: intake appointments, meeting room
  bookings, visitor logs.
- Performs initial client intake data entry.
- Routes inquiries to the correct partner/associate/department.

**Daily Workflow**
1. Reviews today's Calendar for scheduled visitors, meetings, and
   consultations.
2. Handles walk-ins and calls; creates new Client intake records for
   prospects.
3. Books meeting rooms and confirms attendee availability.
4. Notifies relevant fee-earners of arrivals and messages.
5. Maintains visitor and call logs.

**Goals**
- Never let a prospective client's first interaction feel disorganized.
- Correctly route every inquiry to the right person the first time.
- Keep the firm's calendar and meeting rooms conflict-free.

**Pain Points**
- No system visibility into which lawyers are in client meetings, in court,
  or available.
- Client intake historically captured on paper and re-entered later,
  causing delay and errors.
- No easy way to see firm-wide availability for scheduling.

**Permissions**
- **Contribute** on Client intake (create/edit basic profile only, no
  matter or financial data) and Calendar/Meetings (scheduling only).
- **View** on firm directory/availability (Calendar, HR basic directory).
- **None** on Matters, Documents, Billing, Finance, HR records beyond the
  directory.

**Modules Used** (daily): Calendar, Meetings, Clients (intake only).
(frequent): Notifications. (occasional): HR directory (view only).

---

### 4.9 Accounts

**Responsibilities**
- Owns firm billing operations: invoice generation, payment reconciliation,
  expense processing, retainer management, collections follow-up.
- Maintains accurate financial records for the firm and produces finance
  reports for the Managing Partner.
- Ensures billing complies with firm policy and, where applicable,
  client-specific billing guidelines (e.g., outside counsel guidelines).

**Daily Workflow**
1. Reviews the Billing queue: draft invoices ready for review, overdue
   invoices needing follow-up.
2. Reconciles incoming payments against outstanding invoices.
3. Processes and categorizes submitted expenses (billable/non-billable).
4. Manages retainer balances and triggers replenishment requests.
5. Prepares periodic finance summaries (collections, aging, realization)
   for partners and the Managing Partner.

**Goals**
- Minimize Days Sales Outstanding (DSO) and maximize collection rate.
- Ensure every billable hour and expense is invoiced — zero revenue
  leakage.
- Give partners self-service visibility into their own billing status to
  reduce back-and-forth.

**Pain Points**
- Reconciling time entries across multiple attorneys' inconsistent logging
  habits.
- Manually chasing partners for invoice approval before sending to clients.
- No real-time view of firm-wide outstanding/overdue balances without
  building a report from scratch.

**Permissions**
- **Full** on Billing, Invoices, Payments, Expenses, Retainers, Finance
  (firm-wide).
- **View** on Matters and Clients (for billing context only — not
  substantive matter content/documents).
- **None** on HR/Payroll (unless also holding that responsibility, governed
  by a separate permission grant), Settings beyond Invoice Settings.

**Modules Used** (daily): Billing, Invoices, Payments, Expenses.
(frequent): Finance, Reports, Clients, Matters (billing view). (occasional):
Settings (Invoice Settings), Notifications.

---

### 4.10 HR

**Responsibilities**
- Owns firm people operations: employee records, onboarding/offboarding,
  attendance, leave management, and (future) payroll.
- Maintains office and team structure data used across the firm (offices,
  roles, reporting lines).
- Supports culture and compliance initiatives (policy acknowledgement,
  training records — future scope).

**Daily Workflow**
1. Reviews pending leave requests and approves/declines.
2. Monitors attendance exceptions (late, absent, missing clock-out).
3. Processes new hire/departure records and updates org structure.
4. Responds to employee questions routed through HR module tickets
   (future scope) or direct contact.
5. Prepares headcount and utilization-adjacent reports for the Managing
   Partner (utilization itself is sourced from Time Entries; HR provides
   headcount/capacity context).

**Goals**
- Maintain a single accurate source of truth for who works at the firm,
  in what role, in which office.
- Make leave and attendance simple and transparent for every employee.
- Be ready for Payroll (future) without re-architecting employee data.

**Pain Points**
- Employee data duplicated across a separate HR tool, payroll spreadsheet,
  and the practice management system's user list.
- Leave requests tracked via email with no audit trail.
- No visibility into whether attendance/leave issues correlate with
  utilization or matter staffing problems.

**Permissions**
- **Full** on HR, Employees, Attendance, Leaves, and (future) Payroll.
- **View** on firm directory and office structure (read/write on
  Settings → Firm Configuration for office/team structure, in coordination
  with Administrator).
- **None** on Matters, Documents, Billing/Finance (beyond headcount-linked
  reporting).

**Modules Used** (daily): HR, Employees, Attendance, Leaves. (frequent):
Reports (headcount), Notifications. (occasional): Settings (Firm
Configuration — offices/teams), Payroll (future).

---

### 4.11 Office Manager

**Responsibilities**
- Owns day-to-day office operations: facilities, vendor management, supply
  procurement, IT liaison, and firm-wide administrative coordination.
- Coordinates cross-functional logistics between Reception, Accounts, HR,
  and fee-earners.
- Maintains office-level Settings (locations, contact details, meeting
  rooms) in Firm Configuration.

**Daily Workflow**
1. Reviews firm-wide Announcements and posts operational updates (office
   closures, facilities notices).
2. Coordinates meeting room and resource scheduling conflicts escalated by
   Reception.
3. Tracks vendor and facilities tasks (future: Vendor Management module).
4. Liaises with Accounts on non-matter (overhead) expenses.
5. Supports onboarding logistics (workstation, access) for new hires
   alongside HR.

**Goals**
- Keep the office running invisibly — nothing should block a fee-earner
  from doing billable work due to an operational gap.
- Maintain accurate, current office/location data across the system.
- Be the operational nerve center without needing access to substantive
  matter or client data.

**Pain Points**
- Operational requests scattered across email, chat, and verbal asks with
  no tracking.
- No single view of firm-wide announcements, office schedules, and resource
  bookings.

**Permissions**
- **Full** on Settings → Firm Configuration (offices, meeting rooms,
  branding) subject to Administrator oversight; **Contribute** on
  Announcements.
- **View** on Calendar/Meetings (firm-wide, for resource coordination).
- **None** on Matters, Documents, Billing/Finance, HR employee records
  (beyond directory).

**Modules Used** (daily): Announcements, Calendar. (frequent): Settings
(Firm Configuration), Notifications. (occasional): HR (directory view),
Reports (operational).

---

### 4.12 Client

**Responsibilities** *(within the Client Portal — see [§6.35](#635-client-portal))*
- Reviews the status of their own matter(s).
- Uploads requested documents and reviews documents shared by the firm.
- Views and pays invoices.
- Communicates with their legal team through a secure channel.

**Daily Workflow** *(episodic, not daily)*
1. Receives a notification (email/portal) that there is an update on their
   matter.
2. Logs into the Client Portal to view matter status, recent documents, or
   an invoice.
3. Uploads a requested document or responds to a request for information.
4. Pays an outstanding invoice online (future: online payment
   integration).
5. Sends a message to their attorney through the portal's secure
   messaging.

**Goals**
- Always know the current status of their matter without having to call
  or email and wait for a reply.
- Have one secure place for documents and invoices related to their case.
- Feel confident their information is private and only visible to their
  own legal team.

**Pain Points**
- Historically, status updates only came when the client proactively
  called or emailed.
- Documents exchanged via email were hard to track and insecure.
- Invoices arrived as PDFs with no online payment option and no visibility
  into payment history.

**Permissions**
- **View** on their own matter(s) status, shared documents, and invoices
  only; **Contribute** limited to uploading requested documents and sending
  secure messages.
- **None** on any other client's data, firm-internal notes, task
  assignments, internal documents not explicitly shared, or any
  firm-operational module.

**Modules Used**: Client Portal only (a scoped, firm-branded surface — the
client never sees the internal application shell, sidebar, or any module
outside the portal's four tabs: Overview, Documents, Invoices, Messages).

---

### 4.13 Administrator

**Responsibilities**
- Owns the technical and security configuration of the LEXORA instance for
  the firm: user provisioning, roles and permissions, security policy,
  integrations, and system-level settings.
- Manages Audit Logs and compliance reporting.
- Acts as the internal point of contact for support/escalations related to
  the system itself (distinct from legal work).

**Daily Workflow**
1. Reviews pending user provisioning/deprovisioning requests (new hires,
   departures).
2. Reviews Audit Logs for anomalies (unusual access patterns, permission
   changes, bulk exports).
3. Configures/updates roles and permission grants as the firm's structure
   evolves.
4. Manages integration health (future: e-signature, calendar sync,
   accounting export) and resolves configuration issues.
5. Responds to Settings/configuration requests from Office Manager, HR, or
   partners.

**Goals**
- Ensure the right people have exactly the right access — no more, no
  less — at all times.
- Maintain a complete, tamper-evident audit trail for compliance and risk
  management.
- Keep the system configured correctly as the firm grows, reorganizes, or
  opens new offices.

**Pain Points**
- Historically, "who has access to what" was undocumented and only
  discoverable by trial and error.
- No audit trail existed for sensitive actions (who viewed/exported client
  financial data, who deleted a document).
- Permission changes required a developer/vendor ticket rather than
  self-service configuration.

**Permissions**
- **Full** on Settings, Firm Configuration, Audit Logs, and all
  permission/role management.
- **View** on all modules for support/troubleshooting purposes, with every
  such access logged in the Audit Log (view access to sensitive
  client/financial data by an Administrator is itself an auditable event).
- Cannot silently alter matter, billing, or client substantive data — any
  administrative edit to business data is flagged and logged distinctly
  from a normal user edit.

**Modules Used** (daily): Settings, Audit Logs, Notifications. (frequent):
Firm Configuration, HR (directory/provisioning coordination). (occasional):
all modules, in a support/oversight capacity.

---

## 5. Information Architecture

### 5.1 Navigation Model

LEXORA has two distinct application shells:

1. **The Firm Workspace** — the internal application used by every persona
   in §4.1–§4.11 and §4.13. Role-based, with a persistent left sidebar,
   top bar (global search, quick actions, notifications, profile), and a
   home dashboard tailored to the signed-in role.
2. **The Client Portal** — a separate, firm-branded, minimal-chrome surface
   used only by the Client persona (§4.12). No sidebar, no access to
   internal modules; four tabs only (Overview, Documents, Invoices,
   Messages). See [§6.35](#635-client-portal).

### 5.2 Firm Workspace Sidebar Structure

```
Overview
  └─ Dashboard

CRM
  ├─ Clients
  ├─ Companies
  └─ Contacts

Practice
  ├─ Matters
  ├─ Court Cases
  ├─ Hearings
  ├─ Tasks
  ├─ Calendar
  ├─ Meetings
  └─ Notes

Documents & Knowledge
  ├─ Documents
  ├─ Document Generator
  ├─ Template Library
  ├─ Clause Library
  ├─ Knowledge Base
  └─ Research

Finance
  ├─ Billing
  ├─ Invoices
  ├─ Payments
  ├─ Expenses
  └─ Finance

People
  ├─ HR
  ├─ Employees
  ├─ Attendance
  ├─ Leaves
  └─ Payroll (future)

Insights
  ├─ Reports
  └─ Analytics

System
  ├─ Notifications
  ├─ Settings
  ├─ Firm Configuration
  └─ Audit Logs

AI Assistant (global — accessible from every screen via command palette
              and a dedicated module)
```

The sidebar is **rendered dynamically per role**: a persona only sees the
groups and modules their permission set includes (per §4). A Junior
Associate, for example, never sees the "Finance" or "People" groups at all
— they are not merely disabled, they are absent, keeping each role's
experience focused and uncluttered.

### 5.3 Global Top Bar (present on every Firm Workspace screen)

- **Firm name / current date** — left-aligned, always visible.
- **Global Search** (`⌘K` / `Ctrl K`) — searches clients, matters,
  documents, contacts, tasks, and knowledge base articles in one unified,
  keyboard-first command palette.
- **Quick Actions** — a role-aware "+" menu (New Client, New Matter, New
  Task, New Invoice, Schedule Hearing, Upload Document, etc.), showing only
  actions the current role is permitted to perform.
- **Notifications** — bell icon with unread badge; opens a panel of recent,
  role-relevant events (see [§6.30](#630-notifications)).
- **AI Assistant launcher** — always-available entry point into the AI
  Assistant (see [§6.34](#634-ai-assistant)).
- **Theme toggle** — light / dark / system.
- **Profile menu** — current user, role, office; role-switcher in
  non-production/demo contexts only.

### 5.4 Role → Module Access Matrix

Legend: **F** = Full · **C** = Contribute (scoped) · **V** = View only ·
**—** = No access / hidden.

| Module | Managing Partner | Senior Partner | Partner | Associate | Jr. Associate | Legal Researcher | Paralegal | Reception | Accounts | HR | Office Mgr | Administrator |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Dashboard | F | F | F | F | F | F | F | F | F | F | F | F |
| Clients / Companies / Contacts | F | C | C | C | V | V | C | C(intake) | V | — | — | V |
| Matters / Court Cases | F | C | C | C | V | V | C | — | V | — | — | V |
| Hearings | F | C | C | C | V | — | C | — | — | — | — | V |
| Tasks | F | C | C | C | C | C | C | — | — | — | — | V |
| Calendar / Meetings | F | C | C | C | V | V | C | C | V | — | V | V |
| Notes | F | C | C | C | V | V | C | — | — | — | — | V |
| Documents | F | C | C | C | C | C | C | — | V | — | — | V |
| Document Generator | F | C | C | C | C | V | C | — | — | — | — | V |
| Template / Clause Library | F | C | C | C | C | V | C | — | — | — | — | V |
| Knowledge Base / Research | F | V | V | V | C | F | V | — | — | — | — | V |
| Billing / Invoices / Payments | F | C | C | C(time) | C(time) | — | — | — | F | — | — | V |
| Expenses | F | C | C | C | C | — | C | — | F | — | C | V |
| Finance | F | V | — | — | — | — | — | — | F | — | — | V |
| HR / Employees / Attendance / Leaves | V | — | — | — | — | — | — | — | — | F | V | V |
| Payroll (future) | V | — | — | — | — | — | — | — | C | F | — | V |
| Reports / Analytics | F | C(own) | V(own) | V(own) | — | — | — | — | C | C | V | V |
| Notifications | F | F | F | F | F | F | F | F | F | F | F | F |
| Settings / Firm Configuration | F | — | — | — | — | — | — | — | C(invoice) | C(structure) | C(office) | F |
| Audit Logs | V | — | — | — | — | — | — | — | — | — | — | F |
| AI Assistant | F | F | F | F | F | F | F | C | F | F | F | F |

### 5.5 Page Archetypes

Every module in this document follows one or more of five reusable page
archetypes, each with a consistent component vocabulary so the product
feels like one system rather than 35 bespoke screens:

1. **List Page** — Page header (title, description, primary action) →
   quick-filter tabs (where applicable) → toolbar (search + filters) →
   data table (sortable columns, row click-through) → pagination. Empty
   state when zero records match. Used by: Clients, Companies, Contacts,
   Matters, Hearings, Documents, Invoices, Payments, Expenses, Employees,
   Templates, Clauses, Knowledge Base, Audit Logs, and more.
2. **Detail Page** — Header (identity, status, key stats) → tabbed
   sub-sections (Overview, Documents, Tasks, Notes, Activity, etc.) → each
   tab reusing the List Page or Form patterns as appropriate. Used by:
   Client Detail, Matter Detail, Employee Detail, Invoice Detail.
3. **Board Page** — Column-based workflow view (e.g., Tasks by status,
   Matter Pipeline by stage). Used by: Tasks, (future) Matter Pipeline
   Kanban.
4. **Dashboard/Analytics Page** — Grid of stat cards and charts, no single
   primary table. Used by: Dashboard, Reports, Analytics, Finance
   overview.
5. **Configuration Page** — Tabbed settings surface, form-heavy, no
   pagination. Used by: Settings, Firm Configuration.

Each module specification in §6 states which archetype(s) it uses and the
concrete components within it.

---

## 6. Module Specifications

Every module below follows the same specification template:

- **Purpose** — what the module is and why it exists.
- **Business Objective** — the firm-level outcome it drives.
- **User Story** — the primary "as a ___, I want ___, so that ___" statement(s).
- **Core Features** — the functional capabilities.
- **Key Actions** — the discrete user actions the module supports.
- **Inputs** — data the user or system provides into the module.
- **Outputs** — data, documents, or events the module produces.
- **Page Specification** — navigation, layout archetype, and every UI
  component: cards, buttons, filters, tables, forms, modals, drawers, quick
  actions, empty states, and validation behavior.
- **Future Scope** — capabilities intentionally deferred beyond the version
  this PRD's roadmap (§17) targets.

### 6.1 Dashboard

**Purpose**
The role-aware home screen. It is the first thing every internal user sees
on login and answers, at a glance, "what does my day/firm look like right
now?"

**Business Objective**
Reduce time-to-insight to near zero; surface risk (missed deadlines, unpaid
bills, unassigned tasks) before it becomes a problem; drive engagement by
making LEXORA the natural first tab open every morning.

**User Story**
As a **Managing Partner**, I want a single screen summarizing revenue,
pipeline, and firm activity, so that I don't need to ask five people for a
status update. As an **Associate**, I want my personal task and deadline
queue front and center, so that I always know what to do next.

**Core Features**
- Role-specific widget composition (Managing Partner sees firm-wide KPIs;
  Associate sees a personal "My Work Today" view; Accounts sees an AR
  snapshot).
- Real-time (server-rendered, revalidated on mutation) data — never a
  stale cached export.
- Configurable widget layout (future: drag-to-rearrange, per-user).

**Key Actions**
- View firm/personal KPIs. Drill into any widget (click-through to the
  underlying module, e.g., clicking "Today's Hearings" opens Hearings
  filtered to today).
- Launch Quick Actions directly from the dashboard.
- Mark a notification/announcement as read from the dashboard feed.

**Inputs**: aggregated read-only data from every other module (no direct
data entry on the dashboard itself, aside from Quick Actions launching
create-flows in other modules).

**Outputs**: none persisted — this is a read/aggregation surface. Clicking
a widget navigates to the source module.

**Page Specification** *(archetype: Dashboard/Analytics)*
- **Navigation**: default landing route for every internal role; always the
  first sidebar item ("Dashboard" / "Overview").
- **Components (Managing Partner view)**: Revenue, Pending Bills, Open
  Matters, Today's Hearings stat cards; Revenue Trend chart; Practice Area
  Distribution donut; Matter Pipeline bar chart; Task Overview; Today's
  Schedule (mini calendar + agenda); Upcoming Deadlines list; Team
  Utilization; Firm KPIs row (collection rate, utilization, matters closed,
  new clients); Recent Activity feed; Recent Clients; Quick Actions grid;
  Document Status + Recent Uploads; Announcements.
- **Components (Associate/Partner personal view)**: My Tasks Today, My
  Upcoming Hearings, My Deadlines This Week, My Matters (assigned), My
  Recent Documents, My Time This Week (logged vs. target).
- **Components (Accounts view)**: Outstanding AR, Overdue Invoices,
  Collections This Month, Aging buckets chart, Retainer balances below
  threshold.
- **Components (HR view)**: Headcount, Pending Leave Requests, Attendance
  Exceptions Today, Upcoming Anniversaries/Reviews (future).
- **Cards**: all stat cards support a trend indicator (↑/↓ vs. prior
  period) where a comparable prior period exists.
- **Buttons**: Quick Actions (role-filtered); "View all" link on every list
  widget.
- **Filters**: date-range control on trend charts (default: last 8 months
  for revenue, last 6 months for billing comparisons).
- **Empty States**: each widget defines its own — e.g., "No hearings
  scheduled today" with a calendar icon; "You're all caught up" for
  deadlines.
- **Validation**: N/A (read-only surface).

**Future Scope**: per-user customizable widget layout; saved dashboard
views per practice group; scheduled dashboard email digest; drill-down
comparison mode (this month vs. last month side-by-side).

---

### 6.2 Clients

**Purpose**
The firm's client relationship system of record — every individual or
organization the firm represents or has represented.

**Business Objective**
Centralize the client relationship (contact info, relationship owner,
matters, billing history, communications) so that any authorized user can
answer "what is our relationship with this client?" without contacting the
relationship partner.

**User Story**
As a **Managing Partner**, I want to see every client's total billing
history and open matters in one profile, so that I can assess relationship
health. As a **Receptionist**, I want to create a new client intake record
in under a minute, so that a walk-in prospect's information is captured
correctly the first time.

**Core Features**
- Client list with search, filter (status, type, industry, relationship
  manager), and sort.
- Client profile with tabs: Overview, Matters, Invoices, Documents,
  Timeline, Meetings, Notes, Communication.
- Individual vs. Company client types, each with type-specific fields.
- Relationship Manager assignment (drives Reports and territory logic).
- Conflict-check flag surfaced at intake (see §7.1, §9).

**Key Actions**
- Create client (full form or fast intake).
- Edit client profile; change status (Active / Inactive / Prospect).
- Assign/reassign relationship manager.
- Add a note; log a communication; schedule a meeting.
- Open a new matter for this client (deep-links into Matters with client
  pre-filled).
- Archive a client (soft delete; matters remain accessible for records
  retention).

**Inputs**: name, type (individual/company), industry, email, phone,
address, tax ID, source (referral/website/conference/etc.), relationship
manager, tags, status.

**Outputs**: client record consumed by Matters, Billing, Documents,
Communication Log, Reports, and the Client Portal (a client's own portal
identity is linked to their Client record).

**Page Specification** *(archetype: List Page + Detail Page)*
- **Navigation**: CRM → Clients.
- **List page — Cards**: none (table-first module); summary counts shown in
  the page header subtitle.
- **List page — Buttons**: "New Client" (primary, top-right).
- **List page — Filters**: status (All/Active/Prospect/Inactive), search
  by name/number/industry.
- **List page — Table columns**: Client (avatar + name + client #),
  Industry, Relationship Manager, Matters (count), Invoices (count),
  Status, Added (date). Row click → Detail page.
- **List page — Empty State**: "No clients found" with a prompt to adjust
  filters or add a new client.
- **Detail page — Header**: avatar, name, status pill, client #, industry,
  "client since" date, contact info row, quick stats (open matters, total
  billed, documents, relationship manager).
- **Detail page — Tabs**: Overview (company info grid + retainers),
  Matters (list, click-through), Invoices (list), Documents (list),
  Timeline (unified chronological feed across matters/notes/meetings/
  communications/invoices), Meetings, Notes (list + inline add-note
  composer), Communication (logged interactions by channel).
- **Forms**: New Client drawer — fields: type (radio: Company/Individual),
  name, industry, email, phone, city, state, source, relationship manager
  (required). Validation: name required (min 2 chars); email must be valid
  format if provided; relationship manager required.
- **Modals/Drawers**: New Client (drawer); Edit Client (drawer, same
  fields pre-filled).
- **Quick Actions**: "New Client" available from the global Quick Actions
  menu and the Dashboard.
- **Validation**: duplicate-name warning (non-blocking) if a client with a
  very similar name already exists, to reduce accidental duplicate
  records.

**Future Scope**: client health score (derived from responsiveness,
payment history, matter outcomes); client segmentation/tagging rules;
bulk import (CSV); merge duplicate clients; client satisfaction surveys.

---

### 6.3 Companies

**Purpose**
A structured representation of organizational clients that separates the
legal entity (the Company) from the individual people the firm interacts
with at that entity (Contacts, §6.4). Supports firms whose clients are
corporations, government bodies, or institutions with multiple stakeholders.

**Business Objective**
Prevent the common failure mode where "the client" is really three or four
different people at one organization with no structured relationship
between them — ensuring the firm always knows who the authorized signatory,
day-to-day contact, and billing contact are.

**User Story**
As a **Partner**, I want to see every contact at a corporate client and
who plays which role (legal counsel, procurement, finance), so that I send
the right document to the right person without asking.

**Core Features**
- Company profile: legal name, registration/incorporation details, industry,
  size, primary address, billing address (if different).
- Linked Contacts list with role tagging (Primary Contact, Billing Contact,
  Authorized Signatory, CC-only).
- Linked Matters and Invoices roll up at the Company level even when
  billed through a specific Contact.
- A Company **is** a Client record of type "Company" — Companies extends
  the Client entity rather than duplicating it (see §8).

**Key Actions**
- Create/edit company profile.
- Add/remove/re-role a contact under the company.
- View consolidated billing across all matters for the company.

**Inputs**: legal name, trade name, registration number, tax ID, industry,
company size, addresses (registered/billing), website.

**Outputs**: company record used by Matters, Billing (consolidated
statements), and Contacts.

**Page Specification** *(archetype: List Page + Detail Page — a filtered
view of Clients where type = Company)*
- **Navigation**: CRM → Companies.
- **Table columns**: Company, Industry, Primary Contact, Open Matters,
  Total Billed, Status.
- **Detail page — additional tab beyond the standard Client tabs**:
  "Contacts" (all people linked to this company, with role badges and
  quick actions to email/call).
- **Forms**: New Company drawer (superset of New Client form with
  registration number, company size, billing address fields).
- **Empty State**: "No companies yet" — same pattern as Clients.
- **Validation**: registration number format validated against the firm's
  configured jurisdiction pattern (Settings → Firm Configuration).

**Future Scope**: org chart visualization of a company's contacts;
subsidiary/parent company linking; automatic company data enrichment via a
business-registry integration.

---

### 6.4 Contacts

**Purpose**
Individual people linked to a Client or Company — the actual humans the
firm emails, calls, and meets with.

**Business Objective**
Ensure every communication and document goes to the correct, currently
authorized individual, and that departing individuals (e.g., a General
Counsel who leaves the client company) don't silently break the firm's
communication chain.

**User Story**
As an **Associate**, I want to know which contact at a client is the
authorized signatory before sending a document for signature, so that I
don't send it to the wrong person.

**Core Features**
- Contact profile: name, title, email, phone, linked Company/Client, role
  tag(s), preferred communication channel, notes.
- A Contact can be linked to more than one Company (e.g., an outside
  advisor who represents multiple client entities).
- Contact-level communication history (subset of the linked Client's
  Communication log, filtered to this person).

**Key Actions**
- Create/edit contact; link/unlink from a Company; assign role tag(s);
  mark a contact inactive (e.g., left the company) without deleting
  history.

**Inputs**: name, title, email, phone, linked company/client, role tag,
notes.

**Outputs**: contact record referenced by Matters (as client-side points of
contact), Meetings (attendees), Communication Log, and Document Generator
(recipient/signatory fields).

**Page Specification** *(archetype: List Page + Detail Page)*
- **Navigation**: CRM → Contacts.
- **Table columns**: Contact (avatar + name), Title, Company, Role tag(s),
  Email, Phone, Status (Active/Inactive).
- **Detail page**: contact info card, linked companies list, communication
  history, related matters (matters where this contact is the client-side
  point of contact).
- **Forms**: New Contact drawer — name, title, email, phone, company
  (searchable select), role tag (multi-select: Primary, Billing,
  Signatory, CC-only).
- **Quick Actions**: "New Contact" from a Company's Contacts tab or the
  global Quick Actions menu.
- **Validation**: email format validation; a contact must be linked to at
  least one Company/Client before saving.

**Future Scope**: vCard export/import; email/calendar sync to
auto-suggest new contacts from correspondence; contact deduplication
suggestions.

---

### 6.5 Matters

**Purpose**
The central unit of legal work. Every piece of substantive activity —
documents, tasks, hearings, time, billing — hangs off a Matter. This is the
single most important entity in LEXORA.

**Business Objective**
Give every stakeholder, from the responsible attorney to the Managing
Partner, a complete, current, single-source-of-truth view of a piece of
legal work: its status, team, financials, and history.

**User Story**
As a **Partner**, I want every document, task, hearing, and invoice related
to a matter in one place, so that I never have to reconstruct a matter's
history from scattered emails. As a **Managing Partner**, I want to see
every matter's stage and value across the firm, so that I can spot
stalled or at-risk work.

**Core Features**
- Matter list with filters (status, practice area, attorney, priority,
  client) and a Pipeline (Kanban-style) view by lifecycle stage.
- Matter detail with tabs: Timeline, Documents, Hearings, Tasks, Team,
  Notes, Research, Expenses, Invoices, Activity.
- Matter numbering auto-generated per firm convention (see §11.2).
- Billing type per matter (Hourly, Fixed Fee, Contingency, Retainer) drives
  downstream Billing behavior.
- Team assignment with role-on-matter (Lead, Associate, Paralegal,
  Support).
- Conflict check status recorded at matter creation (see §7.1).

**Key Actions**
- Create matter (from a client profile or standalone, always requires a
  client).
- Change status/stage; reassign responsible attorney; add/remove team
  members.
- Log a note; upload a document; schedule a hearing; create a task; log an
  expense; generate an invoice — all from within the matter detail page.
- Close matter; archive matter.

**Inputs**: title, description, client (required), practice area
(required), responsible attorney (required), priority, billing type,
hourly rate (if applicable), estimated value, opened date, target close
date, opposing party/counsel (litigation matters).

**Outputs**: matter record consumed by nearly every other module —
Hearings, Tasks, Documents, Billing, Time Entries, Expenses, Notes,
Meetings, Communication Log, Reports, Client Portal (client-visible matter
status).

**Page Specification** *(archetype: List Page + Board Page + Detail Page)*
- **Navigation**: Practice → Matters.
- **List page — Buttons**: "New Matter" (primary).
- **List page — Filters**: status (Intake/Active/On Hold/Closed/Archived),
  search by title/number/client.
- **List page — Table columns**: Matter (title + number + client),
  Practice Area (colored badge), Attorney, Priority, Status, Opened date.
- **Pipeline view (toggle from List)**: Kanban columns per matter status;
  drag (or status-select) to move a matter between stages.
- **Detail page — Header**: title, status pill, priority pill, matter
  number, client (link), practice area (colored), opposing party (if any).
  Stat cards: Responsible Attorney, Billing (type + rate), Billed to Date,
  Opened/Open Tasks.
- **Detail page — Tabs**:
  - *Timeline*: unified chronological feed (opened, hearings, tasks
    completed, documents uploaded, invoices issued, notes, time logged).
  - *Documents*: list, scoped to this matter, with upload.
  - *Hearings*: list, scoped to this matter, with schedule action.
  - *Tasks*: list, scoped to this matter.
  - *Team*: avatar grid with role-on-matter; add/remove member.
  - *Notes*: list + inline composer.
  - *Research*: related Knowledge Base articles (practice-area matched)
    and matter-specific research memos.
  - *Expenses*: list, scoped to this matter, with log-expense action.
  - *Invoices*: list, scoped to this matter.
  - *Activity*: raw audit trail of system-recorded actions on this matter.
- **Forms**: New Matter drawer — title, description, client (searchable
  select), practice area (select), responsible attorney (select),
  priority (Low/Medium/High/Urgent), billing type, estimated value.
  Validation: title min 3 chars; client, practice area, and responsible
  attorney required.
- **Empty States**: "No matters found" (list); "No hearings scheduled"
  (tab); "No documents yet" (tab), etc. — each tab has a scoped empty
  state with a contextual call-to-action.
- **Quick Actions**: "New Matter" from global Quick Actions and from a
  Client's Matters tab (client pre-filled).

**Future Scope**: matter budgets with burn-down tracking; matter templates
(pre-populate tasks/checklists by matter type); related-matters linking;
conflict-check automation against the full client/contact graph;
matter-level custom fields configurable per practice area.

---

### 6.6 Court Cases

**Purpose**
A litigation-specific extension of Matters that captures court-system
metadata: case number, court, bench/judge, filing details, and case status
as tracked by the judiciary — distinct from the firm's own matter stage.

**Business Objective**
Give litigation teams a court-accurate record that can be cross-referenced
against public case-tracking systems and cited precisely in filings,
without overloading every non-litigation matter with court-specific fields.

**User Story**
As a **Paralegal**, I want the exact case number, court, and bench recorded
against the matter, so that every filing and hearing reference is
consistent and error-free.

**Core Features**
- One-to-one extension of a Matter when practice area = Litigation (or
  any practice area the firm configures as "court-tracked").
- Fields: case number (court-assigned), case type (civil/criminal/writ/
  arbitration/etc.), court, bench/courtroom, presiding judge, filing date,
  case stage (as reported by the court, distinct from the firm's Matter
  status), opposing counsel, next hearing date (denormalized from
  Hearings for fast display).
- Cause list awareness (future integration, §16): ability to manually
  confirm a matter's presence on a given day's cause list.

**Key Actions**
- Attach/create court case details on a litigation matter.
- Update court-reported case stage.
- Link to the Hearings module for the case's hearing history.

**Inputs**: case number, court, case type, bench, judge, filing date,
opposing counsel.

**Outputs**: court case record surfaced on the Matter detail header and
consumed by Hearings (auto-populates court/judge on new hearing creation)
and Reports (litigation-specific analytics).

**Page Specification** *(archetype: embedded within Matter Detail; also
independently listable)*
- **Navigation**: Practice → Court Cases (a filtered list of matters that
  have court case data attached) — also accessible as a section within a
  litigation Matter's Overview tab.
- **Table columns** (Court Cases list): Case Number, Matter/Client, Court,
  Case Type, Case Stage, Next Hearing.
- **Forms**: "Add Court Case Details" form embedded in a litigation
  Matter's Overview tab — case number, court (select from Court List,
  §6.31/Settings), case type, bench, judge, filing date, opposing counsel.
- **Validation**: case number required and, where the firm configures a
  jurisdiction-specific pattern, format-validated; court must be selected
  from the firm's configured Court List (§9).
- **Empty State**: On a litigation matter with no court case data yet:
  "No court case details recorded" with an "Add Court Case Details" quick
  action.

**Future Scope**: court e-filing status integration; automatic cause-list
matching; multi-court case linking for matters spanning appellate levels.

---

### 6.7 Hearings

**Purpose**
The court-date tracker. Every scheduled appearance before a court,
tribunal, or arbitral body, linked to its matter.

**Business Objective**
Guarantee zero missed hearings — the single most reputationally and
legally catastrophic failure mode for a law firm.

**User Story**
As a **Managing Partner**, I want to see every hearing scheduled firm-wide
for today and this week, so that I can confirm nothing is at risk of being
missed. As a **Paralegal**, I want to prepare a hearing bundle with a clear
checklist tied to the hearing record, so that nothing is forgotten.

**Core Features**
- Hearing list and calendar integration; per-matter hearing history.
- Fields: hearing type (First Hearing, Case Management Conference,
  Arguments, Evidence Recording, Final Hearing, Interim Application,
  Mediation Session, etc.), court, courtroom, judge, scheduled date/time,
  status, outcome, next hearing date.
- Automatic "next hearing" propagation: recording an outcome with a next
  date creates the follow-on hearing record.
- Today's/This Week's Hearings surfaced prominently on the Dashboard and
  Calendar.

**Key Actions**
- Schedule a hearing (from a matter or from the Hearings list).
- Record outcome/adjournment and next date after the hearing occurs.
- Cancel a hearing (with reason).
- Assign attendees (attorneys/paralegals expected to appear).

**Inputs**: matter (required), hearing type, court, courtroom, judge,
scheduled date/time, attendees.

**Outputs**: hearing record surfacing on Calendar, Dashboard ("Today's
Hearings," "Upcoming Deadlines" proxies), Matter Timeline, and Reports.
Triggers a Notification to assigned attendees and the responsible attorney.

**Page Specification** *(archetype: List Page)*
- **Navigation**: Practice → Hearings.
- **Buttons**: "Schedule Hearing" (primary).
- **Filters**: status (Scheduled/Completed/Adjourned/Cancelled), search by
  type/court/matter.
- **Table columns**: Hearing (type + matter), Court, Judge, Scheduled
  (date/time), Status.
- **Forms**: New Hearing drawer — matter (searchable select, required),
  hearing type (required), court (required), courtroom, judge, date & time
  (required, datetime picker). Validation: date/time required and must be
  a valid future or present date for newly scheduled hearings (past dates
  only permitted when logging a historical hearing outcome
  retroactively, which requires an explicit "log past hearing" mode).
- **Empty State**: "No hearings found."
- **Quick Actions**: "Schedule Hearing" from global Quick Actions and from
  a Matter's Hearings tab.

**Future Scope**: automated reminders escalating in frequency as the
hearing date approaches; hearing bundle checklist generation; court
cause-list auto-import (§16); post-hearing outcome templates by hearing
type.

---

### 6.8 Tasks

**Purpose**
The firm's unit of assignable work. Every discrete action a team member
needs to complete — drafting, research, filing prep, review — is a task,
optionally linked to a matter.

**Business Objective**
Eliminate ambiguity about who is doing what, by when, at every level of
the firm — from a partner's strategic to-do list to a junior associate's
granular research assignments.

**User Story**
As an **Associate**, I want a single board showing everything assigned to
me across all matters, so that I never lose track of a request buried in
email. As a **Partner**, I want to see my team's task load at a glance, so
that I can rebalance work before someone is overloaded.

**Core Features**
- Kanban board (To Do / In Progress / In Review / Done) with per-user and
  per-matter filtering.
- Task fields: title, description, matter (optional — supports firm-wide,
  non-matter tasks), assignee, priority, due date, status.
- Status change directly from the board (no need to open the task).
- Firm-wide tasks (no matter link) for operational/administrative work.

**Key Actions**
- Create task; assign/reassign; change priority; change status; set/adjust
  due date; add a comment (future scope — see below); mark complete.

**Inputs**: title, description, matter (optional), assignee (required),
priority, due date.

**Outputs**: task record surfacing on Dashboard ("My Tasks," "Upcoming
Deadlines"), Matter Timeline/Tasks tab, Calendar (due-date entries),
Notifications (assignment, due-soon, overdue).

**Page Specification** *(archetype: Board Page)*
- **Navigation**: Practice → Tasks.
- **Buttons**: "New Task" (primary).
- **Filters**: search by title; assignee select.
- **Board columns**: To Do, In Progress, In Review, Done — each showing a
  count and independently scrollable.
- **Card contents**: title, matter (or "Firm-wide"), priority pill, due
  date, assignee, inline status-change select.
- **Forms**: New Task drawer — title (required), assignee (required),
  matter (optional select), priority, due date. Validation: title min 3
  chars; assignee required.
- **Empty States**: per-column "No tasks" placeholder when a column is
  empty; whole-board empty state ("No tasks yet") when the firm has zero
  tasks.
- **Quick Actions**: "New Task" from global Quick Actions, Dashboard, and
  a Matter's Tasks tab.

**Future Scope**: task comments/threads; subtasks/checklists; task
templates and recurring tasks; dependency links (Task B blocked by Task A);
time estimate vs. actual tracking; @mentions with notification routing.

---

### 6.9 Calendar

**Purpose**
The firm-wide schedule — a unified view of hearings, meetings, and task
deadlines across every matter and team member.

**Business Objective**
Replace personal calendars and paper diaries as the system of record for
"what is happening when," so that scheduling conflicts are visible before
they happen and nothing firm-relevant lives only in one person's head.

**User Story**
As a **Receptionist**, I want to see which meeting rooms and attorneys are
booked when, so that I can schedule a new consultation without creating a
conflict.

**Core Features**
- Month/week/day views (month view is the default and current MVP
  implementation; week/day are near-term extensions).
- Unified event feed: Hearings (red), Meetings (blue), Task due dates
  (primary color) — visually distinguished with a legend.
- Click any date to see that day's full agenda in a side panel.
- Personal view (my events only) vs. firm-wide view, permission-gated.

**Key Actions**
- Navigate months; select a date to view its agenda; click an event to
  open its source record (Hearing/Meeting/Task).

**Inputs**: none directly — Calendar is a read/aggregation surface over
Hearings, Meetings, and Tasks (with due dates). Event creation happens in
the source module, not in Calendar itself, to keep a single source of
truth per event type.

**Outputs**: none persisted directly.

**Page Specification** *(archetype: Dashboard/Analytics — calendar +
agenda pattern)*
- **Navigation**: Practice → Calendar.
- **Components**: month grid (react-day-picker pattern) with date-level
  event-presence indicators; agenda panel for the selected date listing
  each event with an icon (hearing/meeting/task), title, meta (court/
  location/assignee), and time.
- **Empty State**: "Nothing scheduled" for a selected date with no events.
- **Filters** (future near-term): toggle event types on/off; filter to "my
  events."

**Future Scope**: week/day views; drag-to-reschedule; external calendar
sync (Google/Outlook, §16); room-booking conflict detection; recurring
events; ICS export/subscription feed.

---

### 6.10 Meetings

**Purpose**
Scheduled, loggable interactions with clients or internally — distinct
from Hearings (court appearances) and Tasks (asynchronous work).

**Business Objective**
Ensure every client-facing meeting is scheduled with full context (matter,
attendees, location) and leaves a record (notes, outcome) the whole team
can reference later.

**User Story**
As a **Receptionist**, I want to book a client consultation and reserve a
meeting room in one action, so that intake appointments never double-book
a room.

**Core Features**
- Meeting fields: title, client and/or matter link, scheduled date/time,
  duration, location (physical room or "Video Call"), attendees, status
  (Scheduled/Completed/Cancelled), notes.
- Meetings surfaced on Calendar and on the linked Client's/Matter's
  Meetings tab.

**Key Actions**
- Schedule meeting; edit/reschedule; cancel; mark completed; add
  post-meeting notes.

**Inputs**: title, client/matter, scheduled date/time, duration, location,
attendees.

**Outputs**: meeting record consumed by Calendar, Client Timeline, Matter
Timeline; triggers Notification to attendees.

**Page Specification** *(archetype: List Page, plus embedded within Client/
Matter detail tabs)*
- **Navigation**: Practice → Meetings (firm-wide list); also a tab within
  Client Detail and (optionally) Matter Detail.
- **Table columns**: Title, Client/Matter, Date/Time, Duration, Location,
  Status.
- **Forms**: New Meeting drawer — title, client (select), matter
  (optional select), date/time, duration, location, attendees (multi-
  select from firm directory + external contacts). Validation: date/time
  required; at least one attendee required.
- **Empty State**: "No meetings scheduled."
- **Quick Actions**: "New Meeting" from Reception's Calendar view and from
  a Client's Meetings tab.

**Future Scope**: video-conferencing link auto-generation; meeting room
resource booking with conflict detection; automated post-meeting summary
via AI Assistant (§14).

---

### 6.11 Notes

**Purpose**
Lightweight, timestamped, author-attributed free-text records attached to
a Client or Matter — the firm's internal running commentary.

**Business Objective**
Capture institutional knowledge and context that doesn't belong in a
formal document but is essential for continuity (e.g., "client prefers
email over calls," "opposing counsel requested a short adjournment").

**User Story**
As a **Partner**, I want to leave a quick note on a matter after a phone
call, so that anyone else who picks up the file has the context without
calling me.

**Core Features**
- Notes attached to a Client or a Matter (mutually exclusive per note).
- Pinning (pinned notes surface first).
- Author and timestamp always shown; notes are immutable once posted
  (edit history preserved — see §9) to maintain a trustworthy record.

**Key Actions**
- Add note (inline composer, no modal — minimizes friction); pin/unpin a
  note.

**Inputs**: note body (required), optional pin flag.

**Outputs**: note record surfaced on the Client/Matter Timeline and Notes
tab.

**Page Specification** *(archetype: embedded list, not a standalone
top-level page)*
- **Navigation**: a tab within Client Detail and Matter Detail (no
  independent sidebar entry — Notes are always contextual to a record).
- **Components**: inline composer (textarea + "Add note" button) above a
  reverse-chronological list; each note shows author avatar/name,
  timestamp ("2 hours ago"), pin indicator, and body text.
- **Validation**: note body minimum 2 characters; empty submissions
  blocked.
- **Empty State**: "No notes yet."

**Future Scope**: @mentions with notification routing; rich text/
attachments within notes; note-to-task conversion ("turn this note into a
task").

---

### 6.12 Documents

**Purpose**
The firm's document vault — every file related to a client or matter,
organized, tagged, versioned, and securely stored.

**Business Objective**
Eliminate the shared-drive chaos of duplicate filenames, unclear versions,
and files that exist only on one person's laptop. Every document the firm
produces or receives has exactly one authoritative home.

**User Story**
As a **Paralegal**, I want to upload a filed document to the correct
matter folder with the right tags, so that any attorney can find it in
seconds without asking me. As a **Partner**, I want to see the full version
history of a draft, so that I know which version is current before sending
it to a client.

**Core Features**
- Folder structure per matter/client (auto-created; see §11).
- Tagging (free-text tags, typically practice-area + document-type).
- Status: Draft, Final, Shared, Archived.
- Version history per document (each re-upload with the same logical name
  creates a new version, prior versions retained and viewable).
- Quick filters: All, Recent (last 7 days), Shared, Archive.
- File preview (PDF inline viewer; other types show metadata + download).
- OCR text extraction (planned — placeholder in MVP UI, see §14).
- Local/on-prem file storage with a strict path-traversal-safe storage
  layer (see §11).

**Key Actions**
- Upload (single file in MVP; bulk upload in V1.0); download; preview;
  tag; change status; archive; delete (soft delete, Administrator-
  recoverable within retention window); view version history; upload a
  new version of an existing document.

**Inputs**: file (required), matter and/or client link, tags, initial
status.

**Outputs**: document record surfaced on Matter/Client Documents tab,
Dashboard ("Recent Uploads," "Document Status"), Activity Log, and (when
explicitly marked shared with a client) the Client Portal.

**Page Specification** *(archetype: List Page + Preview Drawer)*
- **Navigation**: Documents & Knowledge → Documents.
- **Quick-filter tabs**: All, Recent, Shared, Archive.
- **Buttons**: "Upload" (primary).
- **Filters**: search by name/tag; file-type select.
- **Table columns**: Document (icon + name + matter/client), Type, Tags,
  Uploaded by, Size, Status, Uploaded (date). Row click → Preview drawer.
- **Preview drawer**: inline preview area, metadata grid (type, size,
  uploaded by, uploaded date, status, tags), Version History list
  (version number + timestamp for each), "Download original file" button.
- **Upload modal**: file picker, matter select (optional — "Unfiled" if
  omitted), tags input, disabled "Run OCR" checkbox (labeled "coming
  soon" — sets expectation honestly rather than hiding the future
  capability). Validation: a file must be selected before the Upload
  button is enabled.
- **Empty State**: "No documents found" (per active quick-filter tab).

**Future Scope**: bulk upload (multi-file drag-and-drop); full OCR text
search across all documents; e-signature request workflow (§16);
client-visible sharing toggle with granular expiry; folder-level
permissions; drag-and-drop re-filing between matters.

---

### 6.13 Document Generator

**Purpose**
A guided flow for producing a new document from a firm-approved Template,
pre-filled with matter/client data where possible.

**Business Objective**
Cut document-drafting time dramatically by starting every routine document
(NDA, offer letter, notice, affidavit) from a vetted firm template instead
of a blank page or a risky copy-paste from an old, possibly outdated file.

**User Story**
As a **Junior Associate**, I want to generate a standard NDA pre-filled
with the client's name and matter details, so that I produce a compliant
first draft in minutes, not hours.

**Core Features**
- Template categories exactly matching the firm's document taxonomy:
  Employment, Corporate, Litigation, Property, Tax, Compliance, Contracts,
  NDA, Agreement, Notice, Affidavit, Power of Attorney, Will.
  aligned via category filter, and organized into a Recently Used
  section for fast repeat access.
- Per-template card: Preview, Generate, Favourite (star toggle), usage
  count, last-used timestamp.
- Search across all templates by name.

**Key Actions**
- Preview a template (read-only render before committing to generate).
- Generate a document from a template (opens a guided fill-in flow —
  matter/client context pre-populated where the template defines
  merge fields; remaining fields entered manually).
- Favourite/unfavourite a template (persists per-user in MVP; firm-wide
  "recommended" flag is an Administrator/Settings capability).
- The generated output is saved as a new Document (§6.12) linked to the
  originating matter, with the template it was generated from recorded for
  traceability.

**Inputs**: selected template, target matter/client, merge-field values.

**Outputs**: a new Document record (Draft status) attached to the matter;
increments the source Template's usage count and last-used timestamp.

**Page Specification** *(archetype: Dashboard-style card grid, grouped by
category)*
- **Navigation**: Documents & Knowledge → Document Generator.
- **Components**: search bar; "Recently Used" card row (when search is
  empty); one section per category, each a responsive card grid.
- **Card contents**: template name, one-line description, usage count,
  last-used ("Used 8 days ago" / "Never used"), favourite star, "Preview"
  button (secondary), "Generate" button (primary).
- **Empty State**: N/A at the category level (categories with zero
  templates are simply not rendered); a global empty state applies only if
  the firm has zero templates at all.
- **Validation**: the Generate flow blocks completion until all
  template-defined required merge fields are filled.

**Future Scope**: true merge-field engine with conditional clauses (this is
where Document Generator and Clause Library converge, §14); direct
generate-and-send-for-signature; multi-document generation batches (e.g.,
generate an entire hearing bundle from one action); AI-assisted first-draft
generation from a natural-language prompt (§14).

---

### 6.14 Template Library

**Purpose**
The administrative, searchable system of record for every reusable
document template the firm has approved — the management counterpart to
Document Generator's generation-focused view.

**Business Objective**
Ensure exactly one current, approved version of every template exists, is
discoverable, and is measurably used — turning "does anyone have a good NDA
template?" into a solved problem forever.

**User Story**
As a **Senior Partner**, I want to see which templates are used most and
least, so that I know which ones to invest in updating and which are
stale/unused.

**Core Features**
- Full template inventory: name, category, usage count, last-used date,
  favourite status.
- Category and text search/filter.
- (Administrator/Partner scope) template lifecycle: upload/replace the
  underlying template file, retire a template, mark as firm-recommended.

**Key Actions**
- Search/filter templates; toggle favourite; (privileged) upload a new
  template or replace an existing template's source file; retire a
  template.

**Inputs** (privileged create/edit path): template name, category
(required, from the fixed 13-category taxonomy), description, source
file, initial favourite/recommended flag.

**Outputs**: template records consumed by Document Generator; usage
analytics consumed by Reports.

**Page Specification** *(archetype: List Page)*
- **Navigation**: Documents & Knowledge → Template Library.
- **Filters**: category select, search by name.
- **Table columns**: Template (favourite star + name), Category badge,
  Uses (count), Last used.
- **Quick Actions**: favourite toggle inline in the table (no drawer
  needed for this lightweight action).
- **Empty State**: "No templates found."

**Future Scope**: template version history with diff view; approval
workflow for new/updated templates (draft → reviewed → published);
template usage-by-practice-group breakdown.

---

### 6.15 Clause Library

**Purpose**
A searchable bank of firm-approved, reusable contract and document clause
language, organized by category (Boilerplate, Risk Allocation, Termination,
Restrictive Covenants, Dispute Resolution, IP, Compliance, M&A, etc.).

**Business Objective**
Standardize legal language across the firm so that every drafter — from a
senior partner to a junior associate — inserts consistent, vetted,
firm-approved clause language instead of reinventing (and risking) it per
document.

**User Story**
As an **Associate**, I want to search "limitation of liability" and get the
firm's standard clause instantly, so that I don't have to hunt through old
contracts for language I know exists somewhere.

**Core Features**
- Clause inventory: title, category, body text (full clause language),
  tags, usage count, favourite status.
- Search and category filter.
- Preview of clause body directly in the list (truncated) with full text
  on demand.

**Key Actions**
- Search/filter clauses; toggle favourite; copy clause text (future:
  direct insertion into Document Generator output); (privileged) add/edit/
  retire a clause.

**Inputs** (privileged create/edit path): title, category, body text,
tags.

**Outputs**: clause records consumed by Document Generator (future direct
insertion) and referenced by drafters manually in the interim.

**Page Specification** *(archetype: List Page)*
- **Navigation**: Documents & Knowledge → Clause Library.
- **Filters**: category select, search by title.
- **Table columns**: Clause (favourite star + title), Category badge,
  Preview (truncated body text), Uses (count).
- **Empty State**: "No clauses found."

**Future Scope**: direct clause insertion into Document Generator's merge
flow; clause version history and redline comparison; jurisdiction-specific
clause variants; AI-suggested clause recommendations based on document
type (§14).

---

### 6.16 Knowledge Base

**Purpose**
The firm's internal wiki of practice notes, guides, and precedent
summaries — durable knowledge that outlives any single matter.

**Business Objective**
Prevent institutional knowledge from being lost when a partner retires or
an associate leaves; reduce duplicate research effort across the firm.

**User Story**
As a **Legal Researcher**, I want to publish a summary of a new regulatory
development, so that every practice group affected can find it instead of
researching it independently. As a **Junior Associate**, I want to search
past guidance on a recurring issue, so that I don't redo work someone else
already did.

**Core Features**
- Article inventory: title, category, summary, full body, author,
  published date, view count, tags.
- Search and category filter.
- View-count tracking (surfaces the most valuable articles).

**Key Actions**
- Search/browse articles; (privileged: Legal Researcher, Partner+) author/
  edit/publish an article.

**Inputs** (authoring path): title, category, summary, body, tags.

**Outputs**: article records consumed by search, Matter "Research" tabs
(practice-area matched suggestions), and Reports (most-viewed content).

**Page Specification** *(archetype: List Page; detail view renders full
article body)*
- **Navigation**: Documents & Knowledge → Knowledge Base.
- **Filters**: category select, search by title.
- **Table columns**: Article (title + summary preview), Category badge,
  Author, Views, Published (date).
- **Empty State**: "No articles found."

**Future Scope**: full article detail/reader page with rich formatting;
comments/discussion per article; related-articles suggestions; content
freshness flags (articles not reviewed in 12+ months surfaced for
revalidation).

---

### 6.17 Research

**Purpose**
The workspace for active legal research requests and findings — the
working layer that feeds the durable Knowledge Base.

**Business Objective**
Give Legal Researchers and associates a dedicated place to manage research
requests end-to-end (request → findings → delivery) with full traceability
back to the requesting matter, rather than research living only in email
threads or personal notes.

**User Story**
As a **Legal Researcher**, I want a queue of research requests tagged by
matter and deadline, so that I can prioritize my work across the whole
firm rather than just one team's asks.

**Core Features**
- Research request queue (backed by Tasks, tagged with a "Research" type)
  showing requesting matter, deadline, and requester.
- Findings capture: sources, citations, summary — attachable to the
  requesting matter as a Document (research memo) and, where broadly
  useful, publishable to the Knowledge Base in one action.
- Cross-firm search: "has this already been researched?" before starting
  new work.

**Key Actions**
- View/claim a research request; log findings; attach memo to matter;
  publish to Knowledge Base; mark request complete.

**Inputs**: research question/request (created as a Task with a Research
tag), findings/sources logged during work.

**Outputs**: a Document (research memo) on the requesting matter, and
optionally a Knowledge Base article.

**Page Specification** *(archetype: List Page, built on the Tasks data
model filtered to Research-tagged items, plus a dedicated search
experience)*
- **Navigation**: Documents & Knowledge → Research.
- **Components**: request queue (table: Question/Topic, Matter, Requested
  by, Deadline, Status) and a prominent cross-firm search bar spanning
  Knowledge Base + prior research memos.
- **Forms**: "Log Findings" form — summary, sources (repeatable list of
  citation + link/reference), publish-to-Knowledge-Base toggle.
- **Empty State**: "No research requests" / "No results found" for search.

**Future Scope**: direct integration with external legal research
databases (§16); AI-assisted research summarization (§14); citation
formatting assistant.

---

### 6.18 Billing

**Purpose**
The firm's accounts-receivable command center — the single screen Accounts
uses to manage the full invoice-to-cash cycle across every client and
matter.

**Business Objective**
Minimize Days Sales Outstanding and maximize realization by giving Accounts
one place to see outstanding balances, overdue invoices, and billing
trends without reconciling multiple exports.

**User Story**
As **Accounts**, I want to see total billed, total collected, outstanding,
and overdue-invoice count at a glance, with drill-down into every invoice,
payment, expense, and retainer, so that collections follow-up is
proactive, not reactive.

**Core Features**
- Summary stat cards: Total Billed, Total Collected, Outstanding, Overdue
  Invoices.
- Billed-vs-Collected trend chart (rolling 6 months).
- Tabbed sub-ledgers: Invoices, Payments, Expenses, Retainers (each also
  independently addressable — see §6.19–§6.21).
- New Invoice creation from this hub.

**Key Actions**
- Create invoice; drill into any sub-ledger tab; export financial summary
  (future).

**Inputs**: none directly (aggregation surface); invoice creation inputs
per §6.19.

**Outputs**: aggregated billing KPIs consumed by Dashboard and Reports.

**Page Specification** *(archetype: Dashboard/Analytics + tabbed List
Pages)*
- **Navigation**: Finance → Billing.
- **Buttons**: "New Invoice" (primary, top-right).
- **Cards**: Total Billed, Total Collected, Outstanding, Overdue Invoices.
- **Chart**: Billed vs. Collected (grouped bar, last 6 months).
- **Tabs**: Invoices, Payments, Expenses, Retainers — each a List Page per
  §6.19–§6.21 and the Retainers sub-ledger (client, matter, amount,
  balance, status, start date).
- **Empty States**: per-tab, e.g. "No invoices yet."

**Future Scope**: collections workflow automation (auto-reminders on
overdue invoices, §15); client-specific billing guideline enforcement;
write-off approval workflow; trust/IOLTA accounting compliance mode (for
jurisdictions requiring segregated client funds).

---

### 6.19 Invoices

**Purpose**
The individual billing document issued to a client for fees and expenses
on a matter.

**Business Objective**
Ensure every billable hour and reimbursable expense is captured into an
invoice, sent promptly, and tracked to payment — the direct link between
legal work and firm revenue.

**User Story**
As **Accounts**, I want to generate an invoice from a matter's unbilled
time and expenses, so that nothing billable is ever left off an invoice.

**Core Features**
- Invoice fields: invoice number (auto-generated per firm convention,
  §11), client, matter (optional — a client-level invoice can span
  matters in future scope), status, issue date, due date, subtotal, tax,
  discount, total, amount paid, currency, notes.
- Line items: Fee lines (from time entries) and Expense lines, each with
  description, quantity, rate, amount.
- Status lifecycle: Draft → Sent → Partially Paid / Paid / Overdue → Void
  (see §12.5 for the full lifecycle definition).

**Key Actions**
- Create invoice (manual line item or, in V1.0, generated from unbilled
  time/expenses on a matter); edit while in Draft; send (Draft → Sent);
  record payment; void.

**Inputs**: client (required), matter (optional), line items (description,
quantity, rate), due date, notes.

**Outputs**: invoice record; on payment, generates/links a Payment record
(§6.20); visible to the client via Client Portal once status ≥ Sent.

**Page Specification** *(archetype: List Page + Detail Page)*
- **Navigation**: Finance → Invoices (also the Billing → Invoices tab —
  same underlying list).
- **Table columns**: Invoice (number + client/matter), Issued, Due, Total,
  Paid, Status.
- **Detail page**: header (invoice number, status, client, matter), line
  items table, subtotal/tax/discount/total summary, payment history,
  "Record Payment" and "Send" actions (status-gated).
- **Forms**: New Invoice drawer — client (required select), matter
  (optional select), line-item description (required), amount (required,
  > 0). Validation: amount must be a positive number; client required.
- **Empty State**: "No invoices yet."

**Future Scope**: generate-from-unbilled-time flow; multi-currency
support; recurring/retainer-draw invoices; PDF branded invoice export;
online payment link generation (§16).

---

### 6.20 Payments

**Purpose**
The record of money actually received against an invoice.

**Business Objective**
Provide an accurate, reconciled cash-received ledger distinct from
billed-but-unpaid amounts — the number that matters most for firm cash
flow.

**User Story**
As **Accounts**, I want to log a payment against an invoice and have the
invoice status update automatically, so that outstanding balances are
always accurate without manual recalculation.

**Core Features**
- Payment fields: invoice (required), client, amount, method (Bank
  Transfer, Cheque, Cash, Card, UPI/other electronic), reference number,
  paid-on date.
- Automatic invoice status recalculation on payment: full amount → Paid;
  partial amount → Partially Paid.

**Key Actions**
- Record payment (against a specific invoice); view payment history per
  invoice/client.

**Inputs**: invoice (required), amount (required, > 0, ≤ invoice
outstanding balance), method, reference, paid-on date (cannot be in the
future).

**Outputs**: payment record; updates the linked invoice's `amountPaid` and
`status`; feeds Finance and Reports collections metrics.

**Page Specification** *(archetype: List Page)*
- **Navigation**: Finance → Payments (also Billing → Payments tab).
- **Table columns**: Invoice, Client, Amount, Method (badge), Reference,
  Paid on.
- **Empty State**: "No payments recorded."

**Future Scope**: payment gateway integration for online client payments
(§16); auto-reconciliation against bank statement imports; partial-payment
allocation across multiple invoices.

---

### 6.21 Expenses

**Purpose**
Tracking of costs incurred on behalf of a matter (court filing fees,
travel, expert witness fees, courier, printing) or the firm generally, and
whether each is billable to the client.

**Business Objective**
Ensure billable expenses are never absorbed by the firm by mistake, and
that non-billable/overhead expenses are visible for firm profitability
analysis.

**User Story**
As a **Paralegal**, I want to log a court filing fee against the matter
the moment I pay it, so that it's never forgotten by the time the invoice
is prepared.

**Core Features**
- Expense fields: matter and/or client (at least one), category
  (Court Filing Fees, Travel & Conveyance, Courier & Documentation, Expert
  Witness Fees, Stamp Duty, Printing & Binding, and firm-configurable
  additional categories), description, amount, incurred date, billable
  flag, reimbursed flag, submitted by.

**Key Actions**
- Log expense; mark billable/non-billable; mark reimbursed; attach expense
  to an invoice's line items.

**Inputs**: matter/client, category, description, amount (required, > 0),
incurred date, billable flag.

**Outputs**: expense record surfaced on Matter's Expenses tab, Finance
(expense-by-category breakdown), and — when billable — available as an
invoice line item.

**Page Specification** *(archetype: List Page)*
- **Navigation**: Finance → Expenses (also Billing → Expenses tab, and a
  Matter's Expenses tab scoped to that matter).
- **Table columns**: Expense (description + matter/client), Category,
  Amount, Billable (badge), Reimbursed (badge), Date.
- **Forms**: Log Expense form — matter/client, category (select),
  description, amount, incurred date, billable toggle.
- **Empty State**: "No expenses logged."

**Future Scope**: receipt image/file attachment with OCR amount
extraction; expense approval workflow for reimbursement; per-matter
expense budgets and alerts.

---

### 6.22 Finance

**Purpose**
The firm-wide financial overview — revenue, expenses, net position, and
practice-area profitability — distinct from Billing's client-facing
AR focus.

**Business Objective**
Give the Managing Partner and Accounts a P&L-adjacent view of firm health
that answers "are we profitable, and where does our revenue actually come
from?"

**User Story**
As the **Managing Partner**, I want to see revenue broken down by practice
area alongside total firm expenses, so that I can make investment
decisions about where to grow the firm.

**Core Features**
- Summary stat cards: Total Revenue (collected), Total Expenses, Net
  Income, Retainer Balance (aggregate).
- Expenses-by-category chart.
- Revenue-by-practice-area breakdown (based on matter estimated/billed
  value).

**Key Actions**
- View firm-wide financial summary; drill into a practice area (future:
  click-through to filtered Matters/Reports).

**Inputs**: none directly (aggregation surface).

**Outputs**: firm financial KPIs consumed by Dashboard (Firm KPIs row) and
Reports.

**Page Specification** *(archetype: Dashboard/Analytics)*
- **Navigation**: Finance → Finance.
- **Cards**: Total Revenue, Total Expenses, Net Income, Retainer Balance.
- **Charts**: Expenses by Category (horizontal bar); Revenue by Practice
  Area (ranked list with value + share).

**Future Scope**: full P&L statement with period comparison; partner
profitability/compensation modeling inputs; budget vs. actual tracking;
multi-entity/multi-office consolidated finance for firms with separate
legal entities per office.

---

### 6.23 HR

**Purpose**
The people-operations command center — HR's home screen, summarizing
headcount, pending leave requests, and attendance exceptions across the
firm.

**Business Objective**
Give HR a single operational view instead of juggling a separate HR tool,
a payroll spreadsheet, and the practice system's user list.

**User Story**
As **HR**, I want to see pending leave requests and today's attendance
exceptions the moment I log in, so that people issues are resolved same-
day, not discovered a week later.

**Core Features**
- Summary cards: Headcount, Pending Leave Requests, Attendance Exceptions
  Today.
- Quick-approve/decline actions on pending leave requests directly from
  this view.
- Links into Employees, Attendance, and Leaves for full detail.

**Key Actions**
- Approve/decline a leave request; jump to Employees/Attendance/Leaves.

**Inputs**: none directly (aggregation surface with inline actions on
Leaves).

**Outputs**: none persisted directly (actions persist through the Leaves
module).

**Page Specification** *(archetype: Dashboard/Analytics)*
- **Navigation**: People → HR.
- **Cards**: Headcount, Pending Leave Requests, Attendance Exceptions
  Today.
- **Components**: pending-approvals list (name, leave type, dates,
  Approve/Decline buttons); today's attendance-exception list.

**Future Scope**: onboarding/offboarding checklist workflows; policy
acknowledgement tracking; performance review cycle management; employee
satisfaction pulse surveys.

---

### 6.24 Employees

**Purpose**
The firm's team roster — every person who works at the firm, their role,
title, office, and employment metadata. This is the same underlying
`User` entity referenced throughout the system as attorney, assignee,
author, etc. (see §8), viewed here through an HR/people-operations lens.

**Business Objective**
Maintain a single accurate source of truth for firm headcount and
structure that both practice-management (who can be assigned to a matter)
and HR (who works here, in what role) rely on without divergence.

**User Story**
As **HR**, I want to see every employee's role, office, and join date in
one table, so that I can answer headcount and tenure questions
immediately.

**Core Features**
- Employee list: name, title, role, office, utilization target,
  join date, status (Active/Inactive).
- Role filter across the firm's role taxonomy (§4).
- Employee profile (future: full HR record — see Future Scope).

**Key Actions**
- Search/filter employees; (privileged: HR, Administrator) create new
  employee record; edit role/office/title; deactivate on departure
  (soft — historical assignments remain intact).

**Inputs** (privileged create/edit path): name, email, phone, role, title,
office, bar/registration number (fee-earners), utilization target,
joined date.

**Outputs**: employee record referenced by every module that assigns work
or tracks people (Matters team, Tasks assignee, Hearings attendees,
Documents uploaded-by, Notes author, Time Entries, HR/Attendance/Leaves).

**Page Specification** *(archetype: List Page)*
- **Navigation**: People → Employees.
- **Filters**: role select, search by name.
- **Table columns**: Team Member (avatar + name + email), Title, Role
  (badge), Office, Utilization Target, Joined.
- **Empty State**: "No team members found."

**Future Scope**: full employee profile page (emergency contact,
documents, compensation history restricted to HR/Managing Partner);
org-chart visualization; skills/practice-area tagging for staffing
recommendations.

---

### 6.25 Attendance

**Purpose**
Daily presence tracking for the firm's employees.

**Business Objective**
Provide HR and Office Managers visibility into who is in, remote, or
absent each day, and surface exceptions (missing clock-out, unplanned
absence) promptly.

**User Story**
As **HR**, I want to see today's attendance exceptions at a glance, so
that I can follow up the same day rather than at month-end reconciliation.

**Core Features**
- Daily attendance record per employee: status (Present, Remote, Absent,
  On Leave, Holiday), clock-in/clock-out time (where applicable).
- Exception surfacing (late arrival beyond threshold, missing clock-out,
  unplanned absence).
- Monthly attendance calendar view per employee.

**Key Actions**
- Clock in/out (self-service, employee-facing — future scope for full
  self-service; MVP supports HR-recorded entries); view/edit attendance
  (HR/Administrator); export attendance summary for a period.

**Inputs**: employee, date, status, clock-in/out times.

**Outputs**: attendance records consumed by HR dashboard, Reports
(headcount/capacity context), and (future) Payroll.

**Page Specification** *(archetype: List Page + calendar detail view)*
- **Navigation**: People → Attendance.
- **Components**: today's attendance table (employee, status, clock-in/
  out, exception flag) with a per-employee monthly calendar drill-down.
- **Filters**: date/date-range, employee, status.
- **Empty State**: "No attendance records for this period."

**Future Scope**: employee self-service clock-in/out (mobile-friendly);
geofenced/IP-validated clock-in for office compliance; biometric
integration; automatic exception escalation to HR.

---

### 6.26 Leaves

**Purpose**
Leave request submission, approval, and balance tracking.

**Business Objective**
Replace email-based leave requests with a transparent, auditable workflow
that both the employee and HR can trust, and that keeps leave balances
accurate.

**User Story**
As an **Associate**, I want to request leave and see my remaining balance
before I submit, so that I don't accidentally over-request.

**Core Features**
- Leave types (firm-configurable: Annual/Earned, Sick, Casual, Unpaid,
  Maternity/Paternity, Bereavement, etc.).
- Leave request: employee, type, start/end date, reason, status (Pending,
  Approved, Declined, Cancelled).
- Leave balance per employee per type, accrual policy configurable in
  Settings/Firm Configuration.
- Approval routing to the employee's reporting manager and/or HR.

**Key Actions**
- Submit leave request (employee, self-service); approve/decline
  (manager/HR); cancel a pending or future-dated approved request.

**Inputs**: employee, leave type, start date, end date, reason.

**Outputs**: leave record; on approval, creates corresponding Attendance
entries ("On Leave") for the date range and updates the employee's leave
balance; surfaces on Calendar (team-visibility, configurable) and
Notifications.

**Page Specification** *(archetype: List Page + approval queue)*
- **Navigation**: People → Leaves.
- **Components**: "My Requests" (employee self-service list + "Request
  Leave" button) and, for HR/managers, an "Approvals" queue.
- **Table columns**: Employee, Type, Start–End, Days, Status, Reason.
- **Forms**: Request Leave — type (select), start date, end date, reason
  (optional). Validation: end date ≥ start date; requested days must not
  exceed available balance for that leave type (soft warning, HR can
  override for unpaid conversion).
- **Empty State**: "No leave requests."

**Future Scope**: multi-level approval chains; half-day/hourly leave;
leave calendar heat-map for team capacity planning; carry-forward and
encashment rules.

---

### 6.27 Payroll *(Future)*

**Purpose**
Compensation processing — salary computation, deductions, and payslip
generation for firm employees.

**Business Objective**
Extend LEXORA from people *records* to full people *operations*, removing
the need for a disconnected payroll system once the firm is ready to trust
LEXORA with compensation data.

**User Story**
As **HR**, I want to generate monthly payslips directly from attendance
and leave data already in the system, so that payroll doesn't require
re-entering data that already exists.

**Core Features (planned)**
- Salary structure per employee (base, allowances, deductions).
- Monthly payroll run, informed by Attendance (unpaid absence deductions)
  and Leaves (paid leave has no salary impact; unpaid leave deducts).
- Payslip generation (PDF) and (future) distribution via Client-Portal-
  style employee self-service.
- Statutory compliance fields configurable per jurisdiction (tax
  withholding, social security equivalents) — jurisdiction-specific and
  intentionally deferred to avoid shipping incorrect compliance logic.

**Key Actions (planned)**: define salary structure; run monthly payroll;
review and approve payroll run; generate/distribute payslips.

**Inputs (planned)**: salary structure, attendance/leave data, one-off
adjustments (bonus, deduction).

**Outputs (planned)**: payslip records; payroll journal entries (future
accounting integration, §16).

**Page Specification** *(planned — archetype: List Page + Configuration
Page)*
- **Navigation**: People → Payroll (present in the sidebar but visibly
  marked "Coming soon" until built, consistent with how LEXORA is honest
  about unbuilt capability rather than hiding it — see §17).

**Future Scope**: this entire module is future scope by definition; it is
explicitly sequenced in the Enterprise phase of the roadmap (§17.4) due to
its jurisdiction-specific compliance burden.

---

### 6.28 Reports

**Purpose**
Executive analytics — deeper, longer-horizon analysis than the Dashboard's
real-time snapshot: revenue trends, matter status distribution, practice
area share, and lawyer performance.

**Business Objective**
Give the Managing Partner and practice leads the data to make structural
decisions (headcount, practice investment, individual performance
conversations) grounded in firm data rather than impression.

**User Story**
As the **Managing Partner**, I want to see 12-month revenue trend,
month-over-month growth, and estimated matter value by responsible
attorney in one screen, so that my quarterly partner meeting is backed by
real numbers.

**Core Features**
- Revenue — 12-month trend (collections).
- Monthly Growth (% change month-over-month, color-coded positive/
  negative).
- Matter Status distribution (lifecycle stage breakdown).
- Practice Area share (donut).
- Lawyer Performance (estimated matter value and logged hours by
  responsible attorney).

**Key Actions**
- View report; (future) export to PDF/CSV; (future) filter by date range/
  office/practice group.

**Inputs**: none directly (aggregation surface).

**Outputs**: none persisted; feeds executive decision-making outside the
system.

**Page Specification** *(archetype: Dashboard/Analytics)*
- **Navigation**: Insights → Reports.
- **Charts**: Revenue trend (area), Monthly Growth (bar, color-coded),
  Matter Status (bar), Practice Areas (donut), Lawyer Performance
  (horizontal bar with hours annotation).

**Future Scope**: scheduled report email delivery; custom report builder;
exportable/shareable report snapshots; cohort analysis (client
acquisition-to-revenue over time); benchmark comparison against firm
historical baselines.

---

### 6.29 Analytics

**Purpose**
Deeper, self-serve, cross-module analytical exploration beyond the fixed
charts in Reports — intended for power users (Managing Partner, Office
Manager, Accounts) who want to slice firm data on their own terms.

**Business Objective**
Reduce reliance on ad hoc spreadsheet exports for one-off analytical
questions ("how does utilization compare across offices this quarter?")
by giving trusted users a flexible query surface over the firm's data.

**User Story**
As an **Office Manager**, I want to build a custom view comparing
attendance and utilization by office, so that I can support a facilities
decision without filing an engineering ticket.

**Core Features (V1.0 target — see §17)**
- Dimension/metric picker (e.g., dimension: Practice Area, Office,
  Attorney; metric: Revenue, Hours Billed, Matters Opened).
- Saved custom views, shareable within a permission-scoped audience.
- Underlying data identical to Reports/Dashboard — Analytics does not
  introduce a separate data pipeline, only a more flexible lens on the
  same source of truth.

**Key Actions**: build/save/share a custom analytical view; export
underlying data (CSV).

**Inputs**: dimension/metric/filter selections.

**Outputs**: saved view configuration (not raw data — always computed live
against current data).

**Page Specification** *(archetype: Dashboard/Analytics — MVP ships as a
curated set of additional cross-cutting charts; the self-serve builder is
a V1.0 target)*
- **Navigation**: Insights → Analytics.
- **MVP components**: firm-wide utilization heat-map (by attorney/week);
  client concentration analysis (revenue share by top-N clients); matter
  velocity (average days from Intake to Active, Active to Closed).

**Future Scope**: full self-serve pivot/dimension builder; scheduled
recurring custom reports; anomaly detection surfaced proactively (§14).

---

### 6.30 Notifications

**Purpose**
The firm-wide, role-aware event stream — every user's feed of things that
happened that are relevant to them.

**Business Objective**
Ensure important events (task assigned, hearing tomorrow, invoice overdue,
document shared, leave approved) are never missed because they only lived
in an email that got buried.

**User Story**
As any user, I want a single bell icon that tells me what changed that
matters to me, so that I don't have to proactively check five different
modules to stay current.

**Core Features**
- Event feed sourced from the firm-wide Activity Log, filtered to events
  relevant to the signed-in user (assigned to them, on a matter they're a
  team member of, or firm-wide announcements).
- Unread count badge; mark-as-read (individual or "mark all read").
- Event types: task assigned/due-soon/overdue, hearing scheduled/tomorrow,
  document uploaded/shared, invoice sent/paid/overdue, leave
  request/approved/declined, matter status changed, mention (future),
  announcement published.

**Key Actions**: view notification (navigates to source record); mark
read/unread; mark all read; (future) configure notification preferences
per event type and channel.

**Inputs**: none directly (system-generated from events across modules).

**Outputs**: read/unread state per user per notification.

**Page Specification** *(archetype: Dropdown Panel, present on every
screen; full-page history view for V1.0)*
- **Navigation**: bell icon in the global top bar (§5.3); full history at
  System → Notifications.
- **Components**: panel list (avatar/icon, message, relative timestamp),
  "Mark all read," empty state ("No recent activity yet").

**Future Scope**: per-channel delivery preferences (in-app, email, future
push/SMS — §16); digest mode (daily/weekly summary instead of real-time);
@mention-triggered notifications; snooze.

---

### 6.31 Settings

**Purpose**
Personal and firm-level configuration surface — the tabbed control panel
covering everything from an individual user's profile to firm-wide
invoice numbering.

**Business Objective**
Give every firm the ability to configure LEXORA to match its own identity,
policies, and operational conventions without requiring code changes or
vendor tickets.

**User Story**
As the **Managing Partner**, I want to update the firm's branding, invoice
numbering format, and office list myself, so that the system reflects our
firm accurately from day one without waiting on a developer.

**Core Features**
- Tabs: Firm Profile, Offices, Practice Areas, Court List, Templates,
  Branding, Invoice Settings, Users, Permissions.
- Each tab is independently permissioned (§5.4) — e.g., Accounts can edit
  Invoice Settings but not Users/Permissions.

**Key Actions**: view/edit firm profile; add/edit/remove an office; add/
edit a practice area (name, color, description); add/edit a court list
entry; view template inventory (links to Template Library for management);
configure branding (logo, accent color — future); configure invoice
numbering (prefix, next number, financial year start, default currency);
manage users (provision/deprovision, role assignment); manage permissions
(role → module access grants, extending/overriding the default matrix in
§5.4).

**Inputs**: firm name/legal name/tagline/contact info/address/tax ID;
office name/address/contact/primary flag; practice area name/color/
description; court name/type/city/state; invoice prefix/next number/
financial year start/currency; user email/role/office; permission grants
per role per module.

**Outputs**: firm configuration record consumed throughout the system —
this is the root configuration that shapes nearly every other module's
available options (practice area dropdowns, court selects, invoice
numbering, etc.).

**Page Specification** *(archetype: Configuration Page)*
- **Navigation**: System → Settings.
- **Tabs**: Firm Profile (info grid), Offices (card list, "head office"
  badge), Practice Areas (card grid with color swatch), Court List (card
  list with type badge), Templates (summary + link to Template Library),
  Branding (empty state in MVP — "coming soon," honest placeholder rather
  than a non-functional form), Invoice Settings (info grid), Users
  (empty-state placeholder in Phase 1 — no-auth means user provisioning is
  not yet meaningful; becomes live once authentication ships, §17),
  Permissions (empty-state placeholder, same rationale).
- **Forms**: each configurable tab has an inline edit affordance (edit
  icon → form → save) rather than a separate page per field.
- **Validation**: practice area name required and unique; office must have
  a name; invoice prefix required (alphanumeric); financial year start
  must be a valid month (1–12).

**Future Scope**: full Users/Permissions management once authentication
ships (§17); custom field configuration per Matter/Client; workflow
automation rule builder (§15); white-label branding (custom domain, full
theme control) for the Client Portal.

---

### 6.32 Firm Configuration

**Purpose**
The structural backbone beneath Settings — offices, practice areas, court
list, and organizational hierarchy — treated as its own conceptual module
because it is the data every other module's dropdowns and validations
depend on, even though it is surfaced to users as tabs within Settings
(§6.31) rather than a separate top-level page.

**Business Objective**
Model the firm's actual structure (offices, practice groups, reporting
lines) accurately enough that permissions, staffing, and reporting reflect
reality — critical for firms with multiple offices or complex practice
group structures.

**User Story**
As an **Office Manager**, I want to add a new office location with its own
address and meeting rooms, so that scheduling and firm directory data
stays accurate as the firm expands.

**Core Features**
- Office entity: name, address, contact info, primary/head-office flag.
- Practice Area entity: name, color (drives consistent, validated
  categorical color-coding across every chart and badge in the system,
  §9), description, icon.
- Court List entity: name, type (Supreme Court, High Court, District
  Court, Tribunal, Consumer Forum, Family Court, Arbitration, and
  firm-extensible types), city, state, address, contact.
- (Future) Team/Department entity for firms wanting a grouping layer
  between "office" and "individual" (e.g., "Corporate Team — Mumbai").

**Key Actions**: create/edit/deactivate an office, practice area, or court
list entry.

**Inputs**: see §6.31 Inputs (Firm Configuration inputs are a subset of
Settings' inputs).

**Outputs**: reference data consumed by Matters (practice area, court
select), Hearings (court select), Users/Employees (office assignment),
Reports (office/practice-area dimensions).

**Page Specification**: see §6.31 — Firm Configuration has no independent
page; it is expressed entirely through the Offices, Practice Areas, and
Court List tabs of Settings.

**Future Scope**: department/team hierarchy; multi-entity legal structure
support (for firms operating as separate legal entities per
office/jurisdiction); jurisdiction-specific configuration bundles
(pre-populated court lists and compliance defaults by country).

---

### 6.33 Audit Logs

**Purpose**
A tamper-evident, chronological record of security- and compliance-
relevant actions across the system: who did what, to what record, when.

**Business Objective**
Meet the compliance and risk-management bar expected by enterprise legal
clients and regulators — the firm must be able to answer "who accessed
this client's financial data on this date?" definitively.

**User Story**
As the **Administrator**, I want to see every permission change, bulk
export, and sensitive-data access event in one searchable log, so that I
can investigate anomalies and demonstrate compliance during a client
security review.

**Core Features**
- Immutable log entries: actor, action, entity type, entity ID, timestamp,
  IP/context (future), before/after values for configuration changes.
- Distinct logging for Administrator "support access" to another user's
  data (§4.13) versus normal role-scoped activity.
- Retention policy configurable (minimum retention enforced by firm
  compliance settings, cannot be shortened below a floor by any role
  including Administrator).

**Key Actions**: search/filter the log (by actor, entity type, date
range, action type); export a filtered log segment for a compliance
review.

**Inputs**: none directly — entirely system-generated from actions across
every other module.

**Outputs**: audit log entries; exported compliance reports.

**Page Specification** *(archetype: List Page)*
- **Navigation**: System → Audit Logs (Administrator only; Managing
  Partner has View access per §5.4).
- **Filters**: actor (user select), entity type, action type, date range.
- **Table columns**: Timestamp, Actor, Action, Entity (type + name/link),
  Context.
- **Empty State**: "No matching audit events."

**Future Scope**: real-time anomaly alerting (e.g., bulk export of client
financial data outside business hours); SIEM/export integration (§16);
configurable retention tiers per data category.

---

### 6.34 AI Assistant

**Purpose**
A firm-aware conversational and generative assistant, accessible from
every screen, that helps users find information, draft content, and
complete routine tasks faster — grounded in the firm's own data (matters,
documents, templates, clauses, knowledge base), never a generic external
model with no firm context.

**Business Objective**
Compress the time between "I need to know/do something" and "it's done"
across every role, turning LEXORA from a system of record into a system of
action.

**User Story**
As an **Associate**, I want to ask "summarize the last three hearings on
the Meridian Textiles matter" and get an accurate answer sourced from the
matter's actual records, so that I don't have to manually reconstruct a
timeline before a client call.

**Core Features (phased — see §14 for full detail and §17 for sequencing)**
- **Phase 1 (Assistant/Q&A)**: natural-language search and summarization
  over the firm's own data — matters, documents, notes, hearings — with
  every answer citing its source records.
- **Phase 2 (Drafting)**: first-draft generation for documents and
  clauses, grounded in the Template Library and Clause Library, always
  landing as an editable Draft document requiring human review before it
  is Final — the AI never sends or files anything autonomously.
- **Phase 3 (Action)**: permission-scoped task execution ("schedule a
  hearing follow-up task for everyone on this matter") with a confirmation
  step before any write action commits.

**Key Actions**: ask a question; request a draft; request a summary;
(Phase 3) request an action, confirm, execute.

**Inputs**: natural-language prompt; implicit context (current
matter/client/document the user is viewing, when invoked in-context).

**Outputs**: an answer with citations; a draft document/clause (saved as a
Draft, never auto-published); (Phase 3) an executed, logged action.

**Page Specification** *(archetype: global overlay + dedicated page)*
- **Navigation**: launcher icon in the global top bar (available
  everywhere); System/AI → AI Assistant for full conversation history.
- **Components**: chat-style conversation panel; inline citations linking
  back to source matters/documents; "Insert into document" / "Save as
  task" action buttons on generated content.
- **Empty State**: suggested-prompts list for first-time use ("Summarize
  this matter," "Find clauses about indemnification," "What's due this
  week?").
- **Validation**: every AI-generated write action requires explicit user
  confirmation before persisting; the assistant respects the requesting
  user's existing permission scope exactly — it cannot see or act on data
  the user could not otherwise access.

**Future Scope**: see §14 in full — this module's roadmap is extensive
enough to warrant its own dedicated section.

---

### 6.35 Client Portal

**Purpose**
A secure, minimal, firm-branded external surface where clients check
matter status, exchange documents, view and pay invoices, and message
their legal team — without ever seeing the internal application.

**Business Objective**
Eliminate the single biggest source of client dissatisfaction in legal
services — "I don't know what's happening with my case" — while reducing
the volume of status-update calls and emails that consume fee-earner time.

**User Story**
As a **Client**, I want to log in and see exactly what stage my matter is
at and what documents are needed from me, so that I'm never left guessing
or waiting on a returned call.

**Core Features**
- Four tabs only: **Overview** (matter status, responsible attorney,
  key dates), **Documents** (files explicitly marked client-visible,
  organized by matter, with upload capability for requested items),
  **Invoices** (invoices at Sent status or later, with payment status and,
  future, online payment), **Messages** (secure, matter-scoped messaging
  thread with the firm).
- Strict data scoping: a client sees only their own matters and only
  documents/notes explicitly marked client-visible — internal notes,
  strategy discussions, and non-shared documents are never exposed.
- No sidebar, no module chrome — a deliberately narrow, calm surface.

**Key Actions**: view matter status; download a shared document; upload a
requested document; view/pay an invoice (payment: future integration,
§16); send/read a secure message.

**Inputs**: uploaded documents; messages; (future) payment authorization.

**Outputs**: uploaded documents become Documents on the linked matter
(flagged as client-submitted); messages appear in the firm's Communication
Log against the client; feeds Notifications to the responsible attorney.

**Page Specification** *(archetype: dedicated minimal-chrome shell — its
own set of List/Detail patterns scoped to four tabs)*
- **Navigation**: separate authenticated entry point (`/portal` or
  client-specific subdomain, TBD at implementation), firm-branded header
  (logo, firm name), four-tab navigation, no sidebar.
- **Overview tab**: matter status card, responsible attorney contact card,
  key dates (next hearing if litigation, next milestone otherwise).
- **Documents tab**: table (name, date, uploaded by "Firm"/"You"),
  "Upload Document" button for items the firm has explicitly requested.
- **Invoices tab**: table (invoice number, date, amount, status), "Pay
  Now" button (future scope — placeholder/"contact us to pay" in MVP).
- **Messages tab**: threaded conversation view, message composer.
- **Empty States**: "No documents shared yet," "No invoices yet," "No
  messages yet" — each reassuring rather than alarming in tone, since this
  is a client-facing, trust-sensitive surface.
- **Validation**: uploaded file size/type limits enforced client-side and
  server-side; message body cannot be empty.

**Future Scope**: online invoice payment (§16); e-signature requests
surfaced directly in the portal; multi-matter clients get a matter
switcher; client satisfaction micro-survey after matter closure; portal
white-labeling (custom domain) for enterprise clients who want the portal
to feel fully like their own vendor-management surface.

---

## 7. Core Workflows

These workflows describe how modules connect in practice. Each step names
the module(s) involved and the system event(s) it triggers, so engineering
can trace exactly what must happen — records created, statuses changed,
notifications fired — at every transition.

### 7.1 End-to-End Matter Lifecycle (the primary firm workflow)

```
Client Intake
     ↓
Conflict Check
     ↓
Consultation
     ↓
Matter Created
     ↓
Documents Uploaded
     ↓
Research
     ↓
Drafting
     ↓
Review
     ↓
Filing
     ↓
Hearing
     ↓
Billing
     ↓
Payment
     ↓
Closure
     ↓
Archive
```

**Step-by-step:**

1. **Client Intake** — Reception or a Partner creates a Client record
   (§6.2) from a prospect inquiry. Minimum data: name, contact info,
   source. Status: Prospect.
2. **Conflict Check** — Before any substantive work begins, the
   responsible attorney (or, in larger firms, a designated conflicts
   function) checks the new client/matter against existing clients,
   contacts, and opposing parties firm-wide. LEXORA surfaces potential
   name matches automatically (§9); a human decision (Clear / Escalate /
   Decline) is always required — the system never auto-clears a conflict.
   The conflict-check outcome and reviewer are recorded against the
   client/matter record permanently.
3. **Consultation** — A Meeting (§6.10) is scheduled and logged; Notes
   (§6.11) capture the substance of the discussion. Client status may
   remain Prospect until formally engaged.
4. **Matter Created** — Once engaged, a Matter (§6.5) is created, linked
   to the Client (now transitioned to Active status), with practice area,
   responsible attorney, billing type, and priority set. Matter status:
   Intake.
5. **Documents Uploaded** — Engagement letter, client-provided documents,
   and initial file materials are uploaded to the matter's Documents tab
   (§6.12). Matter status transitions to Active once substantive work
   begins.
6. **Research** — Research requests (§6.17) are logged as Tasks tagged
   Research; findings are attached to the matter as memos and, where
   broadly useful, published to the Knowledge Base (§6.16).
7. **Drafting** — Associates use Document Generator (§6.13), Template
   Library (§6.14), and Clause Library (§6.15) to produce first drafts,
   saved as Documents with status Draft.
8. **Review** — The responsible Partner reviews drafts; feedback is
   captured via Notes or new Task assignments; document status
   progresses Draft → Final once approved.
9. **Filing** *(litigation matters)* — Final documents are filed with the
   court; Court Case details (§6.6) are attached or updated (case number,
   filing date); the filed document's status becomes Final and, where
   court rules require, Shared (with the client) or Archived-for-record.
10. **Hearing** *(litigation matters)* — Hearings (§6.7) are scheduled and
    tracked through to outcome; each hearing's outcome may generate
    follow-on Tasks (e.g., "prepare response to opposing counsel's
    submission").
11. **Billing** — Time Entries logged throughout the matter's life (by
    every fee-earner who worked on it) and billable Expenses (§6.21) are
    compiled into an Invoice (§6.19), status Draft → Sent.
12. **Payment** — The client pays; a Payment (§6.20) is recorded,
    automatically updating the Invoice status (Sent → Partially Paid /
    Paid).
13. **Closure** — Once the matter's substantive work concludes (favorable
    resolution, settlement, withdrawal, or client decision), the
    responsible Partner changes Matter status to Closed. All open Tasks
    must be resolved or explicitly carried forward before closure is
    permitted (§9).
14. **Archive** — After a firm-configured retention-review period (or
    immediately at the firm's discretion), a Closed matter transitions to
    Archived — read-only, excluded from active-matter counts and pipeline
    views, but fully retrievable for records-retention and compliance
    purposes. Documents on an archived matter retain their full version
    history indefinitely per §11.

### 7.2 Document Lifecycle Workflow

```
Uploaded (Draft) → Internal Review → Revised (new Version) → Approved (Final)
        → Shared with Client (optional) → Superseded or Archived
```

- Every re-upload against the same logical document creates a new
  **Version**; the prior version is retained, never overwritten.
- A document cannot be marked **Shared** (client-visible) until it is
  **Final** — draft work product is never inadvertently exposed to a
  client via the Portal (enforced business rule, §9).
- **Archived** documents are read-only; only an Administrator can restore
  an archived document to active status, and doing so is an audited
  action.

### 7.3 Task Lifecycle Workflow

```
To Do → In Progress → In Review → Done
   ↘________________________________↗
        (may be reopened if review fails)
```

- A task moves to **In Review** when the assignee believes the work is
  complete but it requires sign-off (typically drafting/research tasks
  reviewed by a supervising attorney).
- A task in **In Review** can move back to **In Progress** if the reviewer
  requests changes — this is not a failure state, it is an expected part
  of the workflow, and the system does not penalize or flag this reversal.
- **Done** is terminal for that task instance; a materially new round of
  work is a new Task, not a reopened one, to preserve accurate historical
  reporting on first-pass completion rates (future Analytics use case).

### 7.4 Invoice Lifecycle Workflow

```
Draft → Sent → Partially Paid → Paid
  ↓        ↓
 Void    Overdue → Paid / Void
```

- **Draft**: editable; not visible to the client; can be freely modified
  or deleted.
- **Sent**: locked against line-item edits (a correction requires a
  credit note in V1.0+, or Void-and-reissue in MVP); becomes visible in
  the Client Portal; due-date countdown begins.
- **Overdue**: automatic status derived when the due date passes with a
  balance remaining — not a manually set status.
- **Partially Paid**: automatic status when `amountPaid > 0` and
  `< total`.
- **Paid**: automatic status when `amountPaid ≥ total`.
- **Void**: manually set by Accounts/Managing Partner with a required
  reason; a voided invoice is excluded from AR totals but retained for
  audit history — never deleted.

### 7.5 Hearing Workflow

```
Scheduled → (occurs) → Outcome Recorded → Next Hearing Scheduled (if any)
    ↓
 Adjourned → Next Hearing Scheduled
    ↓
 Cancelled (with reason)
```

- Recording an outcome with a "next hearing date" automatically creates
  the follow-on Hearing record pre-filled with the same matter, court, and
  (unless changed) judge — reducing re-entry for multi-session litigation.

### 7.6 Client Onboarding to First Bill (condensed view for smaller/
non-litigation matters, e.g., a Corporate advisory engagement)

```
Client Intake → Conflict Check → Engagement Letter Signed → Matter Created
   → Work Performed (Tasks, Time Entries) → Invoice Generated → Payment
   → Matter Closed
```

### 7.7 Employee Leave Workflow

```
Leave Requested → Manager/HR Review → Approved → Attendance Updated
                                    ↘ Declined (employee notified)
```

### 7.8 Research Request Workflow

```
Research Task Created (tagged, matter-linked) → Assigned to Researcher
   → Findings Logged → Memo Attached to Matter → (optional) Published to
   Knowledge Base → Task Marked Done
```

### 7.9 Document Generation Workflow

```
Template Selected → Preview → Merge Fields Filled (client/matter
   pre-populated where possible) → Document Generated (Draft status)
   → Attached to Matter → Template usage count incremented
```

---

## 8. Data Model

This section defines every core entity, its essential fields, and its
relationships to other entities. It is written to be directly translatable
into a relational schema (the reference implementation uses this exact
model). Every entity has a system-generated primary identifier; fields
marked **(req)** are required at creation.

### 8.1 Entity Overview

| Domain | Entities |
|---|---|
| Firm structure | Firm, Office, PracticeArea, CourtListEntry |
| People | User (internal roles), Employee extension fields, AttendanceRecord, LeaveType, LeaveRequest |
| CRM | Client, Contact |
| Practice | Matter, MatterTeamMember, CourtCase, Hearing, Task |
| Collaboration | Note, Meeting, CommunicationLog, Announcement |
| Documents & Knowledge | DocumentFolder, DocumentFile, DocumentVersion, Template, Clause, KnowledgeArticle |
| Finance | Invoice, InvoiceLineItem, Payment, Expense, Retainer, TimeEntry |
| System | Notification, ActivityLog, AuditLog, AIConversation, AIMessage |
| Client-facing | ClientPortalAccess |

### 8.2 Entity Relationship Summary

```
Firm 1───* Office
Firm 1───* PracticeArea
Firm 1───* CourtListEntry
Firm 1───* User

Office 1───* User

Client 1───* Contact
Client 1───* Matter
Client 1───* Invoice
Client 1───* DocumentFile
Client 1───* Note
Client 1───* Meeting
Client 1───* CommunicationLog
Client 1───* Retainer
Client 1───1 ClientPortalAccess

Matter *───1 Client
Matter *───1 PracticeArea
Matter *───1 User (responsibleAttorney)
Matter 1───* MatterTeamMember ─── *───1 User
Matter 1───0..1 CourtCase
Matter 1───* Hearing
Matter 1───* Task
Matter 1───* DocumentFile
Matter 1───* DocumentFolder
Matter 1───* Note
Matter 1───* Invoice
Matter 1───* Expense
Matter 1───* TimeEntry
Matter 1───* Retainer
Matter 1───* ActivityLog

Task *───1 User (assignee)
Task *───1 User (createdBy)
Task *───0..1 Matter

Hearing *───1 Matter

DocumentFolder 1───* DocumentFolder (self, parent/child)
DocumentFolder 1───* DocumentFile
DocumentFile 1───* DocumentVersion
DocumentFile *───1 User (uploadedBy)

Invoice 1───* InvoiceLineItem
Invoice 1───* Payment
Invoice *───1 Client
Invoice *───0..1 Matter

Payment *───1 Invoice
Payment *───1 Client

Expense *───0..1 Matter
Expense *───0..1 Client
Expense *───1 User (submittedBy)

TimeEntry *───1 Matter
TimeEntry *───1 User

Retainer *───1 Client
Retainer *───0..1 Matter

User 1───* AttendanceRecord
User 1───* LeaveRequest
LeaveRequest *───1 LeaveType

User 1───* Notification
User 1───* AuditLog (as actor)
User 1───* ActivityLog (as actor)

AIConversation *───1 User
AIConversation 1───* AIMessage

ClientPortalAccess *───1 Client
ClientPortalAccess *───0..1 Contact
```

### 8.3 Entity Definitions

**Firm** — the tenant root. `name` (req), `legalName`, `tagline`, `logoUrl`,
`email`, `phone`, `website`, address fields, `taxId`, `foundedYear`,
`timezone` (req, default per install locale), `currency` (req, default
per install locale), `invoicePrefix` (req), `invoiceNextNumber` (req),
`financialYearStartMonth` (req).

**Office** — `firmId` (req), `name` (req), `isPrimary` (bool), address
fields, `phone`, `email`.

**PracticeArea** — `name` (req, unique), `color` (req — hex, drawn from
the firm's validated categorical palette, §9), `description`, `icon`.

**CourtListEntry** — `name` (req), `type` (req — enum: Supreme Court, High
Court, District Court, Tribunal, Consumer Forum, Family Court,
Arbitration, Other), `city`, `state`, `address`, `phone`, `email`.

**User** — the internal person entity, representing every persona in §4
except Client. `name` (req), `email` (req, unique), `phone`, `role` (req —
enum matching §4's 12 internal personas plus Administrator), `title`,
`avatarUrl`, `barNumber` (fee-earners), `status` (Active/Inactive),
`utilizationTarget` (int, %, 0 for non-fee-earning roles), `officeId`,
`joinedAt` (req).

**Client** — `clientNumber` (req, unique, system-generated per §11),
`type` (req — Individual / Company), `name` (req), `companyName`
(Company type only), `industry`, `email`, `phone`, address fields,
`taxId`, `status` (req — Active/Prospect/Inactive), `source`, `tags`,
`relationshipManagerId` (req, → User).

**Contact** — `name` (req), `title`, `email`, `phone`, `clientId` (req, →
Client/Company — a Contact may link to more than one Client via a join
table `ContactClientLink` in firms that require it; single-link is the
default), `roleTags` (multi — Primary/Billing/Signatory/CC-only), `status`
(Active/Inactive).

**Matter** — `matterNumber` (req, unique, system-generated per §11),
`title` (req), `description`, `clientId` (req), `practiceAreaId` (req),
`status` (req — see §12.4), `priority` (req — see §12.2), `billingType`
(req — Hourly/Fixed Fee/Contingency/Retainer), `hourlyRate` (if Hourly),
`estimatedValue`, `openedDate` (req), `targetCloseDate`, `closedDate`,
`opposingParty`, `opposingCounsel`, `responsibleAttorneyId` (req, → User).

**MatterTeamMember** — join entity: `matterId` (req), `userId` (req),
`roleOnMatter` (req — Lead/Associate/Paralegal/Support). Unique on
(matterId, userId).

**CourtCase** — `matterId` (req, unique — one-to-one), `caseNumber` (req),
`caseType` (req), `courtId` (req, → CourtListEntry), `courtroom`, `judge`,
`filingDate`, `caseStage` (court-reported, free text/enum per
jurisdiction), `opposingCounsel`.

**Hearing** — `matterId` (req), `courtName` (req — denormalized from
CourtListEntry at time of scheduling for historical accuracy even if the
court record later changes), `courtroom`, `judge`, `hearingType` (req),
`scheduledAt` (req, datetime), `status` (req — see §12.6), `outcome`,
`nextHearingDate`.

**Task** — `title` (req), `description`, `matterId` (nullable — firm-wide
tasks allowed), `assigneeId` (req, → User), `createdById` (req, → User),
`status` (req — see §7.3/§12.1), `priority` (req — see §12.2), `dueDate`,
`completedAt`.

**Note** — `body` (req), `matterId` (nullable), `clientId` (nullable —
exactly one of matterId/clientId must be set), `authorId` (req, → User),
`pinned` (bool).

**Meeting** — `title` (req), `matterId` (nullable), `clientId` (nullable),
`scheduledAt` (req), `durationMinutes` (req), `location`, `attendees`,
`status` (req — Scheduled/Completed/Cancelled), `notes`.

**CommunicationLog** — `matterId` (nullable), `clientId` (nullable),
`type` (req — Email/Call/Meeting/Letter/SMS), `subject` (req), `summary`,
`occurredAt` (req), `loggedById` (req, → User).

**Announcement** — `title` (req), `body` (req), `priority` (req —
Normal/Important/Urgent), `publishedAt` (req), `expiresAt`, `createdById`
(req, → User).

**DocumentFolder** — `name` (req), `parentId` (nullable, self-referencing),
`matterId` (nullable), `clientId` (nullable).

**DocumentFile** — `name` (req), `folderId` (nullable), `matterId`
(nullable), `clientId` (nullable), `fileType` (req), `sizeBytes` (req),
`storagePath` (req — see §11), `version` (req, int, default 1), `tags`,
`status` (req — see §12.7), `isArchived` (bool), `isShared` (bool, client
visibility flag), `uploadedById` (req, → User).

**DocumentVersion** — `documentId` (req, → DocumentFile), `version` (req,
int), `storagePath` (req), `note`, `uploadedById` (req, → User).

**Template** — `name` (req), `category` (req — the fixed 13-category
taxonomy, §6.13), `description`, `storagePath`, `isFavorite` (per-user in
V1.0; MVP is firm-wide), `usageCount` (req, default 0), `lastUsedAt`.

**Clause** — `title` (req), `category` (req), `body` (req), `tags`,
`isFavorite`, `usageCount` (req, default 0).

**KnowledgeArticle** — `title` (req), `category` (req), `summary`, `body`
(req), `tags`, `authorId` (req, → User), `publishedAt` (req), `viewCount`
(req, default 0).

**Invoice** — `invoiceNumber` (req, unique, system-generated per §11),
`clientId` (req), `matterId` (nullable), `status` (req — see §7.4/§12.5),
`issueDate` (req), `dueDate` (req), `subtotal` (req), `taxAmount` (req,
default 0), `discount` (default 0), `total` (req), `amountPaid` (req,
default 0), `currency` (req), `notes`.

**InvoiceLineItem** — `invoiceId` (req), `description` (req), `quantity`
(req, default 1), `rate` (req), `amount` (req), `type` (req — Fee/
Expense).

**Payment** — `invoiceId` (req), `clientId` (req), `amount` (req, > 0),
`method` (req — Bank Transfer/Cheque/Cash/Card/UPI/Other), `reference`,
`paidAt` (req).

**Expense** — `matterId` (nullable), `clientId` (nullable), `category`
(req), `description` (req), `amount` (req, > 0), `incurredAt` (req),
`billable` (req, bool), `reimbursed` (req, bool, default false),
`submittedById` (req, → User).

**Retainer** — `clientId` (req), `matterId` (nullable), `amount` (req),
`balance` (req), `status` (req — Active/Depleted/Closed), `startDate`
(req).

**TimeEntry** — `matterId` (req), `userId` (req), `date` (req), `minutes`
(req, > 0), `description` (req), `billable` (req, bool), `rate`
(nullable — inherited from matter's hourlyRate if not overridden),
`invoiced` (req, bool, default false).

**AttendanceRecord** — `userId` (req), `date` (req), `status` (req —
Present/Remote/Absent/On Leave/Holiday), `clockIn`, `clockOut`. Unique on
(userId, date).

**LeaveType** — `name` (req), `accrualPolicy` (firm-configurable),
`isPaid` (req, bool).

**LeaveRequest** — `userId` (req), `leaveTypeId` (req), `startDate` (req),
`endDate` (req, ≥ startDate), `reason`, `status` (req —
Pending/Approved/Declined/Cancelled), `reviewedById` (nullable, → User).

**Notification** — `userId` (req, recipient), `type` (req — enum per
§6.30), `message` (req), `entityType`, `entityId` (link to source
record), `read` (req, bool, default false), `createdAt` (req).

**ActivityLog** — the business-facing timeline event. `action` (req,
human-readable, e.g., "created a new matter"), `entityType` (req),
`entityId` (req), `matterId` (nullable), `clientId` (nullable), `actorId`
(req, → User), `createdAt` (req).

**AuditLog** — the security/compliance-facing event, structurally similar
to ActivityLog but scoped to security-relevant actions (permission
changes, bulk exports, Administrator support-access, deletions) and
immutable once written — no update or delete operation exists for this
entity, enforced at the database layer, not just the application layer.

**AIConversation** — `userId` (req), `title`, `context` (nullable —
matter/client/document the conversation was launched from), `createdAt`
(req).

**AIMessage** — `conversationId` (req), `role` (req — user/assistant),
`content` (req), `citations` (nullable — array of entity references),
`createdAt` (req).

**ClientPortalAccess** — `clientId` (req), `contactId` (nullable — which
individual contact this login belongs to, for company clients with
multiple portal users), `email` (req, unique), `status` (req —
Active/Invited/Disabled), `lastLoginAt`.

---

## 9. Business Rules

1. **Conflict checks are mandatory and human-gated.** A Matter cannot move
   from Intake to Active status until a conflict-check outcome (Clear /
   Escalated-and-Resolved) is recorded against it. The system surfaces
   candidate name matches automatically but never auto-clears a conflict —
   a human decision is always required and permanently recorded.
2. **A client only sees what is explicitly shared.** A DocumentFile is
   visible in the Client Portal only when `isShared = true` **and**
   `status = Final`. A Note is never client-visible, under any
   circumstance — Notes are exclusively internal. A Task is never
   client-visible.
3. **Draft documents cannot be shared.** The `isShared` flag cannot be set
   to `true` while a document's `status = Draft`; the document must first
   be marked `Final`. This is enforced at the application layer and
   cannot be bypassed by any role, including Administrator.
4. **Sent invoices are locked against silent edits.** Once an Invoice's
   `status` moves to `Sent` or beyond, its line items become read-only.
   Any correction requires either (a) a credit note (V1.0+) or (b) voiding
   the invoice and issuing a new one (MVP) — an invoice total is never
   silently changed after the client has seen it.
5. **Invoice status is derived, not manually set, for the paid states.**
   `Overdue`, `Partially Paid`, and `Paid` are computed from `dueDate` and
   `amountPaid` vs. `total`. Only `Draft`, `Sent`, and `Void` are
   user-set states.
6. **A matter cannot close with unresolved tasks.** Closing a Matter (status
   → Closed) requires every open Task linked to that matter to be either
   `Done` or explicitly reassigned to a different matter/removed. This
   prevents "silent orphaning" of unfinished work when a matter closes.
7. **Payments cannot exceed the invoice balance.** A Payment's `amount`
   cannot cause `amountPaid` to exceed `total` on the linked Invoice; the
   system blocks the overpayment and prompts the user to either adjust the
   amount or apply the excess as a client credit/retainer top-up (future
   scope).
8. **Time entries are the only path to billable revenue.** An Invoice fee
   line item generated from time (V1.0+ "generate from unbilled time"
   flow) can only draw from `TimeEntry` records with `billable = true` and
   `invoiced = false`; once included on an invoice, `invoiced` flips to
   `true` and that time entry cannot be included on a second invoice.
9. **Categorical color assignment is fixed, not generated.** Practice
   Area colors are assigned once, in a fixed order, from the firm's
   validated categorical palette (never auto-generated per new practice
   area) — this guarantees the same practice area always renders in the
   same color everywhere in the system, and that the palette remains
   colorblind-safe as practice areas are added.
10. **Role-based visibility is enforced at the query layer, not just the
    UI layer.** Hiding a module in the sidebar is a UX convenience, not a
    security boundary — every data-fetching operation independently
    enforces the permission matrix (§5.4) regardless of which screen
    requested it.
11. **Administrator access is powerful but never silent.** Any data access
    or edit performed by an Administrator outside their own normal
    workflow (i.e., accessing another user's client/matter/financial data
    for support purposes) is written to the Audit Log distinctly from
    ordinary user activity, and is visible to the Managing Partner.
12. **Soft delete by default.** Clients, Matters, Documents, and Employee
    records are never hard-deleted through normal application flows —
    they are archived/deactivated. Hard deletion (e.g., for a GDPR/
    right-to-erasure request) is an Administrator-only, audited, and
    firm-policy-gated action, distinct from routine archiving.
13. **A leave request cannot be approved into a negative balance** without
    an explicit "convert excess to unpaid leave" confirmation from
    HR/the approving manager.
14. **Notifications respect permission scope.** A user is only notified
    about events on records they have at least View access to — the
    notification system cannot leak the existence or content of a record
    a user is not permitted to see.
15. **The AI Assistant inherits, never expands, the requesting user's
    permissions.** Every AI Assistant query and action is executed as the
    requesting user, with the exact same data-access boundaries as if that
    user performed the action manually through the standard UI.

## 10. Validation Rules

**Identity & required fields**
- `Client.name`: required, minimum 2 characters.
- `Matter.title`: required, minimum 3 characters.
- `Matter.clientId`, `Matter.practiceAreaId`, `Matter.responsibleAttorneyId`:
  required — a matter cannot exist without a client, practice area, and
  named responsible attorney.
- `Task.title`: required, minimum 3 characters. `Task.assigneeId`:
  required — every task must have a named owner; "unassigned" is not a
  valid state.
- `Hearing.matterId`, `Hearing.scheduledAt`: required.
- `Invoice.clientId`: required. Every `InvoiceLineItem.amount` must be
  > 0.
- `Payment.amount`: required, > 0, and ≤ the linked invoice's outstanding
  balance at time of entry.
- `Expense.amount`: required, > 0.
- `LeaveRequest.endDate` must be ≥ `startDate`.
- `Note.body`: required, minimum 2 characters (blank notes are rejected
  client-side and server-side).

**Format validation**
- Email fields (Client, Contact, User, ClientPortalAccess): must match a
  valid email format when provided; required and validated for `User.email`
  and `ClientPortalAccess.email` specifically (both must be unique).
- `CourtCase.caseNumber`: format-validated against a firm-configurable
  jurisdiction pattern (Settings → Firm Configuration) when the firm has
  defined one; otherwise free text.
- `Firm.invoicePrefix`: required, alphanumeric, no whitespace.
- Hex color fields (`PracticeArea.color`): must be a valid 6-digit hex
  value and, at creation, is checked against the firm's validated
  categorical palette generator (§9.9) rather than accepted as arbitrary
  freeform color — a firm may override with a custom palette, but the
  override must itself pass the same colorblind-safety/contrast validator
  before saving (see the design-system palette validation approach in
  Appendix reference, consistent with how LEXORA's own UI is validated).

**Referential validation**
- A `Note`, `Meeting`, `Expense`, or `DocumentFile` must reference at least
  one of `matterId` / `clientId` — a record floating with neither is
  invalid.
- `MatterTeamMember` is unique on `(matterId, userId)` — a user cannot be
  added to the same matter's team twice; re-adding an existing member
  updates their `roleOnMatter` instead of creating a duplicate row.
- `AttendanceRecord` is unique on `(userId, date)` — one attendance status
  per person per day.

**Business-state validation**
- A Matter cannot transition to `Closed` while it has Tasks with status
  other than `Done` (see Business Rule 6).
- A DocumentFile cannot have `isShared = true` while `status = Draft`
  (Business Rule 3).
- An Invoice's line items are immutable once `status` ≥ `Sent` (Business
  Rule 4).
- A duplicate-name warning (non-blocking, dismissible) is shown when
  creating a Client whose name closely matches an existing Client's name
  (fuzzy match), to reduce accidental duplicate records without preventing
  legitimate same-name clients (e.g., two different people with common
  names).

**File upload validation**
- Maximum file size and accepted file types are firm-configurable
  (Settings → Firm Configuration), with sensible defaults (25 MB per file
  in MVP; common office, PDF, and image formats accepted by default).
- Every uploaded filename is sanitized before being written to storage
  (see §11) to prevent path traversal or invalid-character issues,
  regardless of what the user's original filename contained.

---

## 11. File Storage Structure & Naming Conventions

### 11.1 File Storage Structure

Every uploaded file is stored under a single storage root, organized by
owning entity so that a file's location on disk is always predictable from
its database record:

```
/storage
  /matters
    /{matterId}/
      {sanitized-filename}
      {sanitized-filename}
  /clients
    /{clientId}/
      {sanitized-filename}
  /templates
    /{templateId}/
      {sanitized-filename}
  /firm
    /branding/
      logo.{ext}
```

- Files are never stored by their original human-readable name alone in a
  flat directory — the owning entity's ID as the parent directory
  guarantees no collision between two different matters that happen to
  produce identically named files (e.g., two different clients both
  uploading `NDA.pdf`).
- **Version history** does not create separate files per version in a
  flimsy `_v2`, `_v3` suffix convention; each `DocumentVersion` record
  stores its own `storagePath`, so the storage layer simply accumulates
  one physical file per version, and the database — not the filename — is
  the source of truth for "which version is current."
- All file paths are validated server-side to resolve strictly inside the
  storage root before any read/write operation — no request-supplied path
  segment is ever trusted without this containment check, preventing path
  traversal regardless of client input.
- Storage is abstracted behind a single interface so the physical backend
  (local disk in early deployments, object storage such as S3-compatible
  storage for larger/cloud deployments) can change without any change to
  the rest of the application (§16).

### 11.2 Naming Conventions

**Matter Number**: `{FIRM-CODE}-{YEAR}-{SEQUENCE}`, e.g. `LEX-2026-0142`.
Sequence resets annually per firm configuration (default) or runs
continuously (firm-configurable) for firms that prefer never-repeating
matter numbers.

**Client Number**: `CLT-{SEQUENCE}`, e.g. `CLT-0004`. Continuous,
firm-wide, never reused even if a client record is archived.

**Invoice Number**: `{INVOICE-PREFIX}-{YEAR}-{SEQUENCE}`, e.g.
`LEX-INV-2026-0024`. `INVOICE-PREFIX` is firm-configurable (Settings →
Invoice Settings); sequence behavior mirrors Matter Number.

**Uploaded filenames** (on disk): the original filename with any
character outside `[A-Za-z0-9._-]` replaced with `_`; the human-readable
original name is preserved separately in the `DocumentFile.name` field for
display, so sanitization never degrades the user-facing experience.

**Document display naming convention** (recommended, enforced via
Document Generator output naming, advisory elsewhere): 
`{DocumentType}_{MatterNumber}.{ext}`, e.g.
`Engagement_Letter_LEX-2026-0142.pdf` — this is the convention Document
Generator applies automatically to generated output, and is recommended
(not force-renamed) for manually uploaded files.

**Practice Area, Court, and Template category names**: Title Case, no
abbreviations in the display name (abbreviations are permitted in a
separate `code` field for integrations, future scope).

---

## 12. Status, Priority & Lifecycle Systems

This section consolidates every status/priority enumeration referenced
throughout the document into one authoritative reference.

### 12.1 Task Status

| Status | Meaning |
|---|---|
| To Do | Not yet started |
| In Progress | Actively being worked |
| In Review | Work believed complete, awaiting sign-off |
| Done | Complete and approved (terminal) |

### 12.2 Priority (applies to Tasks and Matters)

| Priority | Meaning | Visual |
|---|---|---|
| Low | No time pressure | Neutral |
| Medium | Standard priority | Informational (blue) |
| High | Elevated attention required | Warning (amber) |
| Urgent | Immediate attention required | Critical (red) |

### 12.3 Client Status

| Status | Meaning |
|---|---|
| Prospect | Intake started, not yet engaged |
| Active | Currently engaged, one or more open matters possible |
| Inactive | No current engagement; historical record retained |

### 12.4 Matter Status (Matter Stages)

| Status | Meaning |
|---|---|
| Intake | Matter created, conflict check and initial setup in progress |
| Active | Substantive work underway |
| On Hold | Temporarily paused (client decision, awaiting external event) |
| Closed | Substantive work concluded |
| Archived | Closed and past the firm's active-retention window; read-only |

Transition rules: Intake → Active requires a recorded conflict-check
outcome (§9.1). Active ↔ On Hold is bidirectional. Closed requires zero
open Tasks (§9.6). Archived is one-directional from Closed except by
Administrator restore (audited).

### 12.5 Invoice Status (Invoice Lifecycle)

| Status | Meaning | Set by |
|---|---|---|
| Draft | Editable, not client-visible | User |
| Sent | Delivered to client, line items locked | User |
| Partially Paid | `0 < amountPaid < total` | System (derived) |
| Paid | `amountPaid ≥ total` | System (derived) |
| Overdue | Past `dueDate` with balance remaining | System (derived) |
| Void | Cancelled, excluded from AR, retained for audit | User (reason required) |

### 12.6 Hearing Status

| Status | Meaning |
|---|---|
| Scheduled | Upcoming, not yet occurred |
| Completed | Occurred, outcome recorded |
| Adjourned | Occurred but postponed to a new date |
| Cancelled | Will not occur (reason recorded) |

### 12.7 Document Status (Document Lifecycle)

| Status | Meaning |
|---|---|
| Draft | Work in progress, never client-visible |
| Final | Approved, internally authoritative |
| Shared | Final and explicitly made client-visible |
| Archived | Read-only, retained for records |

### 12.8 Client Portal Access Status

| Status | Meaning |
|---|---|
| Invited | Access created, client has not yet logged in |
| Active | Client has logged in at least once |
| Disabled | Access revoked (matter closed, relationship ended, security concern) |

### 12.9 Leave Request Status

| Status | Meaning |
|---|---|
| Pending | Submitted, awaiting approval |
| Approved | Approved; corresponding Attendance entries created |
| Declined | Rejected by approver (reason recorded) |
| Cancelled | Withdrawn by the employee (only while Pending or future-dated Approved) |

### 12.10 Employee/User Status

| Status | Meaning |
|---|---|
| Active | Currently employed, can be assigned work |
| Inactive | Departed; historical assignments and records preserved |

---

## 13. Non-Functional Requirements

These are stated briefly here as constraints every module specification in
§6 must be built against; they are not themselves modules.

- **Performance**: any list page must render its first meaningful paint in
  under 1 second for firms with up to 10,000 matters and 100,000
  documents, using server-side pagination and indexed queries — no module
  may load its entire dataset client-side "and filter in the browser"
  once a firm's data volume exceeds a trivial size.
- **Security**: role-based access control enforced at the data-access
  layer (§9.10); all data encrypted at rest and in transit; file storage
  path containment (§11.1); Administrator support-access is always
  audited (§9.11).
- **Reliability**: no user-initiated action (creating a matter, sending an
  invoice, uploading a document) may silently fail — every action either
  succeeds with visible confirmation or fails with a clear, actionable
  error.
- **Accessibility**: WCAG 2.1 AA as the baseline for the Firm Workspace
  and, especially, the Client Portal (client-facing surfaces must not
  assume technical sophistication).
- **Availability**: the system is designed for 99.9% uptime once deployed
  in a production/cloud configuration; the local/on-prem deployment mode
  (§16) trades managed-availability guarantees for zero external
  dependency, by design, for firms that require it.
- **Data portability**: every firm's data must be fully exportable (CSV/
  JSON for structured data, original files for documents) at any time —
  a firm is never locked into LEXORA by an inability to leave with its own
  data.
- **Internationalization readiness**: currency, timezone, and date-format
  are firm-level configuration (§6.31), not hardcoded, from the first
  release — even though the initial target market's defaults are set in
  Settings, the underlying model does not assume a single locale.

## 14. Future AI Features

LEXORA's AI Assistant (§6.34) is the anchor for this roadmap, but AI
capability is planned to extend into nearly every module. Every AI feature
in this section follows three non-negotiable principles: **(1)** grounded
in the firm's own data with visible citations — never an ungrounded
generic answer; **(2)** every write action requires explicit human
confirmation before it persists; **(3)** AI never exceeds the requesting
user's existing permission scope (§9.15).

1. **Conversational Firm Q&A** — "What's the status of the Meridian
   matter?", "Who's the responsible attorney on LEX-2026-0142?", "Show me
   every overdue invoice for clients in the Real Estate practice area" —
   answered instantly, sourced from live data, with citations.
2. **AI-Assisted Drafting** — generate a first draft of a document from a
   natural-language brief, grounded in the firm's own Template Library and
   Clause Library (never inventing legal language outside the firm's
   approved bank), always landing as an editable Draft.
3. **Smart Clause Suggestions** — while drafting in Document Generator, AI
   proactively suggests relevant clauses from the Clause Library based on
   the document type and content so far.
4. **Matter Summarization** — one-click chronological or issue-based
   summary of an entire matter's timeline, for client updates, hand-offs
   between attorneys, or hearing preparation.
5. **Research Synthesis** — summarize research findings across multiple
   sources into a structured memo, with every claim traceable to its
   source citation.
6. **Meeting Notes Generation** — (with explicit consent/recording policy
   compliance) generate structured meeting notes and action items from a
   meeting transcript, auto-creating draft Tasks for review.
7. **Document Review Assistant** — flag missing standard clauses,
   inconsistent defined terms, or deviations from the firm's template
   baseline in an uploaded/drafted document, before it goes to partner
   review.
8. **Predictive Deadline Risk** — proactively flag matters where the
   pattern of task/hearing activity suggests a deadline is at risk of
   being missed, before it is missed.
9. **Billing Narrative Assistant** — suggest clearer, client-appropriate
   time-entry narratives from an attorney's brief shorthand, improving
   invoice clarity and reducing client billing disputes.
10. **Natural-Language Reporting** — "show me utilization by practice area
    for Q2" answered as a generated chart/table on demand, without a
    human building that specific report in advance (extends Analytics,
    §6.29).
11. **Conflict-Check Assistance** — AI-assisted fuzzy matching across
    names, aliases, and known corporate affiliations to strengthen (never
    replace) the human conflict-check step (§9.1).
12. **Client-Facing AI Concierge** *(Client Portal, longer-horizon)* — a
    scoped, cautious assistant answering routine client questions ("has my
    document been received?") strictly from that client's own visible
    data, with an explicit and prominent hand-off to a human for anything
    substantive.

## 15. Future Automation Features

1. **Workflow Rule Builder** — firm-configurable "when X happens, do Y"
   automation (e.g., "when a matter status changes to Closed, notify
   Accounts to issue a final invoice"; "when a document is tagged
   'Engagement Letter' and marked Final, auto-share to the Client Portal").
2. **Automated Deadline Reminders** — escalating reminder cadence as a
   hearing or task due date approaches, configurable per event type and
   per role.
3. **Auto-Generated Invoices from Time/Expense** — scheduled (e.g.,
   monthly) automatic draft-invoice generation from a matter's unbilled
   time and expenses, queued for partner review rather than auto-sent.
4. **Collections Follow-Up Automation** — automatic, tone-configurable
   follow-up communications triggered by an invoice crossing into Overdue
   status, with automatic stop when payment is recorded.
5. **Onboarding/Offboarding Checklists** — automated task-list generation
   when a new Employee record is created (IT access, workstation, HR
   paperwork) or an Employee is marked Inactive (access revocation
   checklist).
6. **Recurring Task Templates** — matter-type-specific task checklists
   auto-populated when a Matter of that type is created (e.g., every new
   litigation matter automatically gets "file appearance," "conduct
   conflict check," "calendar limitation period").
7. **Retainer Auto-Replenishment Alerts** — automatic notification (and,
   future, automatic replenishment invoice) when a Retainer balance drops
   below a firm-configured threshold.
8. **Document Expiry/Review Reminders** — for time-bound documents (e.g.,
   powers of attorney, licenses referenced in compliance matters),
   automated reminders ahead of expiry.
9. **Smart Task Assignment Suggestions** — suggest an assignee for a new
   task based on current workload, practice area fit, and matter team
   membership (a suggestion, never an automatic assignment, to preserve
   human judgment in staffing).

## 16. Future Integrations

1. **Calendar Sync** — two-way sync with Google Calendar and Microsoft
   Outlook/Exchange for Hearings, Meetings, and Task due dates.
2. **Email Integration** — send/log client and matter correspondence
   directly from Outlook/Gmail into the Communication Log and matter
   Timeline, without manual re-entry.
3. **E-Signature** — DocuSign/Adobe Sign-class integration for sending
   generated documents directly for signature from Document Generator/
   Documents, with signed status flowing back automatically.
4. **Payment Gateway** — online invoice payment from the Client Portal
   (card, bank transfer, regional payment methods as applicable per
   deployment market).
5. **Accounting Export/Sync** — export or two-way sync of Invoices,
   Payments, and Expenses to standard accounting platforms, so firm
   accountants are not forced to re-key financial data.
6. **External Legal Research Databases** — direct integration from the
   Research module into recognized legal research platforms, with results
   importable as sourced findings.
7. **Court E-Filing / Cause List Feeds** — where a jurisdiction offers a
   public API or data feed, automatic cause-list matching for Hearings and
   e-filing status updates for Court Cases.
8. **Cloud Object Storage** — pluggable storage backend (S3-compatible)
   as an alternative to local disk storage (§11.1) for firms deploying in
   a cloud/multi-office context requiring shared, geographically
   redundant storage.
9. **SSO / Identity Provider Integration** — SAML/OIDC integration with
   firm identity providers (Okta, Azure AD, Google Workspace) once
   authentication ships (§17), so user provisioning follows the firm's
   existing identity system rather than being LEXORA-only.
10. **SIEM / Compliance Export** — Audit Log streaming to a firm's
    security information and event management system for enterprise
    clients with existing compliance tooling.
11. **Communication Channels (Notifications)** — email and, longer-term,
    SMS/push delivery channels for Notifications (§6.30), beyond in-app
    only.
12. **Video Conferencing** — auto-generated meeting links (Zoom/Teams/
    Google Meet) attached to Meeting records.

---

## 17. Development Roadmap

The roadmap is sequenced so that every phase ships a **complete, usable
product** for its target scope — never a half-built cross-section of every
feature. Each phase is additive; nothing in an earlier phase is
re-architected by a later one, only extended (consistent with the
data model in §8 being designed for the full product from day one, even
though later phases activate more of it).

### 17.1 MVP — Managing Partner, Single-Firm, No Authentication

**Goal**: prove the core operating-system thesis end-to-end for the
highest-leverage persona (Managing Partner) and the modules a firm feels
the absence of most acutely, running entirely locally with zero external
dependencies.

**Scope**:
- Role-based *routing* (§5.1) with one fully built persona: Managing
  Partner. Every other persona's route exists but shows a "coming soon"
  placeholder — the architecture is proven, not every screen.
- Modules shipped at full depth: Dashboard, Clients, Matters (including
  deep detail tabs), Documents (including real local upload/storage/
  versioning), Billing (Invoices, Payments, Expenses, Retainers).
- Modules shipped as real, seeded-data list pages (functional CRUD for
  core create flows, lighter on deep sub-tabs): Calendar, Hearings, Tasks,
  Document Generator, Template Library, Clause Library, Finance, HR
  (Employees only — Attendance/Leaves/Payroll not yet built), Reports,
  Knowledge Base, Settings.
- No authentication; no Client Portal; no AI Assistant; no Companies/
  Contacts as separate entities (folded into Client); no Court Cases as a
  separate entity (litigation fields live directly on Matter); no Audit
  Log (ActivityLog only); no Notifications module (activity feed only).
- Local SQLite-class database; local file storage; zero paid services.

**Explicitly out of scope for MVP**: every other persona's full
experience, Companies/Contacts, Court Cases, Meetings/Notes as
independently addressable modules (present only as Matter/Client tabs),
Research as a distinct module, Attendance/Leaves/Payroll, Analytics
(beyond Reports), Notifications module, Firm Configuration as anything
beyond Settings tabs, Audit Logs, AI Assistant, Client Portal.

### 17.2 Version 1.0 — Full Firm, Every Role, Real Access Control

**Goal**: every persona in §4 has a complete, purpose-built experience,
and the firm can safely open the system to its entire team because access
is properly authenticated and permissioned.

**Adds**:
- **Authentication & authorization**: real login, session management, and
  the full Role → Module permission matrix (§5.4) enforced server-side —
  replacing MVP's route-based-only model. Settings → Users and Permissions
  become live (§6.31).
- **Every persona fully built**: Senior Partner, Partner, Associate,
  Junior Associate, Legal Researcher, Paralegal, Receptionist, Accounts,
  HR, Office Manager, and Administrator each get their tailored dashboard
  and full module access per §4/§5.4.
- **Companies and Contacts** as first-class entities distinct from a flat
  Client record (§6.3, §6.4).
- **Court Cases** as a distinct entity/extension of Matter for litigation
  (§6.6).
- **Meetings, Notes, Research** as independently addressable modules with
  their own list views, not only embedded tabs.
- **HR completed**: Attendance and Leaves fully functional (Payroll
  remains future — §17.4).
- **Notifications module**: the full event-driven notification system
  (§6.30), replacing MVP's activity-feed-only approach.
- **Audit Logs** (§6.33) shipped for compliance readiness.
- **Client Portal v1** (§6.35): Overview, Documents, Messages tabs live;
  Invoices tab view-only (online payment is V2.0/§16).
- **Bulk document upload**; **generate-invoice-from-unbilled-time** flow;
  **Analytics** module beyond fixed Reports charts.
- **Firm Configuration** matures beyond Settings tabs: Court List
  management, jurisdiction-specific validation patterns.

### 17.3 Version 2.0 — Intelligence & Automation

**Goal**: LEXORA stops being only a system of record and becomes a system
that actively helps — through AI and automation — without ever acting
outside a human's explicit permission and confirmation.

**Adds**:
- **AI Assistant Phase 1 & 2** (§14): conversational firm Q&A with
  citations, and AI-assisted drafting grounded in the firm's own Template/
  Clause Library.
- **Workflow Rule Builder** (§15.1) and the highest-value automations from
  §15: automated deadline reminders, auto-generated draft invoices from
  time/expenses, onboarding/offboarding checklists, recurring task
  templates per matter type.
- **Calendar sync, Email integration, E-signature** (§16.1–§16.3) — the
  three integrations with the highest daily-workflow impact.
- **Online invoice payment** in the Client Portal (§16.4).
- **Analytics self-serve builder** (full §6.29 vision: dimension/metric
  picker, saved/shared custom views).
- **Cloud object storage backend option** (§16.8) for firms deploying
  beyond a single local install.

### 17.4 Enterprise Version — Scale, Compliance, and Full Automation

**Goal**: LEXORA is ready for the largest, most complex law firms in the
world — multi-office, multi-practice-group, compliance-intensive, and
fully integrated into the firm's broader technology and identity
ecosystem.

**Adds**:
- **Payroll** (§6.27) — full compensation processing, statutory
  compliance fields configurable per jurisdiction.
- **Multi-entity / multi-office consolidated Finance** (§6.22 Future
  Scope) for firms operating as separate legal entities per
  office/jurisdiction.
- **SSO / Identity provider integration** (§16.9) — SAML/OIDC with the
  firm's existing identity provider.
- **SIEM / compliance export** (§16.10) and configurable Audit Log
  retention tiers.
- **AI Assistant Phase 3** (§14): permission-scoped action execution with
  confirmation-gated writes — the assistant can *do* things, not only
  answer and draft.
- **Predictive deadline risk**, **AI-assisted conflict-check matching**,
  and **natural-language reporting** (§14.8, §14.11, §14.10).
- **White-label Client Portal** (§6.35 Future Scope) — custom domain, full
  theme control, for enterprise clients who require the portal to feel
  entirely like their own vendor surface.
- **Advanced permission modeling**: department/team hierarchy (§6.32
  Future Scope), custom field configuration per Matter/Client type,
  jurisdiction-specific configuration bundles.
- **99.9%+ availability SLA-grade deployment**, full data-residency
  configuration options for firms with jurisdiction-specific data-
  sovereignty requirements.

### 17.5 Roadmap Summary Table

| Capability | MVP | V1.0 | V2.0 | Enterprise |
|---|---|---|---|---|
| Managing Partner full experience | ✅ | ✅ | ✅ | ✅ |
| All 12 other personas, fully built | — | ✅ | ✅ | ✅ |
| Authentication & real permissions | — | ✅ | ✅ | ✅ |
| Companies / Contacts as entities | — | ✅ | ✅ | ✅ |
| Court Cases as distinct entity | — | ✅ | ✅ | ✅ |
| Meetings / Notes / Research as modules | — | ✅ | ✅ | ✅ |
| Attendance / Leaves | — | ✅ | ✅ | ✅ |
| Payroll | — | — | — | ✅ |
| Notifications module | — | ✅ | ✅ | ✅ |
| Audit Logs | — | ✅ | ✅ | ✅ |
| Client Portal | — | ✅ (v1) | ✅ (+ payments) | ✅ (white-label) |
| AI Assistant | — | — | ✅ (Q&A + Drafting) | ✅ (+ Action) |
| Workflow automation builder | — | — | ✅ | ✅ |
| Calendar / Email / E-signature integrations | — | — | ✅ | ✅ |
| Analytics self-serve builder | — | — | ✅ | ✅ |
| SSO / SIEM / multi-entity Finance | — | — | — | ✅ |

---

*End of document. LEXORA PRD is a living document — every module,
workflow, and rule defined here is expected to be revisited as real firm
usage surfaces edge cases this document did not anticipate. Where
implementation and this PRD diverge, that divergence should be resolved by
updating this document, not by letting the two silently drift apart.*

