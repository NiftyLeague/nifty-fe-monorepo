# M0 — Baseline and Decision Gates

> **Superseded (2026-09-10):** the `web` app has since migrated from Next.js to Astro static + a Cloudflare Worker. The rows and baseline notes below describe the pre-migration state and are kept for benchmark history.

Status: active baseline contract

This decision record covers M0.1 through M0.4. It makes later migration work measurable and reversible; it does not approve a framework, bundler, or state-library migration.

## Sources of truth

- `test/contract/route-surface.test.ts` owns the complete externally consumed route-file contract.
- `benchmarks/m0-routes.json` owns benchmark URLs, priority, the lab profile, and build commands.
- `benchmarks/results/m0-*.json` is immutable run evidence. A newer baseline is a new file.
- This document owns architecture interpretation, decision gates, and rollback rules.

## Route and ownership inventory

| App        | Runtime and rendering                                                                            | P0/P1 route groups                                                                                            | Build and deploy path                                               |
| ---------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `api`      | Express 5 on Node; dynamic HTTP handlers                                                         | `/`, `/NFTL/supply*`, `/:network/degen/*`, `/imx/marketplace/*`                                               | `bun --filter api build`; Vercel function from `apps/api`           |
| `app`      | Next 16 App Router; public server/client boundary plus authenticated dashboard                   | `/`, `/degens`, `/degens/[id]`, `/games/*`, `/leaderboards`, `/mint-o-matic`, `/dashboard/*`, `/verification` | `bun --filter app build` (Webpack); Vercel `app.niftyleague.com`    |
| `docs`     | Docusaurus 3 static site                                                                         | `/`, `/overview/intro`, guides, FAQ, generated contract docs                                                  | `bun --filter docs build`; Vercel `docs.niftyleague.com`            |
| `smashers` | Next 16 App Router; server auth and client game/UI islands                                       | `/`, `/loot`, `/login`, `/profile`, `/api/auth/*`, `/api/playfab/*`                                           | `bun --filter smashers build` (Webpack); Vercel `niftysmashers.com` |
| `template` | Next 16 App Router; static shell with client progress state                                      | `/`                                                                                                           | `bun --filter template build`; local production benchmark only      |
| `web`      | Astro 7 static; React islands inside Astro shells (Cloudflare Worker variant for special routes) | `/`, `/games`, `/degens`, `/niftyworld`, `/roadmap`, `/gltf/[tokenId]`, invite and party links                | `bun --filter web build` (Astro); Vercel `niftyleague.com`          |

The contract test lists every external route. The benchmark manifest selects one no-auth route per app for repeatable lab data. Authenticated dashboard, profile, and wallet routes need a sanitized fixture before their migration.

### Shared boundaries and major assets

| Boundary                     | Consumers                          | Constraint                                                                         |
| ---------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------- |
| `@nl/ui`                     | every frontend app                 | Preserve public exports, themes, and Tailwind source scanning.                     |
| `@nl/contracts`              | `api`, `app`                       | Contract addresses and ABI compatibility are release-critical.                     |
| `@nl/imx-passport`           | `app`                              | Wallet/session initialization remains client-only.                                 |
| `@nl/playfab`                | `smashers`                         | Preserve NextAuth and PlayFab HTTP contracts.                                      |
| `@nl/sentry-client`          | Next apps                          | Production-only Sentry wrapping must not enter development/preview graphs.         |
| `assets/img`, `assets/video` | app, docs, smashers, template, web | Reuse through public-tree symlinks; no asset copy or rename in runtime migrations. |

## State and data ownership

The owner named here is the only layer allowed to persist, invalidate, or mutate that domain. Components may consume it but may not create a competing cache or storage key.

