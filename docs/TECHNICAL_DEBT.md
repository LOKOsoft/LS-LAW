# Technical Debt Register

Every item here was verified against the code this pass (file:line
references throughout) — this is not a speculative list. Organized
Critical → Low by real business/security risk if left unaddressed, each
with Problem / Reason it exists / Impact / Recommendation / Priority /
Estimated effort / Dependencies.

**Update — the three Critical items were fixed in this same pass**, not
left as recommendations only: the user directed "do what is recommended."
Each is marked `FIXED` below with what was actually changed and verified
(typecheck, lint, full unit/integration suite, and a live browser smoke
test against the running dev server). Items #4 onward remain documented
debt, not yet implemented, per the phase's scope (review/standardize
existing work, not build new features).

---

## Critical

### 1. Server Actions with zero server-side authentication — FIXED

**Problem.** `features/matters/actions.ts`, `features/clients/actions.ts`,
`features/clauses/actions.ts`, `features/search/actions.ts`,
`features/templates/actions.ts`, and `features/matter-assistant/actions.ts`
call `requireUser()`/any auth check **zero times** (confirmed via grep).
Real writes — `createClient`, `updateClient`, `archiveClient`,
`restoreClient`, `mergeClients`, `reassignRelationshipManager`, and matter
equivalents — execute for any request that reaches them, authenticated or
not, any role.

**Reason it exists.** The app was built role-first at the *page* layer
(`requireUser(Role.X)` in every `page.tsx`) with the implicit assumption
that Server Actions are only ever invoked from the page that renders their
form. That assumption holds for normal UI use but isn't a security
boundary — Next.js Server Actions are independently-addressable POST
endpoints once their reference is known.

