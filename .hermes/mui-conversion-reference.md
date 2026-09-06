# MUI → shadcn/@nl/ui + Tailwind conversion reference (nifty-fe-monorepo apps/app)

Goal: zero `@mui/*` imports in apps/app/src. Use @nl/ui shadcn components + Tailwind classes, preserve visual output (app is always dark-mode, `html.dark`).

## Import paths
- `@nl/ui/base/*` — shadcn base components (button, card, dialog, input, label, select, skeleton, avatar, badge, progress, pagination, separator, checkbox, sheet, slider, accordion, tabs, toggle, toggle-group, alert, tooltip, icon)
- `@nl/ui/custom/*` — custom components (typography: Title/Text/Link, input, dialog, circular-progress, accordion, alert-dialog, animated-wrapper, external-icon)
- `@nl/ui/utils` — `cn` (clsx + tailwind-merge)
- `@/types` — local types; `SxProps`, `Theme`, `ChipProps`, `TableCellProps` already defined locally (types/index.ts)

## Component mapping
| MUI | Replacement |
|---|---|
| `Box` | `<div>` |
| `Stack direction="row" spacing={N}` | `<div className="flex flex-row gap-N*4">` (spacing unit = 8px; spacing(0.5)=4px=gap-1, spacing(1)=8px=gap-2, spacing(1.5)=12px=gap-3, spacing(2)=16px=gap-4, spacing(3)=24px=gap-6) |
| `Stack` (default column) | `<div className="flex flex-col gap-...">` + alignItems/justifyContent → items-*/justify-* |
| `Grid container spacing={N}` | `<div className="grid grid-cols-12 gap-N*4">` |
| `Grid item xs={6}` / `size={{xs:6}}` | `<div className="col-span-6">`; xs=12 sm=6 → `col-span-12 sm:col-span-6`; auto → col-span-12 |
| `Typography variant="h1..h6"` | `@nl/ui/custom/typography` `Title level={1..6}` (matches theme: h1=text-4xl font-header bold, h4-h6 font-subheader) |
| `Typography variant="body1"` | `<span className="text-base">` (or `<p>`) |
| `Typography variant="body2"` | `<span className="text-sm text-foreground">` |
| `Typography variant="subtitle1"` | `<span className="text-sm font-medium text-foreground">` |
| `Typography variant="subtitle2"` / `caption` | `<span className="text-xs text-muted-foreground">` |
| `Button variant="contained"` | `<Button variant="default">` from `@nl/ui/base/button` |
| `Button variant="outlined"` | `<Button variant="outline">` |
| `Button variant="text"` | `<Button variant="ghost">` |
| `Button size="small"` | `size="sm"`; `size="large"` → `size="lg"`; fullWidth → `className="w-full"`; startIcon/endIcon → children (with flex/gap built-in) |
| `IconButton` | `<Button variant="ghost" size="icon">` (add className cursor-pointer) |
| `Skeleton` | `@nl/ui/base/skeleton` `Skeleton` (className sets w/h; variant="text" → default; "circular" → rounded-full; "rectangular" → rounded) |
| `Divider` | `@nl/ui/base/separator` `Separator` (orientation="vertical" → className="h-full w-px") |
| `Card` | `@nl/ui/base/card` `Card` (className="rounded-xl border ...") |
| `CardContent` | `CardContent` |
| `CardActions` | `<div className="flex items-center gap-2 px-6 pb-6">` |
| `CardHeader` | `CardHeader` |
| `CardMedia` | `<img>` or next/image |
| `Avatar` (MUI) | `@nl/ui/base/avatar` `Avatar` + `AvatarImage`/`AvatarFallback` |
| `Link` (MUI) | next/link `Link` (or `@nl/ui/custom/typography` Link) |
| `TextField` | `@nl/ui/custom/input` `Input` (supports label, error, startIcon, endIcon, copy) or base `Input` + `Label` |
| `FormControl` | `<div>` or `<div className="grid gap-2">` |
| `InputAdornment` | icon span inside input wrapper |
| `MenuItem` | select item |
| `Dialog` family | `@nl/ui/base/dialog` primitives (Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose) |
| `Alert` | `@nl/ui/base/alert` (variant default/destructive; severity success/warning/error → className text/border) |
| `CircularProgress` | `@nl/ui/custom/circular-progress` `CircularProgress` (size sm/md/lg/xl) |
| `LinearProgress` | `@nl/ui/base/progress` `Progress` (value prop) |
| `Checkbox` | `@nl/ui/base/checkbox` `Checkbox` (Radix; checked/onCheckedChange instead of onChange) |
| `FormControlLabel` | `<Label>` wrapping checkbox |
| `Container` | `<div className="container">` (Tailwind container; app overrides --custom-max-width) |
| `Badge` | `@nl/ui/base/badge` `Badge` |
| `Pagination` | `@nl/ui/base/pagination` primitives |
| `Drawer` | `@nl/ui/base/sheet` `Sheet` (side="left" for nav) or plain fixed divs |
| `Collapse` | state + conditional render, or framer-motion |
| `ToggleButton/ToggleButtonGroup` | `@nl/ui/base/toggle` `Toggle` / `toggle-group` |
| `Slider` | `@nl/ui/base/slider` `Slider` (Radix; value array; onValueChange) |
| `Stepper/Step/StepLabel/StepConnector` | plain divs + existing CSS modules (see RentStepper.module.css) |
| `Table` family | semantic `<table>`/`<thead>`/`<tbody>`/`<tr>`/`<th>`/`<td>` + Tailwind |
| `DataGrid` (@mui/x-data-grid) | custom table (see ResponsiveTable/DataTable.tsx pattern) |
| `ImageList/ImageListItem/ImageListItemBar` | CSS grid divs (see comics-grid.module.css) |
| `Menu` | `@nl/ui/base/select` or custom popover/div |
| `Paper` | `<div className="bg-card ...">` |
| `Tooltip` | `@nl/ui/base/tooltip` |
| `SxProps` / `Theme` / `sx=` | `React.CSSProperties` via `style`, or Tailwind className |
| `useTheme()` from @nl/theme | app always dark: replace `theme.palette.mode === 'dark' ? A : B` with A; `theme.spacing(n)` → `${n*8}px`; `theme.typography.X` → hardcoded classes (see below) |
| `gridSpacing` (3=24px), `sectionSpacing` (2=16px), `appHeaderHeight` (60), `appDrawerWidth` (260), `container` (true) | local consts (already done in layout files) |

