# @nl/ui

Shared SolidJS component library for the NiftyLeague apps (`web`, `app`,
`smashers`). Built on [Kobalte](https://kobalte.dev/) primitives, Tailwind CSS
v4, and `class-variance-authority`.

## Conventions

### Primitives come from Kobalte

Interactive components **must** be built on `@kobalte/core` primitives — never
hand-roll focus management, keyboard interaction, or ARIA state. Kobalte owns
roving tabindex, typeahead, aria-current/expanded/haspopup wiring, and portal
behavior; we own styling and variants only.

This is enforced by the `nifty-ui/require-kobalte` oxlint rule: literal
`role="dialog"`, `role="listbox"`, `role="tablist"`, etc. in JSX are errors.
If a primitive you need doesn't exist yet, add a Kobalte-backed component here
instead of wiring ARIA manually at the call site.

Current Kobalte-backed primitives in `src/components/base/`: accordion,
alert, alert-dialog, avatar, badge, button, checkbox, dialog, pagination,
progress, radio-group, select, separator, sheet, tabs, toggle, toggle-group,
tooltip (plus `sonner` for toasts and `form` for @modular-forms/solid).

Deliberately **not** Kobalte (no primitive exists; static presentational
components, matching shadcn/ui): `card`, `input`, `input-group`, `label`,
`icon`, `scroll-area`, `skeleton`, `table`. If Kobalte ships one of these
later, migrating is welcome.

### Component rules (enforced by @shadcn/lint)

The repo runs `@shadcn/lint` through oxlint (see root `.oxlintrc.json`).
Call sites may:

- use **layout** utilities for placement around a component (`mt-4`, `w-full`,
  `mx-auto`),
- override **colors** with theme tokens (`bg-muted`, `text-primary-foreground`).

Call sites may not restyle spacing, shape, typography, or effects from the
outside (`p-8`, `rounded-lg`, `shadow-none`, `text-center` on a `@nl/ui`
component). Extend the component's `cva` variants in `packages/ui` instead —
the lint error will tell you when.

Components whose sizing genuinely varies per page carry a contract that
allows the extra categories: `Accordion*`, `ToggleGroup*` (spacing), the
`Table*` family (spacing, typography, shape), `Dialog*`/`Sheet*`
(spacing, shape), `Input*` (spacing, shape), `Card*` (spacing),
`Skeleton*`/`DeferredSkeleton*` (shape), `Button*`/`IconButton*` (height,
size, compact padding), `Icon*` (size, motion), `Title`/`Text`
(typography), `Separator*` (spacing, effects), and `ScrollArea*` (spacing).
Motion utilities (`animate-spin` and friends) and project plain-CSS classes
(`pixelated`, the `home-v3-*` marketing classes) are allowed everywhere.

Also enforced: no raw palette colors (use theme tokens from
`src/styles/01_tailwind.theme.css`), no arbitrary values (`p-[13px]` → scale
classes; dynamic values use the CSS custom property pattern:
`class="w-(--bar-w)" style={{ '--bar-w': value }}`), no inline static styles,
no dynamically built class names (use static lookup maps).

Exemptions, each documented by its reason:

- `packages/ui/src/components/**` — component-definition site (owns variants
  and style-forwarding APIs).
- Application component directories (`apps/*/src/components/**`) — wrapper /
  composition layer, same rationale.
- `custom/global-error` — renders standalone, even when the app stylesheet
  fails to load; its tests assert the inline styles.
- `packages/playfab/src/**` — no Tailwind theme entry point, so
  theme-dependent rules (`no-raw-colors`, `no-unknown-classes`) are off;
  color policy is enforced in the apps that consume it.
- A handful of test-pinned files (leaderboard `modal-table` hooks, sidebar
  frames whose tests assert inline geometry, DegenImage media) are listed in
  the root `.oxlintrc.json` with the rule turned off per file.

Also enforced: no raw palette colors (use theme tokens from
`src/styles/01_tailwind.theme.css`), no arbitrary values (`p-[13px]` → scale
classes; dynamic values use the CSS custom property pattern:
`class="w-(--bar-w)" style={{ '--bar-w': value }}`), no inline static styles,
no dynamically built class names (use static lookup maps).

`packages/ui/src/components/**` is exempt from `no-restyle`,
`require-static-classes`, and `no-inline-styles`: this is the component
definition site, where variants and style-forwarding APIs live. Test files are
exempt from all design-system rules. `custom/global-error` keeps its inline
styles and hex colors on purpose — it must render even when the app stylesheet
fails; its tests assert this.

### SolidJS rules

- `class`, not `className` (both are accepted by the shared components for
  React-era call-site comfort; prefer `class` in new code).
- Props are functions: `props.value`, not destructured objects.
- `splitProps` + forwarding: keep component APIs `(Props & { className?: string })`
  consistent with the existing base components.

## Scripts

- `bun run lint` / `lint:fix` — oxlint (strict; plugins included via root config)
- `bun run format` — oxfmt
- `bun run type-check` — `tsc --noEmit`
- `bun test` — Bun test runner with the repo preloads
- `bun run add-component -- <name>` — scaffold a component through the shadcn CLI
  (Solid/Kobalte output; run `bun run format` after)

## Known follow-ups

- `Typography` lacks responsive size props; call sites that need
  `text-sm md:text-base` sizing currently drop to plain elements.
- `Tabs` could use a root spacing variant and a "plain" trigger variant
  (no radius/border) for disabled-tab states.
- `Icon`/`Input` keep documented React-era compat aliases (`className`,
  camel-case lucide props) that should be retired with a call-site sweep.
