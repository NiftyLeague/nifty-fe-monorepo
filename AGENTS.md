## Stack

- **Monorepo:** Turborepo (`turbo` ^2.10.5) over Bun workspaces (`packages/*`, `apps/*`).
- **Runtime:** Bun only. `packageManager: bun@1.3.14` in root `package.json`; toolchain pinned in `mise.toml` (`node = "24.18.0"`, `bun = "1.3.14"`). CI uses `jdx/mise-action@v2` with `cache: true`.
- **Language:** TypeScript ~5.9.3. Shared `tsconfig` bases live in `@nl/typescript-config`.
- **Apps:** Next.js 16 / React 19 (`app`, `smashers`, `web`, `template`) + Docusaurus 3 (`docs`).
- **UI:** `@nl/ui` = Shadcn/ui + Tailwind CSS 4 (also hosts Storybook 10 + the `add-ui` / `migrate-ui` shadcn flow). `@nl/theme` = Material-UI 7 + Emotion + `react-intl` (with RTL plugin) for Next.js apps.
- **Web3:** wagmi, viem, Reown AppKit, `@imtbl/sdk`, `@cowprotocol/cow-sdk`, `@axelar-network/axelarjs-sdk`, `@x402/*`, `react-unity-webgl`.
- **Tooling:** ESLint 9 (flat config from `@nl/eslint-config`), Prettier 3 (from `@nl/prettier-config`), Husky 9 + lint-staged 16, Syncpack 13, Sentry Next.js.
- **CI:** `.github/workflows/ci.yml` runs `bun install --frozen-lockfile` → `bun run format:check`, `bun run lint`, `bun run type:check`, `bun run build`, `bun run test` on `main` / `staging`.

## Commands

All from the repo root. Names match the root `package.json` `scripts` block exactly.

