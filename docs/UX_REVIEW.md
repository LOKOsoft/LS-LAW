# UX Review

Fresh pass, re-verified against the code (not the prior accessibility
pass's assumptions). One significant new finding this pass: mobile
navigation is effectively broken across the entire app.

## Mobile/responsive navigation — the top finding, fixed this pass

`components/layout/sidebar.tsx`'s primary nav was `hidden ... lg:flex` —
completely hidden below the 1024px breakpoint, with no off-canvas/
hamburger replacement anywhere in `topbar.tsx` or `sidebar.tsx`. Net
effect: every one of the 12+ staff role layouts had zero primary
navigation on tablet or phone widths — a real, shipped gap, not a
cosmetic one.

**Fixed in this same pass.** Extracted the nav-section rendering into a
shared `components/layout/sidebar-nav.tsx`, used by both the desktop
sidebar and a new hamburger-triggered `Sheet` in `topbar.tsx` (visible
only below `lg`, via the same CSS-breakpoint pattern the desktop sidebar
already used). Verified with a live browser smoke test at a 390×844
viewport: the hamburger renders, the sheet opens with every nav section,
clicking a link navigates and closes the sheet, and zero console errors
were logged throughout. See `docs/TECHNICAL_DEBT.md` item #3, now marked
fixed.

## Loading/empty/error states

`app/loading.tsx` and `app/error.tsx` are the *only* loading/error
boundaries in the app — zero nested `loading.tsx`/`error.tsx` files and
zero `<Suspense>` usage across all 256 role page routes, so a slow nested
data fetch shows no skeleton, just a blank wait. `EmptyState` (a real,
well-built shared component) is used in only 5 places, all under the
Client Portal — none of the ~250 staff-facing pages use it, meaning
zero-data tables/lists likely render as bare empty tables with no
guidance. Both are real, bounded follow-ups (add `loading.tsx` per major
route group; wire `EmptyState` into list/table components as each is
touched) rather than a redesign.

## Destructive action confirmation

Confirmed dialog coverage is good where it exists — `client-actions-menu.tsx`,
`matter-stage-control.tsx`, and `court-list-manager.tsx` all correctly
gate their destructive action behind `ConfirmDialog`. One adjacent gap
found: `deleteResearchNote` (`features/research/actions.ts`) exists as a
Server Action but has **zero callers anywhere in the UI** — there's no
delete button wired to it at all, so users can't delete a research note
through any screen. Not a missing-confirmation issue; a missing UI entry
point for an already-built action.

## Form consistency

Sampled 5 major forms (matter, task, client, invoice, hearing creation):
all consistently use react-hook-form + zodResolver, field-level
`FormMessage` errors, toast feedback, and disable submit while pending —
this pattern is genuinely solid and uniform across the app. One
inconsistency: create-forms swallow server error detail behind a generic
"Could not create X" toast, while `matter-stage-control.tsx` surfaces the
real `error.message` from the server action. Minor — worth converging on
showing the real message everywhere, since the backend already produces
useful `BusinessRuleError` messages that create-forms currently discard.

## Table UX

16 components correctly use the shared `DataTable`/`DataTableToolbar`.
One legitimate outlier: `settings-tabs.tsx`'s permissions matrix uses a
bespoke raw `<table>` — acceptable, since it's a small static role×module
grid with no sort/filter/pagination need, not a case of the shared
component being skipped for no reason.

## Breadcrumbs — confirmed still unused

`useBreadcrumbs` (`hooks/use-breadcrumbs.ts`) has zero call sites anywhere
in the app — fully built, never rendered. Same finding as the prior pass;
re-confirmed rather than assumed. Bounded, scoped follow-up
(`docs/VERSION_1_ROADMAP.md`).

## Keyboard/focus management

No issues found. Every interactive menu/combobox/dialog in the app is
built on Radix primitives (`Popover`/`Command`/`DropdownMenu`/`Dialog`),
which handle focus trapping and keyboard navigation correctly by
construction. No custom, non-Radix modal or menu implementation exists
that could have skipped this.

## Score

**86/100** — up from an initial 71 this pass (before the mobile-nav fix
below was applied), and above the prior release's 82. The mobile-
navigation gap this review found was real and high-impact, and unlike
most findings in this enterprise review it was fixed in the same pass
rather than left as a recommendation — see "Mobile/responsive navigation"
above and `docs/TECHNICAL_DEBT.md` item #3, now marked fixed. Held below
95 by the smaller, lower-priority findings that remain open: unused
breadcrumbs hook, generic error messages on create forms, no delete UI for
research notes, sparse `EmptyState`/loading-boundary coverage outside the
Client Portal. See `docs/TECHNICAL_DEBT.md`'s Low-priority items and
`docs/FINAL_RECOMMENDATIONS.md` for sequencing.