| Domain                                                       | Current owner and lifecycle                                                                                           | Persistence / invalidation                                                                      | Duplicate or migration risk                                                                           |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Wallet connection, chain, signer, contracts                  | `app` `NetworkProvider`, `IMXProvider`, `Web3ModalRuntime`                                                            | Wallet-provider events; reset on disconnect or chain change                                     | Providers and signers are non-serializable; do not move them to a generic client store.               |
| Login indicator                                              | `AuthStatusProvider`                                                                                                  | `localStorage:nifty-auth-status`; changed by auth flow                                          | Legacy `persist.account.isLoggedIn` fallback exists during compatibility window.                      |
| Auth token, nonce, UUID, user ID, agreement, favorite DEGENs | `LocalStorageProvider`                                                                                                | Explicit local-storage keys; `clearAllAuth` clears credential fields and regenerates nonce/UUID | Keys are security-sensitive; a server/query cache may not persist token values.                       |
| Auth session and backend profile                             | `useAuth`, `useCheckAuth`, `useGamerProfile`                                                                          | Refetch after auth transition; profile write paths own optimistic state                         | Status, token, and profile layers can drift; M1 needs one post-login invalidation sequence.           |
| NFT, token, Arcade, and DEGEN balances                       | `NFTsBalanceProvider`, `TokensBalanceProvider`, `DegenOwnershipProvider`; TanStack Query for Arcade/game/rental reads | Refresh on login and transaction completion; invalidate on chain/account change                 | Context fetch hooks and TanStack Query overlap for account data. Retain one cache owner per endpoint. |
| Dashboard rentals and selected data                          | TanStack Query in route clients                                                                                       | Query-key invalidation after mutation                                                           | Document keys and stale-time policy before relocating related fetch hooks.                            |
| Public DEGEN filtering/pagination                            | URL search parameters plus local component state                                                                      | URL is shareable state; local state is ephemeral                                                | Never mirror filters into global state.                                                               |
| Navigation and notifications                                 | `NavigationProvider`, `NotificationProvider`                                                                          | Memory only; reset on root unmount                                                              | Local UI state only; it does not belong in a server cache.                                            |
| Feature flags                                                | `FeatureFlagsContext` (`app`) and `FeatureFlagsProvider` (`smashers`)                                                 | Runtime reads, provider-specific refresh                                                        | Same concept, different runtime boundaries; no consolidation before a shared source/failure model.    |
| Smashers user                                                | `@nl/playfab` `UserContextProvider`, `useUserInfo`, `useUserSession`                                                  | SWR cache; mutations use its keyed mutator                                                      | Preserve PlayFab cache keys and NextAuth boundaries.                                                  |
| API metadata and marketplace                                 | API handlers and upstream S3/IPFS                                                                                     | HTTP cache headers                                                                              | New client caches cannot contradict API `Cache-Control`.                                              |
| Marketing/docs content                                       | route module and static build                                                                                         | Build/deploy invalidation                                                                       | No client cache is justified without a dynamic source.                                                |

### Duplication hotspot ranking

1. **High impact / high risk:** app account data uses both context-managed fetch hooks and TanStack Query. Baseline request waterfalls, keys, login/logout invalidation, pending mutation UI, and error states first.
2. **High impact / medium risk:** wallet, auth status, and local credential state cross several providers. Preserve initialization order, SSR fallback, disconnect cleanup, and storage compatibility.
3. **Medium impact / medium risk:** DEGEN catalogue, dashboard DEGENs, gamer profile, and overview reuse derived account data. Separate normalized responses from route presentation/filter state.
4. **Medium impact / low risk:** app and Smashers feature flag providers have similar names but different runtime boundaries.
5. **Low impact / low risk:** drawers, dialogs, snackbars, carousels, and template progress remain ephemeral component/context state.

## Budgets and decision gates

The M0 route budget uses five clean-cache headless-Chrome desktop samples from the manifest profile. Field RUM, once available, supersedes this lab gate for user-experience claims.

| Metric                            | P0 budget                                             | P1/P2 budget       | Decision rule                                                                              |
| --------------------------------- | ----------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------ |
| LCP                               | median <= 2.5 s; no sample > 4 s                      | median <= 3.0 s    | Reject an absolute-limit breach or a median regression >10% and >250 ms.                   |
| INP (configured synthetic action) | median <= 200 ms                                      | median <= 300 ms   | Reject an equivalent-action regression >10% and >20 ms. Synthetic result is not field INP. |
| CLS                               | median <= 0.10                                        | median <= 0.15     | Reject a ceiling breach or growth >0.02.                                                   |
| TTFB                              | median <= 800 ms                                      | median <= 1.0 s    | Investigate CDN/runtime/cache behavior before a framework decision.                        |
| Total transfer / JS / CSS         | no >10% increase and no unexplained critical resource | no >15% increase   | Promotion needs a measured user benefit that offsets byte growth.                          |
| Request count                     | no >10% increase                                      | no >15% increase   | Explain added requests and eliminate critical-path waterfalls.                             |
| Memory                            | no >15% increase                                      | no >20% increase   | Unavailable browser memory is unmeasured, never zero.                                      |
| Clean and incremental build       | no >10% regression                                    | no >15% regression | Use three timing samples and record host/runtime details.                                  |
| Dev startup and HMR               | no >10% regression                                    | no >15% regression | Use a clean server and a deliberate reversible fixture edit.                               |

