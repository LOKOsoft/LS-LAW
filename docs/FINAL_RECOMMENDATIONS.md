# Final Recommendations

A single, prioritized action sequence across every finding in this
enterprise review — `docs/ENTERPRISE_REVIEW.md`,
`docs/TECHNICAL_DEBT.md`, and the seven category reviews. Three Critical
items were already fixed in this same pass (see below); this document
sequences what's left.

## Already done, this pass

1. **46 missing database indexes** added on foreign-key columns across 24
   models, migrated and verified. See `docs/DATABASE_REVIEW.md`.
2. **Six Server Actions with zero authentication** (`matters`, `clients`,
   `clauses`, `search`, `templates`, `matter-assistant`) now require a
   valid session; caller-supplied `actorId`/`authorId` parameters replaced
   with session-derived identity. See `docs/TECHNICAL_DEBT.md` item #1.
3. **Unauthenticated file-serving route** now requires a valid session.
   See `docs/TECHNICAL_DEBT.md` item #2.
4. **Mobile/tablet navigation** — a shared off-canvas nav now works on
   every role layout below the 1024px breakpoint. See
   `docs/TECHNICAL_DEBT.md` item #3.

All four were verified via `tsc --noEmit`, `eslint`, the full unit +
integration suite (43 tests), a production build, and live browser smoke
tests of the affected flows — not just static analysis.

## Immediate next (days, not weeks)

**5. Role-specific permission checks** (debt #20). The session checks
just added answer "is anyone logged in?" — they don't yet answer "is this
the right role for this action?" (e.g. today any authenticated role can
merge or bulk-import clients). Assign the appropriate `PermissionCheck`
via the already-built `withPermission()` guard, action by action. Small–
medium effort, no architecture change.

**6. Storage route ownership scoping** (debt #21). The session check
just added answers "is anyone logged in?" — it doesn't yet check that the
requesting user's role/assignment permits access to *that specific*
matter's or client's documents. Needs a product decision on the intended
cross-role document-visibility model before implementing (e.g. can a
Partner view a document on a matter they're not assigned to?).

**7. `proxy.ts`'s incomplete protected-route list** (debt #15) — trivial,
adds the four missing role prefixes (`partner`, `junior-associate`,
`legal-researcher`, `administrator`) for consistency with the other nine.
Defense-in-depth only (pages already self-protect via `requireUser()`),
but a five-minute fix with no reason to leave it inconsistent.

## Next sprint

**8. Billing lifecycle completeness** (debt #6, #7, #9): no invoice-void
workflow despite a `VOID` enum state that nothing ever sets; no balance
check on `recordPayment` (overpayments silently accepted); matters can be
archived with open tasks (only hearings are checked). These are the gaps
most likely to surface as a real complaint from an actual firm using this
as its billing system of record.

**9. `TimeEntry` mutation surface** (debt #4): no CRUD exists for time
entries at all today — a genuine missing feature, not a broken guard.
Build this before #6 (void invoice), since voiding may need to reverse a
`TimeEntry.invoiced` flag.

**10. `CourtCase` staleness** (debt #8): either build real actions with
the same cascade discipline `Hearing` already has, or explicitly document
it as inert placeholder data so it isn't mistaken for a live feature.

## Following sprint — mechanical, low-risk cleanups

**11. Performance**: convert 2 live N+1 patterns to `groupBy`
(dashboard/reports queries), add `take`/`skip` to 6 unbounded query
functions, wrap 7 chart components in `next/dynamic` (debt #11–#13).

**12. Input validation**: add Zod schemas to the 5 action files that
still trust raw arguments with no runtime validation — `matters`,
`clauses`, `search`, `templates`, `matter-assistant` (debt #14). Natural
to bundle with the role-specific permission work above since both touch
the same files.

**13. AI prompt registry**: fix the flat `Map` keyed by `id` alone so
versioning is actually enforced, not just claimed in a doc comment (debt
#10).

## Opportunistic backlog

Breadcrumbs (built, never rendered), the shared debounce hook (used in
one place, not `global-search.tsx`), a delete affordance for research
notes (action exists, no UI calls it), and the `ResearchNote`
one-note-per-article constraint (needs a product confirmation, not
assumed wrong) — debt #16–#19. No urgency; pick up when touching adjacent
code.

## What this review deliberately did not do

Did not build real multi-tenancy, did not migrate off SQLite, did not add
a CI pipeline, did not implement per-tenant custom roles, did not connect
a real cloud AI/payment/storage provider. Each has a documented,
low-friction path (`docs/FUTURE_INTEGRATIONS.md`,
`docs/ARCHITECTURE_DECISIONS.md`) for when — and only when — a real
requirement justifies the investment. Building any of these speculatively
would have been the same mistake this whole review was designed to catch:
adding architecture ahead of a genuine need.

## The single most important takeaway

Every fix applied in this pass — the two Critical security gaps and the
mobile navigation gap — was wiring an existing pattern (a guard function,
a hook, a shared component) into a place it hadn't reached yet, not
inventing new architecture under time pressure. That is also true of
nearly everything still open in `docs/TECHNICAL_DEBT.md`. The codebase's
foundations (architecture, database, AI provider design) are sound; what
remains is completing the wiring, not redesigning anything.
