# M5.1 — Cross-app regression matrix

Issue: [#1839](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1839) (M5.1).
The certification target is every app across representative desktop, tablet, mobile,
authenticated, data, modal, navigation, and error states. This document is the matrix:
for each app and state, it names the automated verification that must keep passing, or the
gap and the focused issue tracking it. "Automated" means a test that runs in CI
(`Validation / Test / Unit`, `Integration`, `E2E`, `Performance`, or the root contract
suite); "documented" means a manual procedure written here. A test failing anywhere in the
matrix is a regression and gets a focused issue — it is never waived silently.

The per-app deep dives are M5.5–M5.8 (#1882–#1885); the perf infrastructure behind the
budget column is M5.9 (#1886). This matrix is the cross-app index over both.

## Verification layers, oldest to newest

| Layer            | Where                                                                   | What it proves                                                                                              |
| ---------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Contract suite   | `test/contract/*.test.ts` (root, 38 files)                              | source and generated-output invariants: routes, redirects, headers, assets, fonts, media, pricing of builds |
| Unit / component | each workspace's `*.test.ts(x)`                                         | rendering, state, and (in happy-dom) the DOM contract                                                       |
| Integration      | `apps/api/src/index.integration.test.ts`, smashers `oauth-flow.test.ts` | real route handlers and OAuth round-trips                                                                   |
| Browser E2E      | `apps/web/e2e/*.e2e.ts` via `wrangler dev`                              | hydration, CORS for embedded viewers, keyboard, viewport media, reduced motion                              |
| Benchmarks       | `scripts/m0-benchmark.mjs` + `benchmarks/results/`                      | per-route LCP/CLS/transfer/requests against recorded baselines                                              |

## apps/web — marketing site (Vercel static + Workers assets surface)

15 content routes (`/`, careers, community, compete-and-earn, degens, disclaimer, games,
lore, niftyworld, overview, privacy-policy, roadmap, team, terms-of-service, 404) plus two
worker shells (`/shells/gltf`, `/shells/referral`) reached through `/gltf/:tokenId`,
`/invite/:game/:refcode`, `/party/...`.

| State                                                 | Verification                                                                                                                                                                         |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Desktop render, all content routes                    | `e2e/marketing.e2e.ts` "all marketing documents have crawlable HTML and production canonicals"; `route-surface.test.ts` pins per-page module graphs                                  |
| Desktop → mobile layout                               | `e2e/regression.e2e.ts` (Pixel 7 + desktop projects); responsive breakpoints exercised by both projects                                                                              |
| Navigation                                            | `e2e/regression.e2e.ts` — cold-load tab order (logo → 3 disclosures → action button), group disclosure opens to its pages, Enter navigates; mobile disclosure opens/navigates/closes |
| Reduced motion                                        | `e2e/regression.e2e.ts` — community marquee `animation-name: none` under `prefers-reduced-motion: reduce`; `custom-accessibility.test.tsx` pins the same contract at component level |
| Hydration / console                                   | `e2e/marketing.e2e.ts` "home hydrates without Next requests or console errors"                                                                                                       |
| Error states (404, soft-200)                          | `e2e/marketing.e2e.ts` "unknown routes and private shell documents are not soft-200 pages"; `redirect-surface.test.ts`                                                               |
| Media (GLTF, posters, video)                          | `e2e/marketing.e2e.ts` GLTF poster + CORS tests; `video-delivery.test.ts`, `web-roadmap-media.test.ts`, `web3-game-media.test.ts`, `app-item-media.test.ts`                          |
| Embedding / CORS                                      | `e2e/marketing.e2e.ts` "modules support the opaque origin…"; `_headers` ↔ vercel.json sync pinned in `vercel-build-policy.test.ts` (#1912)                                           |
| Fonts / CLS                                           | `font-loading.test.ts` (fallback layer scoped to smashers only); CLS measured per route by the benchmark harness                                                                     |
| Performance budgets                                   | benchmark harness routes `web-home`; JS weight audited in #1837 (71% third-party)                                                                                                    |
| **Screenshots (theme/layout/overlays/cards/navbars)** | **GAP → [#1913]** — baselines must be generated on the CI runner                                                                                                                     |
| **A11y sweep (axe: labels, contrast)**                | **GAP → [#1914]**; keyboard/focus/reduced-motion covered above                                                                                                                       |

Note: web is dark-only by design (`<html class="dark">`, `color-scheme: dark`); there is no
light theme to certify. Tablet rides the same responsive CSS as the two E2E viewports and
is exercised per-app in the M5.5 audit.

## apps/app — TanStack Start (Vercel, Build Output API)

Public routes: `/`, `/degens`, `/degens/:id`, `/games` (+ crypto-winter, mt-gawx,
smashers, wen-game), `/leaderboards`, `/mint-o-matic`, `/verification`, `/gm`.
Authenticated: `/dashboard` (overview, degens, gamer-profile, items, items/burner,
rentals) behind the private shell.

| State                                                             | Verification                                                                                                             |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Route surface / module graphs                                     | `route-surface.test.ts` (dashboard boundaries, search-state wiring), `route-behavior.test.ts`, `app-performance.test.ts` |
| Component behavior                                                | 97 unit test files (283 tests): contexts, hooks, providers, pages                                                        |
| Navigation / metadata                                             | `route-surface.test.ts` head/boundary assertions; TanStack route tree is generated and type-checked                      |
| Performance                                                       | benchmark route `app-degens`; chunk-granularity gap tracked in #1885                                                     |
| Authenticated dashboard, data, modal, sidebar states in a browser | **GAP → [#1915]** — no browser E2E infra and no PlayFab test identity                                                    |
| Screenshots                                                       | **GAP → [#1913]**                                                                                                        |
| A11y sweep                                                        | **GAP → [#1914]**; primitive-level a11y is pinned by `packages/ui` tests the app consumes                                |

## apps/smashers — Astro SSR + OAuth

Public: `/`, 404. Store redirects: `/android/*`, `/ios/*`, `/epic/*`, `/steam/*`.
Authenticated/API: `/api/auth/*` (OAuth round-trip), `/api/playfab/*` (11 endpoints),
`/api/edge-geo`. Invites: `/invite/:refcode`.

| State                         | Verification                                                                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Public render                 | benchmark route `smashers-home`; `smashers-runtime.test.ts`, `smashers-assets.test.ts`, `video-delivery.test.ts`                     |
| API route handlers            | `oauth-flow.test.ts` (OAuth state round-trip), `session.test.ts`, `store-links.test.ts`; route-surface pins the playfab endpoint set |
| Middleware / edge             | `smashers-runtime.test.ts` + `redirect-surface.test.ts`                                                                              |
| Authenticated browser session | **GAP → [#1915]** (same PlayFab identity need)                                                                                       |
| Screenshots / a11y sweep      | **GAP → [#1913] / [#1914]**                                                                                                          |

## apps/docs — Astro + Starlight (static)

3 route pages + 27 MDX content pages (Starlight).

| State                      | Verification                                                          |
| -------------------------- | --------------------------------------------------------------------- |
| Routes / sidebar / routing | `docs-routing.test.ts`, homepage unit test                            |
| Media policy               | `docs-media-policy.test.ts`                                           |
| Performance                | benchmark route `docs-overview` (best in matrix: 408 ms LCP, 0.34 MB) |
| Screenshots / a11y sweep   | **GAP → [#1913] / [#1914]**                                           |

## apps/api — contract-backend (Vercel functions)

Covered by `api-deployment-packaging.test.ts`, the integration test, and smoke checks;
out of M5.1's UI matrix scope but listed for completeness.

## Gap issues

| Issue                                                                 | Scope                                                                                                                                                                          |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [#1913](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1913) | Visual screenshot baselines (theme, layout, overlays, cards, navbars, sidebars, filters, dialogs, media, profile/auth) — must be generated on the CI runner, not a dev machine |
| [#1914](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1914) | Automated axe a11y sweep (labels, contrast) across all four apps; keyboard/focus/semantics/reduced-motion are already covered above                                            |
| [#1915](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1915) | Browser regression coverage for apps/app and the authenticated smashers state: E2E infra plus a PlayFab test identity                                                          |

## Certification statement

Automated verification covers every web content route (crawl + canonicals + per-page module
graphs), web navigation/keyboard/reduced-motion/mobile-disclosure in a real browser, every
smashers API route handler and OAuth round-trip, docs routing and media policy, app module
graphs and 283 component tests, and all four apps' performance budgets. The three gaps
above are tracked; until they close, the matrix is certified with those exceptions stated
rather than waived.