## Theme typography values (hardcode)
- menuCaption: `mt-2.5 p-1.5 text-sm font-medium capitalize text-muted-foreground`
- subMenuCaption: `block text-xs font-medium uppercase text-muted-foreground`
- commonAvatar: `cursor-pointer rounded-md`
- smallAvatar 22px, mediumAvatar 34px, largeAvatar 44px

## Common patterns
- sx={{ color: 'var(--color-foreground)' }} → className="text-foreground" (or style)
- sx={{ color: 'var(--color-muted-foreground)' }} → text-muted-foreground
- sx={{ fontWeight: 'bold' }} → font-bold
- sx={{ textAlign: 'center' }} → text-center
- sx={{ display: 'flex', alignItems: 'center' }} → flex items-center
- sx={{ p: 2 }} → p-2 (8px); p: 2.5 → p-2.5 (20px); m/px/py same scale
- breakpoints: `[theme.breakpoints.up('lg')]` → `lg:` prefix; down('md') → `max-md:` (Tailwind v4 supports max-*)
- MUI Grid `size={{ xs: 12, md: 6 }}` → `col-span-12 md:col-span-6`
- IMPORTANT: preserve `'use client'` directive when the file already has it, and when adding useState/useEffect.
- NEVER keep `import ... from '@mui/...'` or `from '@nl/theme'` (except layout.tsx ThemeProvider which another task handles — leave layout.tsx alone).

## Validation per file batch
1. `bun run type-check` in apps/app (whole app; ~2-3 min) — only your files' errors count as yours; pre-existing errors in other unconverted files are expected.
2. `bunx prettier --write <changed files>` from repo root.
3. Do NOT run bun install / modify package.json / commit.
