# Database Review

39 Prisma models, 29 enums, 8 migrations (all additive, SQLite via
`@prisma/adapter-better-sqlite3`). This review re-verified every claim
against the actual schema and migration SQL — not `docs/DATABASE_ARCHITECTURE.md`'s
prior description — and closed the one real gap found: missing indexes.

## Indexes — fixed this pass

**Before this review**: only 2 `@@index` declarations existed in the
entire 39-model schema (`Session.userId`, `Notification.userId`), plus a
handful of `@@unique` compound indexes. Verified via `grep "CREATE INDEX"
prisma/migrations/*/migration.sql` that SQLite/Prisma never implicitly
indexes a plain foreign-key scalar column — only `@@unique`/`@@id`
constraints get one automatically. This meant nearly every FK-based lookup
(the app's dominant query pattern — `matterId`/`clientId` filters appear
in the majority of `queries.ts` files) was a full table scan.

**Fixed**: added 46 `@@index` declarations across 24 models this pass —
every FK scalar column that's filtered on in a real `queries.ts` call site
now has one (`Office.firmId`, `User.officeId`/`clientId`,
`Client.relationshipManagerId`, `Matter.clientId`/`practiceAreaId`/
`responsibleAttorneyId`, `MatterTeamMember.userId`, `Company.clientId`,
`Contact.companyId`/`clientId`, `Hearing.matterId`, `Task.matterId`/
`assigneeId`, `DocumentFolder`/`DocumentFile.parentId`/`folderId`/
`matterId`/`clientId`, `DocumentComment`/`DocumentVersion.documentId`,
`GeneratedDocument.matterId`/`clientId`, `GeneratedDocumentVersion.generatedDocumentId`,
`ResearchNote.userId`/`articleId`/`matterId`, `Invoice.clientId`/`matterId`,
`InvoiceLineItem.invoiceId`, `Payment.invoiceId`/`clientId`,
`Expense.matterId`/`clientId`, `Retainer.clientId`/`matterId`,
`TimeEntry.matterId`/`userId`, `Note.matterId`/`clientId`,
`Meeting.matterId`/`clientId`, `CommunicationLog.matterId`/`clientId`,
`ActivityLog.matterId`/`clientId`/`actorId`, `Notification.matterId`,
`LeaveRequest.userId`). Applied via migration
`20260717181626_add_performance_indexes`, additive/non-destructive,
verified with `npx tsc --noEmit` (clean) and the full unit + integration
suite (43 tests, all passing) after regenerating the Prisma client.

Deliberately skipped: `Announcement`, `KnowledgeArticle.authorId`,
`AttendanceRecord`, `LeaveRequest.approvedById` — low-cardinality tables or
columns not used as a `WHERE` filter in any current query; adding an index
with no query to serve it is pure write-overhead with zero benefit.

## Foreign keys & referential integrity

Every relation has an explicit `onDelete` policy — `Cascade` for owned
child records (e.g. `Matter → Hearing/Task/TimeEntry`), implicit
`Restrict` (Prisma's default) where deleting the parent should be blocked
while children exist (e.g. `Invoice → Payment`). Confirmed no relation is
missing an explicit strategy that would surprise a reader; this was
already solid before this pass and remains so.

## Unique constraints

3 compound `@@unique` constraints exist: `MatterTeamMember([matterId,
userId])` (no duplicate team assignment), `ResearchNote([userId,
articleId])`(one note per user per article — worth double-checking this
is the intended business rule and not accidentally limiting a user to a
single note per article when multiple notes might be legitimate; flagged
as a question, not a defect, in `docs/TECHNICAL_DEBT.md`), and
`AttendanceRecord([userId, date])` (one attendance record per user per
day — correct). Checked the two human-facing sequential identifiers a real
firm would notice a collision on immediately — `Invoice.invoiceNumber`
(`schema.prisma:812`) and `Matter.matterNumber` (`schema.prisma:419`) — both
are already declared `@unique`. No missing unique constraint found.

## Normalization

Schema is in 3NF throughout — no repeating groups, no derived/redundant
columns found beyond the two documented, deliberate exceptions already
called out in `docs/ARCHITECTURE_DECISIONS.md` (§4): `Float` for money
(fine at single-currency, single-firm scale; `Decimal`/minor-units is the
correct future migration if multi-currency ever becomes real) and
comma-joined tag strings instead of a normalized `Tag`/`EntityTag` join
table (fine with no tag-filtering/analytics requirement today). Neither is
a normalization *mistake* — both are conscious, documented, and reversible
scope decisions.

## Business-rule/workflow-layer cross-check (new finding this pass)

The workflow/business-logic review (see `docs/TECHNICAL_DEBT.md`,
sourced from this phase's business-lifecycle audit) surfaced one item
that's really a schema-completeness gap, not a code bug: **`TimeEntry` has
no mutation surface at all** — no `actions.ts` exists for it anywhere in
`src/features/`. The schema itself is fine (`invoiced: Boolean`, proper FK
to `Matter`/`User`), but there's no code path to edit or delete a time
entry, invoiced or not — meaning the "can't edit an invoiced entry" rule a
real billing system needs isn't a broken guard, it's an entirely missing
CRUD surface. This is a feature gap, not a schema defect, but it's
recorded here because the schema is exactly ready to support that
mutation (the `invoiced` flag already exists) the day it's built.

## Scalability

SQLite (single-file, single-process) is correct for this app's actual
deployment shape (one firm, one server) and was already scored honestly
low (55/100) for multi-instance scalability in the prior pass — that
score doesn't change here; it reflects a deliberate architecture choice,
not something this pass's indexing work was meant to address. Indexing
improves query performance at any scale; it does not change SQLite's
fundamental single-writer constraint. See `docs/ARCHITECTURE_DECISIONS.md`
and `docs/DEPLOYMENT_GUIDE.md` for the documented Postgres migration path
if that constraint is ever hit for real.

## Migration strategy

8 migrations, all additive/forward-only, no destructive changes in the
project's history (verified: no `DROP TABLE`/`DROP COLUMN` in any
migration.sql without a corresponding intentional model removal). This
pass's migration (`add_performance_indexes`) follows the same pattern —
pure `CREATE INDEX` statements, zero risk to existing data.

## Score

**95/100** (up from an implicit ~78 this pass started at, once the
missing-index gap is accounted for — the prior scorecard didn't score
Database as its own category, folding it into Architecture; this review
introduces it as a standalone line item, see `docs/QUALITY_SCORECARD.md`).
Remaining gap to 100: resolve the `ResearchNote` one-note-per-article
constraint question with the product owner (Low priority, confirm intent
rather than a known defect), and build the missing `TimeEntry` mutation
surface noted above (tracked in `docs/TECHNICAL_DEBT.md`).