**Impact.** Any authenticated session of any role (or, for the actions
with zero check, potentially an unauthenticated request depending on
Next.js's action-reference exposure) can create/modify/archive/merge
client and matter records, bypassing the role restrictions the UI implies.
`clients/actions.ts` additionally accepts `actorId` as a caller-supplied
parameter for audit attribution rather than deriving it from the session
— the audit trail itself is spoofable at these call sites.

**Fix applied.** Added `requireUser()` (the same real, working guard
already used in `billing`/`settings` actions) to every exported function in
all six files. In `matters/actions.ts` and `clients/actions.ts`, `actorId`
is no longer accepted as a caller-supplied parameter — it's derived from
the authenticated session (`const actor = await requireUser(); const
actorId = actor.id;`), closing the audit-trail spoofing risk too.
`clients/actions.ts`'s `createNote` now derives `authorId` from the session
the same way (the `authorId` field was removed from `createNoteSchema`
entirely, so it can no longer be supplied by the client at all). Updated
every call site across ~30 components and role pages that passed the
now-removed `actorId`/`currentUserId` parameters, including dropping the
prop entirely from components where it became otherwise unused
(`MatterStageControl`, `ClientActionsMenu`, `MergeClientDialog`,
`ArchivedClientsTable`, `EditClientForm`, `ImportClientsView`,
`DuplicateDetectionView`, `AddNoteForm`). Verified: `tsc --noEmit` clean,
`eslint` clean (no new warnings), full unit + integration suite passing
(43 tests), production build succeeds, and a live browser smoke test
(login → advance a matter's stage → add a note → attempt to archive a
client with active matters) confirmed all three flows still work
end-to-end with the session-derived identity.

**Not done in this pass:** granular per-role authorization (e.g.
`withPermission()`'s module/action-level checks) — the fix applied is
"require a valid session," not "require a specific role." That's a
smaller, separate follow-up (assign the right `PermissionCheck` per
action) tracked as new item below.

**Priority.** Critical — **FIXED**.
**Follow-up remaining:** wire role-specific `withPermission()` checks on
top of the now-universal session check, where a role restriction is
actually warranted (e.g. only Managing Partner/Senior Partner should
merge or bulk-import clients). Small effort, no dependencies.

---

### 2. Unauthenticated file-serving route — FIXED (session check); ownership scoping still open

**Problem.** `app/api/storage/[...path]/route.ts` had no session/auth
check at all. Any request that knew or guessed a storage path received
the file — including another matter's or client's documents.

**Reason it exists.** Path-traversal protection (`path.join` +
`startsWith(STORAGE_ROOT)`) was correctly built, but an authorization
check on *who* may read a given file was not added alongside it.

**Fix applied.** Added the same `getSessionUser()` check used by
`app/api/upload/route.ts`, returning `401` for any unauthenticated
request, before the file is read or served. Verified via `tsc`/build/test
suite and confirmed the route still serves files correctly for an
authenticated session in the browser smoke test.

**Not done in this pass — real remaining gap.** The fix closes "anyone,
authenticated or not" down to "any authenticated user, any role" — it does
not add per-matter/per-client ownership scoping (checking that the
requesting user's role/assignment actually permits access to *this
specific* file). That requires joining the storage path back to a
`DocumentFile` record and checking scope, which is a larger, separate
change with real risk of breaking legitimate cross-role access patterns
(e.g. a partner viewing a document on a matter they're not directly
assigned to) — needs a product decision on the intended access model
before implementing, not a mechanical fix like the session check was.

**Priority.** Critical for the session check — **FIXED**. Ownership
scoping downgraded to **Medium**, tracked as a new item below.
**Dependencies.** Ownership scoping depends on a product decision about
cross-role document visibility rules.

---

### 3. Mobile/tablet navigation is completely hidden — FIXED

**Problem.** `components/layout/sidebar.tsx`'s nav was `hidden ...
lg:flex` — invisible below 1024px, with no off-canvas/hamburger
replacement anywhere.

**Reason it exists.** The sidebar was built desktop-first; a mobile
breakpoint hook (`hooks/use-media-query.ts`'s `useIsMobile`) had been
scaffolded in anticipation of a follow-up that never landed.

**Fix applied.** Extracted the nav-section rendering out of `Sidebar`
into a new shared `SidebarNav` component
(`components/layout/sidebar-nav.tsx`), so the desktop sidebar and a new
mobile nav can never drift out of sync. Added a hamburger button to
`Topbar`, visible only below the `lg` breakpoint (pure CSS, matching the
same responsive pattern the desktop sidebar already used — no JS-computed
boolean needed, so `useIsMobile` wasn't actually required for this
specific fix and remains available for cases that need a JS-side
conditional rather than just show/hide), that opens a `Sheet` containing
`SidebarNav`. Each nav link closes the sheet on click. Verified via a live
browser smoke test at a 390×844 viewport: hamburger renders, sheet opens
with all nav sections, clicking a link navigates and closes the sheet,
zero console errors.

**Priority.** Critical — **FIXED**.
**Dependencies.** None.

---

## High

### 4. `TimeEntry` has no mutation surface

**Problem.** No `actions.ts` exists for `TimeEntry` anywhere in
`src/features/`. There is no code path to create outside the invoice-
generation flow, or to edit/delete a time entry — invoiced or not.

**Reason it exists.** Time entries were modeled and consumed by billing/
reporting/dashboard queries, but a dedicated CRUD action set was never
built — likely deprioritized behind the higher-visibility invoice-
generation flow that consumes them.

**Impact.** No enforcement point exists for the real billing rule "an
invoiced time entry shouldn't be editable," because no editing exists at
all — a missing feature, not a broken guard. Firms will need this for
basic day-to-day correction of billing mistakes (wrong duration, wrong
matter).

**Recommendation.** Build `features/timeline/` or a new
`features/time-entries/actions.ts` with create/update/delete, each
checking `invoiced === false` before allowing edits.

**Priority.** High.
**Estimated effort.** Medium (3–5 days).
**Dependencies.** Should land alongside item #1 (auth wiring), since this
is new mutation surface that should be built with the auth check in from
the start, not retrofitted.

---

### 5. `mergeClients` and the active-matter guard — re-examined, not actually a bug

**Original finding (from the parallel research pass) claimed:**
`mergeClients` force-archives the duplicate client with no check for
active matters, unlike `archiveClient`.

**Corrected on closer reading while fixing item #1 (which touched this
exact function).** `mergeClients`' transaction reassigns *every* related
record — including all of the duplicate's matters, regardless of status —
to the primary client's id *before* archiving the duplicate. By the time
the archive step runs, the duplicate genuinely has zero matters left
(they've all been moved, not discarded). This is the correct, intended
semantics for a merge (consolidate everything onto the surviving record),
which is different from a plain archive (hide a client, leaving its
matters as-is) — so `mergeClients` correctly does *not* need
`assertClientHasNoActiveMatters`; applying that guard would incorrectly
block the exact scenario merge exists for (consolidating a duplicate that
has active matters).

**No fix applied — none needed.** Recorded here so the original finding
doesn't get treated as outstanding debt by a future reader; verified
directly against `clients/actions.ts`'s transaction contents, not
re-assumed from the original research pass.

**Priority.** N/A — not a defect.

---

### 6. `Invoice.VOID` is a defined-but-unreachable state

**Problem.** `recordPayment` checks and blocks payment on `VOID` invoices,
but no action anywhere ever sets an invoice to `VOID`. No void/credit-note
workflow exists.

**Reason it exists.** The enum was modeled ahead of the feature that would
use it; the void/credit-note action itself was never built.

**Impact.** Firms have no way to void an incorrectly-generated invoice
through the app — a real, expected billing operation for any law firm.

**Recommendation.** Build a `voidInvoice` action (role-gated, logged to
`ActivityLog`), and decide whether voiding an invoice should reverse its
`TimeEntry.invoiced` flags back to `false` (a real product decision, not
just an implementation detail).

**Priority.** High.
**Estimated effort.** Medium (2–3 days plus a product decision).
**Dependencies.** Item #4 (`TimeEntry` mutation surface) if voiding should
un-invoice time entries.

---

### 7. `recordPayment` doesn't validate against remaining balance

**Problem.** `billing/schema.ts`'s `recordPaymentSchema` only enforces
`amount > 0` — a payment larger than `invoice.total - amountPaid` is
silently accepted with no overpayment/credit-balance handling.

**Reason it exists.** The schema validates shape, not business-rule
bounds; the balance check was never added.

**Impact.** Overpayments are recorded without any reconciliation trail —
a real problem for firms doing trust accounting, where every cent must be
accounted for.

**Recommendation.** Add a check in `recordPayment` (not just the Zod
schema, which can't see the invoice's current balance) rejecting or
explicitly flagging payments that exceed the outstanding balance.

**Priority.** High.
**Estimated effort.** Small (1 day).
**Dependencies.** None.

---

### 8. `CourtCase` model has no mutation surface / is decoupled from Hearings

**Problem.** `CourtCase` has only `queries.ts`, no `actions.ts` — nothing
ever writes `CourtCase.stage`/`nextHearingDate`/`filingDate`, even though
`Hearing` actions correctly cascade into `Matter.stage` updates.

**Reason it exists.** `CourtCase` was likely modeled for a future
court-integration feature that hasn't been built yet, while the
Hearing→Matter cascade was built as part of the workflow-engine pass.

**Impact.** `CourtCase` records go stale the moment they're created —
there's no way to keep them in sync with what's actually happening in the
matter, undermining their value as a source of truth.

**Recommendation.** Either build `CourtCase` actions with the same
cascade discipline `Hearing` has, or (if court-case tracking isn't a
near-term priority) document it explicitly as inert/placeholder the way
`lib/platform/` scaffolding is documented, so it isn't mistaken for a
working feature.

**Priority.** High.
**Estimated effort.** Medium (3–4 days) if building it out; Small (a doc
update) if deprioritizing it explicitly.
**Dependencies.** Product decision on whether court-case tracking is a
near-term priority.

---

### 9. Matters can be archived from any stage with only a hearings guard

**Problem.** `advanceMatterStage`'s `ARCHIVE` transition is reachable from
any stage (by design, "a matter can be shelved at any point") but the only
guard checked is `assertMatterHasNoPendingHearings` — open `Task`s and
unbilled `TimeEntry` records are not checked.

**Reason it exists.** The hearings guard was added as the first
identified real-world blocker; task and time-entry guards weren't added
alongside it.

**Impact.** A matter can be archived with open tasks nobody will see
again, or unbilled time that will never be captured on an invoice.

**Recommendation.** Add `assertMatterHasNoOpenTasks` and a soft warning
(not necessarily a hard block, depending on the firm's workflow
preference) for unbilled time before allowing `ARCHIVE`.

**Priority.** High.
**Estimated effort.** Small (1–2 days).
**Dependencies.** None.

---

## Medium

### 10. Prompt registry claims versioning it doesn't enforce

**Problem.** `PromptRegistry` is a flat `Map` keyed by `id` alone;
registering a template under an existing `id` silently overwrites it,
despite `PromptTemplate.version`'s doc comment promising old versions are
kept.

**Recommendation.** Key the registry by `(id, version)`, add a
"latest-for-id" lookup on top.

**Priority.** Medium. **Estimated effort.** Small (1 day).
**Dependencies.** None.

---

### 11. Three N+1 query patterns

**Problem.** `dashboard/queries.ts`'s `getTeamUtilization()` and
`reports/queries.ts`'s `getReportsData()` issue one aggregate query per
entity inside a `.map()` instead of a single `groupBy`.
`risk/queries.ts`'s `getFirmWideRisks()` is a genuine unbatched N×7-query
loop, but confirmed unused by any live page today.

**Recommendation.** Convert the two live call sites to `groupBy`; either
fix or explicitly remove the dead `getFirmWideRisks()` before it's ever
wired up.

**Priority.** Medium. **Estimated effort.** Small (1–2 days total).
**Dependencies.** None.

---

### 12. Unbounded pagination on 6 query paths

**Problem.** `billing/queries.ts`'s `getInvoices`, `getPayments`,
`getExpenses`, `getRetainers`, `getUnbilledTimeByMatter`, and
`documents/queries.ts`'s `getDocuments`/`tasks/queries.ts`'s `getTasks`
fetch entire tables with no `take`/`skip`.

**Recommendation.** Add standard pagination params, matching the pattern
already used in `activity`/`audit-logs`/`notifications` queries.

**Priority.** Medium. **Estimated effort.** Small (1–2 days).
**Dependencies.** None.

---

### 13. 7 chart components ship un-lazy-loaded

**Problem.** `recharts` is imported directly (no `next/dynamic`) in 7
components, shipping the full chart bundle to every page that renders
one.

**Recommendation.** Wrap each in `next/dynamic`, matching the existing
pattern already used for `document-preview-drawer.tsx`'s PDF viewer.

**Priority.** Medium. **Estimated effort.** Small (1 day).
**Dependencies.** None.

---

### 14. Input validation missing on 5 of 16 action files

**Problem.** `matters`, `clauses`, `search`, `templates`, and
`matter-assistant` actions have no Zod `.parse`/`.safeParse` call at all.

**Recommendation.** Add request schemas matching the pattern already used
in `clients`/`billing`/`documents`/`hearings` actions.

**Priority.** Medium. **Estimated effort.** Medium (2–3 days across 5
files). **Dependencies.** Natural to bundle with item #1 (auth wiring) —
touching these files once for both concerns is more efficient than twice.

---

### 15. `proxy.ts` protected-route list is incomplete

**Problem.** `PROTECTED_PREFIXES` omits `partner`, `junior-associate`,
`legal-researcher`, and `administrator` — those four role trees get no
edge-level cookie-presence pre-check (pages still self-protect via
`requireUser()`, so this is a defense-in-depth gap, not a live hole).

**Recommendation.** Add the missing four prefixes for consistency with
the other nine.

**Priority.** Medium. **Estimated effort.** Trivial (minutes).
**Dependencies.** None.

---

## Low

### 16. Thin per-role page-wrapper duplication

**Problem.** ~9 near-identical `page.tsx` files per role-scoped module
(21–24 lines each, varying only in `Role` and a base-path constant).

**Recommendation.** Leave as-is unless a concrete pain point (e.g. a 14th
role) emerges — a catch-all `[role]` route would trade explicit,
grep-able routes for a single dynamic dispatcher, a real cost with no
current benefit.

**Priority.** Low (tracked, not scheduled). **Estimated effort.** N/A —
deliberately deferred. **Dependencies.** None.

---

### 17. `global-search.tsx` doesn't use the shared debounce hook

**Problem.** Manual `setTimeout(..., 200)` instead of
`hooks/use-debounced-value.ts`, which exists and is used by exactly one
other component.

**Recommendation.** Converge on the shared hook for consistency; no
behavior change, pure maintainability.

**Priority.** Low. **Estimated effort.** Trivial. **Dependencies.** None.

---

### 18. `ResearchNote` one-note-per-user-per-article constraint

**Problem.** `@@unique([userId, articleId])` may be an overly strict
business rule if users legitimately want multiple notes on the same
article — needs product confirmation, not assumed to be wrong.

**Recommendation.** Confirm intent with the product owner; only change
the schema if the answer is "yes, multiple notes should be allowed."

**Priority.** Low. **Estimated effort.** N/A pending decision.
**Dependencies.** Product decision.

---

### 19. `deleteResearchNote` action has no UI entry point

**Problem.** The Server Action exists and works; no button anywhere calls
it.

**Recommendation.** Add a delete affordance to the research notes list
UI, behind `ConfirmDialog` per the established pattern.

**Priority.** Low. **Estimated effort.** Small (few hours).
**Dependencies.** None.

---

### 20. Role-specific `withPermission()` checks on top of the new session checks — FIXED

**Problem.** Item #1's fix requires *a* valid session on the six
previously-unprotected action files, but doesn't yet restrict *which*
role may call each one (e.g. today any authenticated role can merge or
bulk-import clients, not just Managing Partner/Senior Partner).

**Fix applied.** Wrapped every exported action in `features/{matters,
clients,clauses,templates,matter-assistant}/actions.ts` with the
already-built `withPermission()` guard (`src/lib/platform/auth/guards.ts`),
each given a `PermissionCheck` read directly off the existing F/C/V/—
matrix in `permission-matrix.ts` (the same data Settings already renders,
so enforcement now matches what the UI claims):

- `matters`: `createMatter`/`advanceMatterStage`/`closeMatter`/
  `archiveMatter` all gated at `{matters, create}` — close/archive are the
  same stage-transition machinery as advance, just a convenience wrapper,
  so they get the same tier rather than an invented stricter one.
- `clients`: `checkSimilarClientNames` at `{clients, view}` (read-only);
  `createClient`/`updateClient`/`reassignRelationshipManager`/
  `archiveClient`/`restoreClient` at `{clients, create}`; `mergeClients`/
  `bulkImportClients` at `{clients, full}` — the matrix gives `full` (F) on
  Clients to Managing Partner only, so these two resolve to MP-only, not
  "MP or SP" as this item's own original wording loosely suggested. If
  Senior Partner should also merge/bulk-import, that's a one-cell change
  to `permission-matrix.ts` (bump Senior Partner's Clients cell from `C`
  to `F`), not a code change — a product decision, not made here.
  `createNote` moved to `{notes, create}` instead of `{clients, create}`
  since it's conceptually a Notes-module write, and the matrix's Notes row
  has different role cutoffs than Clients.
- `clauses`/`templates`: `toggleClauseFavorite`/`recordClauseUsage`/
  `toggleTemplateFavorite` at `{clause-library, view}` /
  `{template-library, view}` — personal, low-risk actions; `view` mainly
  defense-in-depth (blocks the roles with zero Template/Clause Library
  access, e.g. Reception/Accounts/HR).
- `matter-assistant`: `generateMatterSummary`/`generateMeetingBrief` at a
  new synthetic `matter-assistant` permission key (see below) mapped to
  the matrix's existing "AI Assistant" row, `view` tier.
- `search`'s `globalSearch` deliberately **not** wrapped — it aggregates
  across nine entity types with no single matching `moduleKey`, and
  correctly gating it needs per-result-type scoping (filter each result
  category by that category's own module permission), which is a bigger,
  separate change. Left session-only (already covered by item #1);
  documented as new item #22 below instead of forcing it onto one
  arbitrary moduleKey.

**Supporting change — synthetic `matter-assistant` permission key.**
`ModuleKey` (nav.ts) is nav-route-backed and has no entry for the Matter
Assistant panel (it's embedded in the matter detail page, not its own
route), but the permission matrix has a real "AI Assistant" row. Rather
than add a fake nav entry to make it fit, `PermissionCheck.moduleKey`'s
type was widened to `PermissionModuleKey = ModuleKey | "matter-assistant"`
(`src/lib/platform/auth/types.ts`), with the matching matrix-label mapping
added in `permission-service.ts`. `ModuleKey` itself and `nav.ts` are
unchanged.

**Also fixed in the same pass, same file, same theme (audit-trail
integrity — item #1's exact concern):** `clients/actions.ts`'s
`createClient` logged `activityLog.actorId` as the caller-supplied
`relationshipManagerId` rather than the authenticated actor — a
client-facing form field being used as the audit "who did this" value, so
a caller could attribute a client-creation event to any user id by
picking them as relationship manager. Item #1's original fix pass missed
this one call site (every other action in the file already derived
`actorId` from `requireUser()`). Now derives `actorId: actor.id` like the
rest of the file.

**Verified.** `npx tsc --noEmit`, `eslint`, full unit + integration suite
(43 unit + 2 integration, including two new permission-service cases
covering the `clients`/`matter-assistant` gates specifically), a
production build, and a live Playwright smoke test against the running
dev server (Managing Partner: create a client through the real form,
view the Matters list) — both still succeed with the new gates in place,
confirming no regression on the legitimate path.

**Priority.** High — **FIXED**.
**Dependencies.** None.

---

### 21. Storage route ownership/scope check

**Problem.** Item #2's fix requires *a* valid session to read any file,
but doesn't yet check that the requesting user's role/assignment permits
access to *that specific* matter's/client's documents.

**Recommendation.** Join the requested storage path back to its
`DocumentFile` record and check scope before serving, once the intended
cross-role document-visibility rules are confirmed with the product
owner.

**Priority.** Medium.
**Estimated effort.** Medium (2–3 days).
**Dependencies.** Product decision on cross-role document visibility.

---

### 22. `globalSearch` returns results across modules the caller may not have access to

**Problem.** `search/actions.ts`'s `globalSearch` is session-gated (item
#1) but not role-gated: it queries and returns matches across clients,
matters, documents, hearings, invoices, tasks, notes, employees, and
companies regardless of whether the caller's role has any matrix access
to that entity type — e.g. a role with `—` (no access) on
Billing/Invoices could still find an invoice number through search.

**Reason it exists.** Global search predates the permission-matrix
enforcement work; no single `moduleKey` covers a cross-entity aggregate
query, so it couldn't be wrapped in `withPermission()` the way the other
five files were (item #20).

**Recommendation.** Filter each result category by that category's own
`moduleKey` access (e.g. skip the `invoices` query/result entirely if
`permissionService.accessLevel(user, "billing") === "—"`), rather than
gating the whole function behind one key.

**Priority.** Medium. **Estimated effort.** Small (1 day — one
`permissionService.accessLevel()` check per result category).
**Dependencies.** None.

---

## Elimination roadmap

1. **Done, an earlier pass:** items #1–#3 (Critical) — session-level auth
   wiring on the six action files, the storage route, and mobile
   navigation. Fixed, verified (typecheck, lint, full test suite,
   production build, live browser smoke test), no regressions found.
2. **Done, this pass:** item #20 — role-specific `withPermission()` checks
   layered on top of item #1's session checks, across all five action
   files that have a natural matrix `moduleKey` mapping. Fixed, verified
   (typecheck, lint, full test suite plus two new permission-service unit
   cases, production build, live Playwright smoke test). Surfaced two new
   items in the process: #22 (`globalSearch` needs per-result-type
   scoping instead of one `moduleKey`, since it has none) and a
   `createClient` audit-attribution bug fixed inline (documented under
   item #20, not its own numbered item, since it was a one-line fix to
   the exact concern item #1 already covers).
3. **Immediate next:** item #21 — storage-route ownership scoping. Still
   blocked on a product decision about cross-role document visibility,
   not a code question.
4. **Next sprint:** items #4–#9 (High) — billing/matter lifecycle
   completeness gaps. Sequence #4 (TimeEntry CRUD) before #6 (void
   invoice) since voiding may need to un-invoice time entries.
5. **Following sprint:** items #10–#15, #22 (Medium) — mostly small,
   mechanical fixes.
6. **Opportunistic/backlog:** items #16–#19 (Low) — no urgency, pick up
   when touching adjacent code anyway.

No item on this register requires a rewrite or architectural change —
every fix applies a pattern, guard, or hook that already exists elsewhere
in the codebase. This is the practical upside of the architecture holding
up under review: the debt is real, but it's all wiring debt, not design
debt — and four of the highest-priority items have now been closed across
these two passes as proof of that.