- **Install:** `bun install --frozen-lockfile` (lockfile is `bun.lock`; never `npm`/`pnpm`/`yarn` install).
- **Dev:** `bun dev` → `turbo dev`. Port map: `web` 3000, `app` 3001, `docs` 3002, `smashers` 3003, `template` 3005.
- **Build:** `bun run build` → `turbo build`.
- **Test:** `bun test --isolate` — **Bun's native test runner, NOT vitest, NOT jest.**
- **Lint:** `bun run lint` → `turbo lint`. Fix mode: `bun run lint:fix`.
- **Type-check:** `bun run type-check` → `turbo type-check`. `type:check` is a CI alias of the same task.
- **Format:** `bun run format` → `turbo format`.
- **Format check:** `bun run format:check` — root-level Prettier directly (NOT turbo). This is what CI runs.
- **Other root scripts (don't invent new ones):** `bun run start` (`turbo run dev`), `bun run clean` (`turbo clean`), `bun run act-ci` (local act invocation of CI), `bun run add-ui` (`bun --filter ui add-component $@`), `bun run migrate-ui`, `bun run sync-node-versions`, `bun run symlinks`, `bun run test:coverage` (`bun test --isolate --coverage`), `bun run test:coverage:workspaces` (`turbo test:coverage`), `bun run test:watch` (root = `bun test --watch`).

## Structure

Workspaces: `packages/*`, `apps/*` (declared in root `package.json` `workspaces`). No root `tsconfig.json` — each workspace extends a base from `@nl/typescript-config`.

### Apps (`apps/*`)

- `app` — Next.js 16 dashboard (`app.niftyleague.com`, port 3001). Web3 wallets, PlayFab, Sentry, MUI, Redux Toolkit, Reown AppKit.
- `docs` — Docusaurus 3 docs site (`niftyleague.com/docs`, port 3002). Algolia search, Mermaid theme, GTM plugin.
- `smashers` — Next.js 16 Nifty Smashers marketing/game site (`niftysmashers.com`, port 3003). NextAuth + iron-session, PlayFab, Sentry, sitemap.
- `web` — Next.js 16 corporate marketing site (`niftyleague.com`, port 3000). three.js + model-viewer, Sentry, sitemap.
- `template` — Next.js 16 starter template to fork for new apps / feature testing (port 3005).

### Packages (`packages/*`)

- `@nl/typescript-config` — Shared `tsconfig.json` bases.
- `@nl/eslint-config` — Flat-config ESLint presets (`.`, `./base`, `./next-js`, `./react-internal`).
- `@nl/prettier-config` — Single shared Prettier config.
- `@nl/ui` — Shadcn/ui + Tailwind 4 component library (`base/`, `custom/`, `hooks/`, `lib/`); Storybook 10.
- `@nl/theme` — MUI 7 + Emotion + `react-intl` theme wrapper.
- `@nl/playfab` — PlayFab client SDK wrappers, hooks, components, types.
- `@nl/imx-passport` — Immutable Passport client/config for Immutable zkEVM.

## Conventions & Gotchas

- **Bun-only.** `bun install --frozen-lockfile` for fresh checkouts and CI. Never `npm install`, never `pnpm install`. Run `mise install` so Bun resolves correctly.
- **Use root scripts, never `cd` into a workspace to run `turbo` or `npm`.** That bypasses the task graph defined in `turbo.json` (^build, transit, lint:fix). Add per-workspace deps with `bun --filter <name> add <pkg>`. Workspace names: `app`, `docs`, `smashers`, `web`, `template`, `ui`, `theme`, `playfab`, `imx-passport`, `eslint-config`, `prettier-config`, `typescript-config`.
- **Test runner is `bun test` (native).** Not vitest, not jest. The dead-cruft exception below is the only place `vitest` appears in this repo, and you must NOT execute it.
- **DO NOT run `test:watch` in `apps/template`, `packages/typescript-config`, `packages/eslint-config`, or `packages/prettier-config`.** Those four workspaces still ship `"test:watch": "vitest --config ../../vitest.config.ts --project <name>"` from the original Turborepo template. `vitest` is NOT a declared dependency anywhere — invoking these scripts will fail. The real runner is `bun test`. Other workspaces (`app`, `docs`, `smashers`, `web`, `ui`, `imx-passport`, `playfab`, `theme`) correctly delegate `test:watch` to `bun test --watch` and are safe.
- **No vitest, no jest, anywhere.** Do not add either to any `package.json`. A stray `VITEST_SCOPE=…` env var in some `test:coverage` scripts is a label only — the command still resolves to `bun test` and the env var is ignored.
- **Husky + lint-staged are active.** `prepare` runs `husky || true && bun symlinks`; pre-commit hooks format/lint staged files. Never bypass with `--no-verify`.
- **Turbo task graph is opinionated** (`turbo.json`): `lint`, `lint:fix`, `format`, `type-check` all `dependsOn: ["transit"]`; `test` additionally `dependsOn: ["transit", "lint:fix", "format", "type-check"]`; `build` does `^build`. Don't bypass with raw `turbo` flag overrides.
- **`format:check` is the only root script that does NOT go through turbo** — it runs Prettier directly against the glob `**/*.{js,ts,tsx,md,mdx,json,yml,yaml}` (respecting `.prettierignore`). CI uses this exact script.
- **Env vars are Vercel-managed.** `globalEnv` in `turbo.json` (Apple/Facebook/Google/Twitch OAuth, `PLAYFAB_API_KEY`, Sentry tokens, `VERCEL_ENV`, `CI`/`GITHUB_ACTIONS`) + per-app `env` (`NEXT_PUBLIC_*`, `EDGE_CONFIG`, `ALGOLIA_*`, `NEXTAUTH_SECRET`). Pull locally with `vercel env pull .env.local` from inside the app dir. Never commit `.env.local`.
- **TypeScript configs:** no root `tsconfig.json`. Each workspace must `"extends": "@nl/typescript-config/<base>.json"`.
- **Syncpack enforces version alignment.** Run `bunx syncpack lint` (or `fix-mismatches` / `format` / `update`) when adding or upgrading deps to keep ranges consistent across workspaces.
- **No new root scripts.** The root already exposes the standard verbs (build / dev / test / lint / type-check) plus the format pair and a few ops helpers. Add new functionality as workspace scripts or via Turbo task definitions, not as additional root scripts.
- **Solidity exception (out of scope):** `bun test` covers TypeScript workspaces. Solidity lives in the separate `nifty-smart-contracts` repo and uses Foundry there — do not pull Foundry/Hardhat tooling into this repo.
