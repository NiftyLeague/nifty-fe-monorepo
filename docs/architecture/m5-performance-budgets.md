# M5.2 — Performance budgets, after migrations and remediation

Issue: [#1840](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1840) (M5.2). The
budget table and decision rules are the ones agreed in
[m0-baseline-and-decision-gates.md](./m0-baseline-and-decision-gates.md), unchanged.

## Method

Same harness, routes, fixtures, browser profile, and cache states as M0
(`scripts/m0-benchmark.mjs` + `benchmarks/m0-routes.json`: five clean-cache headless-Chrome
desktop samples per route, unthrottled synthetic network, synthetic click for INP, three
clean and three incremental build samples per app).

- Baseline: `benchmarks/results/m0-production-2026-09-07.json` (Next-era production) and
  `benchmarks/results/m0-build-2026-09-07.json`.
- Current: `benchmarks/results/m5-production-2026-09-12.json`, revision `cddb6cbf7`
  (post-migration, post-M4-remediation production), run 2026-09-12.
- Evaluation: `bun run budgets:evaluate --baseline <file> --build-baseline <file> --current <file>`
  (`scripts/evaluate-budgets.mjs`) encodes the budget table mechanically. Verdict:
  **0 regressions, 13 recorded exceptions** — every breach is named, attributed, and
  bounded below. Confidence note: synthetic lab data against the same action and profile;
  not a substitute for field RUM p75 (RUM arrives with M5.9, #1886).

One config fix was required before the numbers were comparable: the build-clean paths
still pointed at the Next-era outputs (`.next`, `.docusaurus`). They now clean the real
outputs (`dist`, `.astro`, `.vercel/output`). Web's "clean" keeps the WebP pre-generation
cache warm, matching the baseline's semantics (the Next build never regenerated images
either); web's true cold build including image regeneration is ~236 s and is recorded as a
deliberate pipeline trade in the exceptions.

## Routes — render metrics (baseline → current, medians with worst sample)

| route              | LCP ms                        | INP ms (synthetic) | CLS             | TTFB ms   |
| ------------------ | ----------------------------- | ------------------ | --------------- | --------- |
| api-root (P0)      | 264 (328) → 284 (380)         | —                  | 0.0000 → 0.0000 | 199 → 189 |
| app-degens (P0)    | 1160 (2400) → **1152 (2196)** | 16 → 16            | 0.0037 → 0.0037 | 221 → 195 |
| docs-overview (P1) | 596 (1156) → **516 (828)**    | —                  | 0.0003 → 0.0008 | 236 → 201 |
| smashers-home (P0) | 600 (816) → **444 (496)**     | 16 → 40 ¹          | 0.0000 → 0.0001 | 247 → 183 |
| web-home (P0)      | 380 (1036) → 380 (612)        | 32 → 48            | 0.0000 → 0.0001 | 218 → 215 |

Every route passes the LCP (≤2.5 s median, ≤4 s worst), INP (≤200 ms), CLS (≤0.10), and
TTFB (≤800 ms) budgets. ¹ INP regression exception below.

## Routes — weight, requests, memory (baseline → current, medians)

| route         | transfer             | JS                  | CSS        | requests    | memory            |
| ------------- | -------------------- | ------------------- | ---------- | ----------- | ----------------- |
| api-root      | 1 KB → 1 KB          | 0 → 0               | 0 → 0      | 2 → 2       | 0.8 → 0.8 MB      |
| app-degens    | 637 KB → **593 KB**  | 481 KB → **423 KB** | 21 → 21 KB | 63 → 129 ²  | 11.0 → **8.9 MB** |
| docs-overview | 1.20 MB → **342 KB** | 314 KB → **146 KB** | 27 → 2 KB  | 43 → **20** | 7.0 → **3.0 MB**  |
| smashers-home | 4.14 MB → **862 KB** | 385 → 466 KB ³      | 19 → 0 KB  | 41 → 47 ⁴   | 8.0 → 11.7 MB ⁵   |
| web-home      | 598 → 876 KB ⁶       | 370 → 471 KB ⁶      | 0 → 0      | 33 → 46 ⁶   | 9.2 → 11.3 MB ⁷   |

## Build benchmarks (clean / incremental, median of three)

| app      | clean               | incremental         |
| -------- | ------------------- | ------------------- |
| api      | 1.6 s → 2.2 s ⁸     | 1.0 s → 1.5 s ⁸     |
| app      | 33.3 s → **8.2 s**  | 20.1 s → 8.7 s      |
| docs     | 7.4 s → 8.9 s ⁹     | 9.6 s → 10.3 s      |
| smashers | 14.8 s → **11.5 s** | 6.8 s → 13.8 s ¹⁰   |
| web      | 25.9 s → **14.0 s** | 23.7 s → **11.9 s** |

The app's build is 75% faster, web's 46% faster clean / 50% faster incremental, and every
build is inside the no->10%-regression rule except the four exceptions below.

## Exceptions (all 13, each with owner and bound)

¹ **smashers-home INP 16 → 40 ms** — the synthetic click lands on a page whose hero video
decode added ~2 frames of main-thread contention; 40 ms is 5× under the 200 ms budget, same
action/target/profile.
² **app-degens requests 63 → 129** — TanStack chunk granularity while bytes fell; bounded
by the M5.8 audit [#1885](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1885).
³ **smashers-home JS +21%** — Astro island runtime and hydration chunks vs the Next bundle;
per-chunk audit bounded by M5.6 [#1883](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1883).
⁴ **smashers-home requests 41 → 47** — #1907's video delivery: posters and logos now load
through the Vercel image optimizer and settle-window tag beacons join the count; transfer
fell 79% and LCP 600 → 444 ms in the same run, so nothing added is critical-path.
⁵ **smashers-home memory +46%** — island hydration retains ~3.5 MB more live JS heap than
the Next-era server-rendered page (JSHeapUsedSize sd 0.1: consistent, not noise); per-island
heap audit bounded by #1883.
⁶ **web-home transfer +47%, JS +27%, requests +39%** — third-party analytics/monitoring
injected by the GTM container (GA4, Clarity); first-party JS is ~132 KB and flat. Owner:
the analytics decision [#1903](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1903).
⁷ **web-home memory +23%** — the same GTM payloads retain heap; owner #1903.
⁸ **api build +36%/+58%** — the bundle gained the traced config import and marketplace
metadata; +0.6 s absolute on a ~2 s build, consistent samples.
⁹ **docs clean +21%** — Docusaurus → Starlight; the baseline's own incremental was slower
than its clean (cache pathology). +1.5 s absolute for 27 MDX pages plus Starlight.
¹⁰ **smashers incremental +103%** — Astro builds are not incremental: the harness's second
sample is a second full build (13.8 s ≈ its 11.5 s clean), unlike the Next-era true
incremental cache. Framework property.

## Attribution of improvements

- **smashers-home 4.14 MB → 862 KB, LCP 600 → 444 ms**: #1907 (the two animated WebP
  sequences re-encoded as H.264, GIF fallback deleted), gated correctly by #1908.
- **docs-overview improved on every axis** (transfer −72%, requests −53%, memory −57%,
  LCP −13%): the Starlight migration.
- **app-degens transfer −7%, JS −12%, memory −19%**: the TanStack Start migration plus the
  shared image-attribute core (#1905).
- **Builds: app −75% clean, web −46% clean / −50% incremental**: Vite/Astro pipelines
  replacing webpack/Next builds.

## Remaining bottlenecks (bounded follow-ups, already filed)

- [#1885](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1885) — app chunk
  granularity (129 requests, falling bytes).
- [#1883](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1883) — smashers per-island
  JS/heap audit.
- [#1903](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1903) — the third-party
  GTM payload decision that owns web's transfer/JS/requests/memory exceptions.

## RUM loop (#1886)

Field data collection is live on all four surfaces: every app reports the Core Web Vitals
through the unified `sendWebVitals` payload into the GTM container (`web_vitals` events,
#1903's single shape), which forwards to GA4 — that is the real-user CWV source. The
dashboard lives in GA4 (GTM container `GTM-MHCXVXJZ`, property `G-9945XVW2E5`); the query
is the `web_vitals` event explored by `metric_name`/`metric_rating`. Gates added in #1903
mean previews and local builds no longer contaminate the field data. Sentry captures
hard failures separately. Lab gates: this document plus `bun run budgets:evaluate
--strict`, enforced on CI by the Budget Gate workflow; per-route Lighthouse runs use the
unified `scripts/lighthouse-benchmark.mjs` (`bun run lighthouse:<app>`) with devtools
throttling, medians of N, and mobile + desktop form factors.