### Framework, bundler, and state decisions

| Outcome                       | Required evidence                                                                                                                                                                                                            |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Retain current implementation | Candidate misses a hard compatibility gate, has no material benefit, or cannot preserve route/asset/auth contracts.                                                                                                          |
| Promote to a pilot            | Five route samples, three build samples, visual/accessibility checks, route contract tests, and a rollback step meet budgets. Material benefit is >=15% improvement to the constrained primary metric without P0 regression. |
| Reject a candidate            | An auth, wallet, API, deep-link, SEO/rendering, asset-path, visual, or accessibility contract breaks; or a hard budget fails twice under one profile.                                                                        |
| Advance a state migration     | Owner, cache key, hydration model, mutation/optimistic behavior, error/loading behavior, and invalidation sequence are documented and regression-tested.                                                                     |

No M1-M5 issue may be marked complete from a claimed improvement alone. It must attach before/after JSON evidence, commit, profile, variance note, and the relevant visual, accessibility, route, and behavior checks.

## Rollback and compatibility constraints

- Keep current route URLs, redirects, and API contracts until replacement contract tests pass. Restore the prior route module to roll back; do not change incoming URLs.
- State migrations are additive first: read legacy storage/cookies during a bounded compatibility window, write the new owner only after validated hydration, then retire legacy reads separately. Never put wallet providers, signers, or raw auth tokens in a query cache.
- Cache changes preserve `Cache-Control`, request credentials, retry behavior, stale-data semantics, and loading/error states. Disable a new cache through a feature flag or route boundary; do not globally invalidate all account data as a rollback shortcut.
- Framework and bundler experiments stay isolated and retain the current build path. The rollback point is the last green current-runtime commit; do not combine runtime replacement with asset renames, visual redesign, or dependency-manager changes.
- Deployment rollback uses the last verified Vercel deployment only after checks and route evidence are attached. M0 does not authorize production changes.

## Benchmark operation

Run `bun scripts/m0-benchmark.mjs --dry-run` to validate the manifest. The runner uses a disposable headless Chrome profile with cache disabled. It captures LCP, synthetic INP, CLS, navigation TTFB, CDP transfer bytes, request count, and best-available JS memory. It writes individual samples and median/spread, or `null` plus an unsupported note where Chrome cannot report a metric. It does not read browser cookies, local storage, or credentials.

The `template` route is local-only because there is no declared production deployment. Start its production server on `127.0.0.1:3005` and add `--include-local --route template-home` to collect its evidence. Add `--build` to capture the manifest's clean and incremental build timing. This mode only touches generated output paths named in the manifest.

Dev-startup and HMR timing require an approved disposable fixture. Record the fixture, edit, server command, Browser/Node/Bun versions, host profile, and run count beside the matching JSON evidence. The runner does not automate product-source edits.

## Evidence recorded on 2026-09-07

- `benchmarks/results/m0-production-2026-09-07.json`: five cache-disabled production samples for API, app, docs, Smashers, and web.
- `benchmarks/results/m0-template-2026-09-07.json`: five local production samples for the template route.
- `benchmarks/results/m0-build-2026-09-07.json`: three clean/incremental build pairs per app. API, app, docs, template, and web exited successfully in all samples.
- `benchmarks/results/m0-smashers-build-2026-09-07.json`: one cache-disabled production route sample and three clean/incremental Smashers build pairs. Every build exited successfully with `NEXTAUTH_SECRET` loaded only into the benchmark process from the ignored local Smashers environment file; the secret is neither copied into this worktree nor written to the evidence file.
