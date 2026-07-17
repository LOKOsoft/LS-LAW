# UI Guidelines

Design-system rules this codebase actually enforces, several of them
hardened into fixes during this release after real WCAG AA violations were
found via `tests/accessibility/`. Follow these for any new UI — they're
not aspirational.

## Color & contrast

- **Never render a database-stored/user-configurable color as text
  color.** `PracticeArea.color` is chosen per-firm in Settings and can't
  be contrast-checked at render time — it's rendered as a small decorative
  dot (`aria-hidden`) next to the label, with the label itself in
  standard theme text color. See `components/matters/matter-header.tsx`
  and `features/matters/columns.tsx` for the pattern.
- **Don't stack an opacity modifier on top of `text-muted-foreground`**
  (e.g. `text-muted-foreground/80`, `/40`, `/60`) for "extra quiet" text.
  It was already close to the WCAG AA boundary at full opacity; any
  reduction pushes it below 4.5:1 for small text. The token itself was
  darkened in this release specifically so it's safe at full opacity —
  use it plain.
- Use `RiskSeverityPill`/`StatusPill` tone colors as-is — they're
  calibrated (darker text than the base `--success`/`--warning`/
  `--destructive`/`--primary` tokens) specifically to pass 4.5:1 against
  their 10%-opacity tinted backgrounds at 12px. Don't recreate a
  similar tinted-badge pattern with the raw tokens elsewhere without the
  same calibration (see `components/shared/status-pill.tsx`'s comment).

## Labeling & accessible names

- Every icon-only button needs `aria-label` — no exceptions. Check for
  this explicitly when adding any `<Button size="icon">`.
- A `<Select>`/`<SelectTrigger>` whose only visible text comes from
  `<SelectValue placeholder="...">` (i.e., no value selected yet) has
  **no accessible name** by default — placeholders are not accessible
  names, matching native `<input placeholder>` behavior. Add an explicit
  `aria-label` to the `SelectTrigger` (or `id`+`Label htmlFor` if there's
  a visible label already). This was a systemic gap found across ~12
  table filter toolbars in this release — every new filter `<Select>`
  needs this from the start.
- A form field using a bare `<Label>` (not react-hook-form's
  `FormLabel`/`FormItem`, which auto-wires association) must connect it
  via `htmlFor`/`id` — see `components/settings/court-list-manager.tsx`
  for the correct pattern, and `components/billing/record-payment-dialog.tsx`
  for a real fix applied this release.

## Destructive actions

- Every destructive action (delete, archive, reject, permanently remove)
  must go through `components/shared/confirm-dialog.tsx` — never fire
  immediately on click. Checked systemically this release; the one gap
  found (court list entry deletion) is now fixed.

## States every list/detail view needs

- **Empty**: `components/shared/empty-state.tsx` — icon, title, optional
  description/action. Used everywhere; don't hand-roll a new "no data"
  block.
- **Error**: `components/shared/error-state.tsx` — same shape, destructive
  styling. Wired into the global `app/error.tsx` boundary this release;
  use it directly for any component-level error fallback too.
- **Loading**: `app/loading.tsx` (global, lightweight skeleton) covers
  route-level navigation. For in-page async actions, follow the existing
  pattern of a disabled button + changed label (e.g. "Saving...") rather
  than a separate spinner component — matches this app's existing,
  consistent style across every form/dialog.
- **Not found**: `app/not-found.tsx` — used automatically by every
  `notFound()` call already in the codebase (client/matter detail pages).

## Animation

- `framer-motion` entrance animations (e.g. `StatCard`'s fade/slide-in)
  are brief (~350ms) and non-repeating — acceptable under WCAG without
  needing `prefers-reduced-motion` handling. Don't add looping or
  attention-grabbing animations without considering motion sensitivity.
- If you add an automated a11y test against a page with an entrance
  animation, wait for it to settle (`page.waitForTimeout(800)` or similar)
  before running axe — otherwise axe can catch a genuinely fine design
  mid-transition and report a false-positive contrast violation (this
  happened with `StatCard` in this release's `tests/accessibility/dashboard.spec.ts`).

## Component reuse

Before building a new table, filter bar, badge, dialog, or form pattern —
check `docs/COMPONENT_LIBRARY.md` and `components/shared/*`. Nearly every
UI pattern in this app already exists once; a second bespoke
implementation is very likely unnecessary.
