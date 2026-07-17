# Design System

Source of truth: [`src/app/globals.css`](../src/app/globals.css) (tokens) + [`components.json`](../components.json) (shadcn config). This doc explains and catalogs those tokens — don't hand-maintain a second copy of the values, link back to the CSS file for the numbers.

## Foundation

- **Tailwind CSS v4**, token-driven via `@theme inline` mapping CSS custom properties to Tailwind utilities (`--color-background` → `bg-background`, etc.) — no `tailwind.config.js`; all configuration is in `globals.css`.
- **shadcn/ui, "new-york" style**, Radix primitives (via the `radix-ui` meta-package), `lucide-react` icons, no component prefix, base color `neutral`. Config: `components.json`.
- **Color space: OKLCH** for every semantic color token (perceptually uniform lightness — safer for generating consistent light/dark pairs than HSL/RGB). Chart colors are plain hex since Recharts consumes them directly.

## Typography

- **Sans**: Geist (`next/font/google`), bound to `--font-sans`, applied via `html { @apply font-sans }` — this is the only body font, used everywhere including `--font-heading` (aliased to the same family, not a separate display font).
- **Mono**: Geist Mono, bound to `--font-mono` — for code/monospace contexts (invoice numbers, IDs) if needed; not currently forced anywhere by default.
- No standalone type-scale tokens beyond Tailwind's default `text-xs`…`text-4xl` utilities — headings use Tailwind size utilities directly rather than a custom `--font-size-*` scale. Keep it that way unless a real need for named scale steps (e.g. `--text-display`) shows up.

## Color tokens

Semantic pairs, each with a `-foreground` counterpart, defined once in `:root` and overridden in `.dark`:

| Token | Role |
|---|---|
| `background` / `foreground` | page base |
| `card` / `card-foreground` | elevated surfaces |
| `popover` / `popover-foreground` | floating surfaces (dropdowns, popovers) |
| `primary` / `primary-foreground` | brand action color |
| `secondary` / `secondary-foreground` | secondary actions |
| `muted` / `muted-foreground` | de-emphasized text/surfaces |
| `accent` / `accent-foreground` | hover/highlight states |
| `destructive` | error/danger actions |
| `success` / `success-foreground` | positive status (not a default shadcn token — added for this app's status pills) |
| `warning` / `warning-foreground` | caution status (added, same reason) |
| `border`, `input`, `ring` | structural + focus tokens |
| `sidebar*` (7 tokens) | sidebar has its own mini palette so it can read as a distinct surface (darker/tinted) from the main canvas in both themes |
| `chart-1`…`chart-8` | 8-color categorical palette for Recharts, distinct hex values per theme (dark-theme chart colors are brightened for contrast against the dark background) |

`success` and `warning` are custom additions on top of stock shadcn tokens — every status-driven UI (invoice status, matter status, hearing status, task status) should map through these two plus `primary`/`destructive`/`muted`, not introduce ad-hoc colors. See `src/components/shared/status-pill.tsx` for the mapping pattern to follow for any new status enum.

## Dark mode

- `next-themes` `ThemeProvider` in `providers.tsx`: `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`.
- Activated via `@custom-variant dark (&:is(.dark *))` — a `.dark` class toggle on `<html>`, not `prefers-color-scheme` media queries directly (though `system` default respects OS preference on first load).
- Every token above has a `.dark` override — there is no component that should ever hardcode a light-only or dark-only color; always use the semantic token so both themes stay correct automatically.
- `ThemeToggle` (`src/components/layout/theme-toggle.tsx`) is the one place theme is switched from the UI.

## Radius scale

Single base `--radius: 0.75rem`, every other step derived from it — never hardcode a `rounded-*` pixel value or introduce a new base radius:

| Token | Formula |
|---|---|
| `--radius-sm` | `radius * 0.6` |
| `--radius-md` | `radius * 0.8` |
| `--radius-lg` | `radius` (the base) |
| `--radius-xl` | `radius * 1.4` |
| `--radius-2xl` | `radius * 1.8` |
| `--radius-3xl` | `radius * 2.2` |
| `--radius-4xl` | `radius * 2.6` |

## Spacing & grid

No custom spacing scale — Tailwind's default spacing scale (4px base unit) is used as-is throughout. Layouts use Tailwind's flex/grid utilities directly (`grid-cols-*`, `gap-*`) rather than a custom grid component; the dashboard widget grids are the reference pattern (see any `<role>/page.tsx`).

## Breakpoints & responsive rules

Tailwind v4 defaults (`sm` 40rem, `md` 48rem, `lg` 64rem, `xl` 80rem, `2xl` 96rem) — no custom breakpoints defined. Conventions observed across the codebase:
- Sidebar collapses to an off-canvas `Sheet` below `lg`; the persistent sidebar shows at `lg`+.
- Dashboard widget grids: 1 column by default, `md:grid-cols-2`, `lg:grid-cols-3`/`4` depending on widget density.
- Tables (`DataTable`) wrap in `overflow-x-auto` rather than reflowing to cards on small screens — acceptable for an internal practice-management tool used primarily on desktop; revisit if mobile usage data says otherwise.

## Shadows & elevation

No custom `--shadow-*` token scale — components use Tailwind's default `shadow-sm`/`shadow-md` utilities plus `border` for definition (cards are bordered + subtly shadowed, not shadow-only). Keep relying on Tailwind's defaults rather than introducing a bespoke elevation system; there's no product need for more than 2 elevation steps yet.

## Motion

`framer-motion` is a dependency but usage is sparse/targeted (specific micro-interactions), not a blanket animation layer. `tw-animate-css` supplies utility animation classes (`animate-in`, `fade-in`, etc.) used by Radix-driven components (dialog/sheet/dropdown open/close transitions) — prefer these utility classes for enter/exit transitions over hand-rolled `framer-motion` unless the interaction is genuinely complex (e.g., drag, physics-based).

## Accessibility

- All interactive primitives are Radix-based (`ui/dialog.tsx`, `ui/select.tsx`, `ui/dropdown-menu.tsx`, etc.) — focus trapping, ARIA roles, and keyboard nav come from Radix, not reimplemented.
- Color pairs are chosen for contrast in both themes (see the OKLCH lightness values above) — when adding a new token pair, keep foreground/background lightness far enough apart to hold WCAG AA contrast, don't eyeball it.
- `TooltipProvider` is global (in `providers.tsx`) with a 200ms delay — use `Tooltip` for icon-only buttons rather than relying on `title=` attributes.

## Components inventory

See [COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md) for the full primitive + shared component catalog built on top of these tokens.
