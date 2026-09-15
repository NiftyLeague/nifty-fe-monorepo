# SolidJS migration — performance comparison

Synthetic lab data comparing the pre-migration React tree (label
`solid-baseline`, captured at `92d7ddd18`) against the post-migration Solid
tree (label `solid-post-migration`). Both sides ran the same
`scripts/lighthouse-benchmark.mjs` harness: Chrome headless, DevTools CDP
throttling (mobile: 150ms RTT / 1.6Mbps / 4x CPU; desktop: 40ms / 10Mbps / 1x),
3 runs per route per form factor, median reported. Not a substitute for field
RUM.

Raw data: `benchmarks/results/lh-{app}-solid-{baseline,post-migration}-2026-09-15.json`.

## Lighthouse (LCP median, ms)

### apps/web (17 routes, static)

| Route | Form | Perf score | LCP before | LCP after | Δ |
| --- | --- | --- | --- | --- | --- |
| / | mobile | 98 → 100 | 1797 | 901 | **−896** |
| / | desktop | 75 → 81 | 2482 | 2315 | −167 |
| /careers | mobile | 100 → 100 | 1537 | 816 | **−722** |
| /degens | desktop | 65 → 90 | 5827 | 1957 | **−3870** |
| /disclaimer | mobile | 100 → 100 | 1463 | 819 | **−644** |
| /games | mobile | 88 → 98 | 1534 | 2375 | +840 |
| /niftyworld | desktop | 65 → 83 | 6074 | 1953 | **−4122** |
| /overview | mobile | 97 → 99 | 2425 | 1986 | −439 |
| /privacy-policy | mobile | 100 → 100 | 1424 | 811 | **−613** |
| /roadmap | mobile | 93 → 96 | 2903 | 2616 | −288 |
| /team | desktop | 90 → 99 | 1464 | 804 | **−660** |
| /compete-and-earn | mobile | 62 → 76 | 7248 | 6192 | **−1055** |

Regressions (desktop only, media-heavy routes): `/community` 88 → 79
(1600 → 3272ms), `/compete-and-earn` 81 → 73 (2183 → 6524ms), `/lore` 84 → 77
(1487 → 3005ms). These routes load large animated artwork; the Solid islands
changed hydration timing, which moved which resource wins the LCP race. Follow-up:
audit the deferred media boundaries on those three routes.

### apps/smashers (SSR; only `/` is servable without the Vercel runtime)

| Route | Form | Perf score | LCP before | LCP after | Δ |
| --- | --- | --- | --- | --- | --- |
| / | mobile | 95 → 100 | 2275 | 641 | **−1634** |
| / | desktop | 77 → 100 | 2281 | 600 | **−1681** |

`/loot`, `/login`, `/profile` are server-rendered through the Vercel function;
they were benchmarked in the baseline but cannot be served by a static file
server locally, so the post-migration pass covers `/` only.

### apps/docs (static, 55 pages)

| Route | Form | Perf score | LCP before | LCP after | Δ |
| --- | --- | --- | --- | --- | --- |
| / | mobile | 100 → 100 | 1610 | 825 | **−785** |
| / | desktop | 92 → 99 | 1782 | 791 | **−991** |
| /overview/intro | mobile | 99 → 100 | 2175 | 815 | **−1360** |
| /overview/roadmap | mobile | 97 → 100 | 2588 | 811 | **−1777** |
| /overview/nifty-dao/nftl/supply | desktop | 84 → 99 | 2791 | 774 | **−2018** |

Regression: `/overview/nfts/nifty-marketplace/comics` mobile CLS 1.14 (perf
100 → 75 mobile, 86 → 74 desktop). LCP itself improved (855 → 865ms mobile);
the score drop is layout shift from the below-fold comic grid + mermaid
rendering. Follow-up: reserve space for the comic thumbnails before their
lazy variants load.

## Client JavaScript (bytes emitted to the static output)

| App | Before (React) | After (Solid) | Δ |
| --- | --- | --- | --- |
| apps/web | 1,696,301 | 1,511,410 | **−184,891 (−10.9%)** |
| apps/smashers (client/) | 732,411 | 509,115 | **−223,296 (−30.5%)** |
| apps/docs | 5,649,604 | 5,456,024 | −193,580 (−3.4%) |

docs' JS is dominated by the mermaid bundle and pagefind-era assets; the
framework share is small, hence the modest delta.

## Build time (local, warm cache)

| App | Before | After |
| --- | --- | --- |
| apps/web (17 pages) | 6.3s pages / 10.1s wall | 12.2s pages / 15.8s wall |
| apps/docs (55 pages) | 6.9s | 7.3s |
| apps/smashers (SSR) | 16.4s server | 18.5s server |

web's build is slower with Solid islands: each `client:*` island is compiled
through vite-plugin-solid (babel) in addition to Astro's own transforms, and
the islands are now real components instead of mostly-static React shells.
The runtime wins above are the trade. docs and smashers are within noise.

## apps/app

Not benchmarked: the app is still on React (see the migration notes in the PR
description). Its Lighthouse baselines (`lh-app-solid-baseline-*.json`) are
recorded for the follow-up port.
