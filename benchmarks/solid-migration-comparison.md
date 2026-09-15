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

| Route             | Form    | Perf score | LCP before | LCP after | Δ         |
| ----------------- | ------- | ---------- | ---------- | --------- | --------- |
| /                 | mobile  | 98 → 100   | 1797       | 901       | **−896**  |
| /                 | desktop | 75 → 81    | 2482       | 2315      | −167      |
| /careers          | mobile  | 100 → 100  | 1537       | 816       | **−722**  |
| /degens           | desktop | 65 → 90    | 5827       | 1957      | **−3870** |
| /disclaimer       | mobile  | 100 → 100  | 1463       | 819       | **−644**  |
| /games            | mobile  | 88 → 98    | 1534       | 2375      | +840      |
| /niftyworld       | desktop | 65 → 83    | 6074       | 1953      | **−4122** |
| /overview         | mobile  | 97 → 99    | 2425       | 1986      | −439      |
| /privacy-policy   | mobile  | 100 → 100  | 1424       | 811       | **−613**  |
| /roadmap          | mobile  | 93 → 96    | 2903       | 2616      | −288      |
| /team             | desktop | 90 → 99    | 1464       | 804       | **−660**  |
| /compete-and-earn | mobile  | 62 → 76    | 7248       | 6192      | **−1055** |

Follow-up fixed (label `solid-post-followups`, same harness): the three
media-heavy desktop regressions were LCP-discovery failures — the LCP-winning
resource was lazy or behind a deferred island. Fixes: `priority` on the
`/community` Earth banner, `fetchpriority="high"` on the `/lore` background,
and the `/compete-and-earn` Mint-O-Matic hero rendered eagerly instead of
behind `DeferredSection` (its image was not in the initial document at all).

| Route                     | Perf before → regression → fixed | LCP before | LCP regressed | LCP fixed |
| ------------------------- | -------------------------------- | ---------- | ------------- | --------- |
| /community desktop        | 88 → 79 → 87                     | 1600       | 3272          | 2205      |
| /compete-and-earn desktop | 81 → 73 → 86                     | 2183       | 6524          | 2218      |
| /lore desktop             | 84 → 77 → 76                     | 1487       | 3005          | 3108      |

`/lore` residual: the 206KB q60 full-viewport background is now
eager+high+preloaded; the remaining LCP is image transfer time under the
throttled profile, not a discovery issue.

### apps/smashers (SSR; only `/` is servable without the Vercel runtime)

| Route | Form    | Perf score | LCP before | LCP after | Δ         |
| ----- | ------- | ---------- | ---------- | --------- | --------- |
| /     | mobile  | 95 → 100   | 2275       | 641       | **−1634** |
| /     | desktop | 77 → 100   | 2281       | 600       | **−1681** |

`/loot`, `/login`, `/profile` are server-rendered through the Vercel function;
they were benchmarked in the baseline but cannot be served by a static file
server locally, so the post-migration pass covers `/` only.

### apps/docs (static, 55 pages)

| Route                           | Form    | Perf score | LCP before | LCP after | Δ         |
| ------------------------------- | ------- | ---------- | ---------- | --------- | --------- |
| /                               | mobile  | 100 → 100  | 1610       | 825       | **−785**  |
| /                               | desktop | 92 → 99    | 1782       | 791       | **−991**  |
| /overview/intro                 | mobile  | 99 → 100   | 2175       | 815       | **−1360** |
| /overview/roadmap               | mobile  | 97 → 100   | 2588       | 811       | **−1777** |
| /overview/nifty-dao/nftl/supply | desktop | 84 → 99    | 2791       | 774       | **−2018** |

Regression: `/overview/nfts/nifty-marketplace/comics` mobile CLS 1.14 (perf
100 → 75 mobile, 86 → 74 desktop). Fixed in `solid-post-followups`: the comic
table's columns auto-resized as lazy thumbnails loaded, and inline `<video>`
elements had no intrinsic size until metadata arrived. `table-layout: fixed`
now applies to image grids (`theme.css`) and every docs video carries its
real `aspect-ratio`. Re-measured: mobile CLS 1.14 → 0.138 (perf 75 → 93),
desktop CLS → 0.189 (perf 74 → 78). Residual desktop CLS is row-height
settling from the lazy thumbnails.

## Client JavaScript (bytes emitted to the static output)

| App                     | Before (React) | After (Solid) | Δ                     |
| ----------------------- | -------------- | ------------- | --------------------- |
| apps/web                | 1,696,301      | 1,511,410     | **−184,891 (−10.9%)** |
| apps/smashers (client/) | 732,411        | 509,115       | **−223,296 (−30.5%)** |
| apps/docs               | 5,649,604      | 5,456,024     | −193,580 (−3.4%)      |

docs' JS is dominated by the mermaid bundle and pagefind-era assets; the
framework share is small, hence the modest delta.

## Build time (local, warm cache)

| App                  | Before                  | After                    |
| -------------------- | ----------------------- | ------------------------ |
| apps/web (17 pages)  | 6.3s pages / 10.1s wall | 12.2s pages / 15.8s wall |
| apps/docs (55 pages) | 6.9s                    | 7.3s                     |
| apps/smashers (SSR)  | 16.4s server            | 18.5s server             |

web's build is slower with Solid islands: each `client:*` island is compiled
through vite-plugin-solid (babel) in addition to Astro's own transforms, and
the islands are now real components instead of mostly-static React shells.
The runtime wins above are the trade. docs and smashers are within noise.

## apps/app

Now ported to SolidJS: TanStack Start + Solid Router/Query, framework-agnostic
`@wagmi/core` bindings via `src/runtime/wagmi.ts`, Kobalte via `@nl/ui`. React,
`react-dom`, `wagmi`, and all React testing packages are removed from the
package. Typecheck, lint, build, and the full unit suite (316 tests) are green.

Measured locally against the Nitro preview server (`bun run start` on the
`.vercel` Build Output; `lh-app-solid-final-2026-09-15.json` is canonical —
earlier post-migration runs were taken on builds where hydration or wallet
chunks were broken, which shortened LCP artificially on some routes). The
follow-up pass fixed a critical porting bug: the root document was missing
`<HydrationScript />`, so `hydrate()` threw on every route and islands never
hydrated.

| Route           | Form    | Perf before → after | LCP before | LCP after | Δ         |
| --------------- | ------- | ------------------- | ---------- | --------- | --------- |
| /               | mobile  | 87 → 77             | 2931       | 5224      | +2293     |
| /world          | mobile  | 74 → 81             | 5555       | 4386      | **−1169** |
| /games          | mobile  | 87 → 77             | 2920       | 5265      | +2345     |
| /games/smashers | mobile  | 61 → 62             | 13128      | 13993     | +865      |
| /games/mt-gawx  | mobile  | 62 → 62             | 14325      | 14058     | −267      |
| /degens         | mobile  | 59 → 67             | 13969      | 13439     | −530      |
| /leaderboards   | mobile  | 89 → 79             | 2645       | 1939      | **−706**  |
| /mint-o-matic   | mobile  | 85 → 84             | 2652       | 1968      | **−684**  |
| /verification   | mobile  | 59 → 56             | 15868      | 10671     | **−5197** |
| /               | desktop | 56 → 59             | 11980      | 11330     | −650      |
| /world          | desktop | 60 → 66             | 4906       | 3990      | **−916**  |
| /games          | desktop | 56 → 59             | 12042      | 11323     | −719      |
| /games/smashers | desktop | 60 → 65             | 12937      | 13727     | +790      |
| /games/mt-gawx  | desktop | 60 → 65             | 14540      | 13680     | −860      |
| /degens         | desktop | 56 → 59             | 15133      | 14430     | −703      |
| /leaderboards   | desktop | 70 → 82             | 2610       | 1841      | **−769**  |
| /mint-o-matic   | desktop | 67 → 76             | 2613       | 1842      | **−771**  |
| /verification   | desktop | 55 → 56             | 15731      | 10375     | **−5356** |

Caveats: local preview lacks `VITE_WALLET_CONNECT_PROJECT_ID`, so the wallet
provider boundary reports "could not be loaded" on every route (same in the
baseline run; the dashboard fixture path is now fixed so the E2E suite passes
without wallet env).

Residual regression: `/` and `/games` LCP ~+2.3s on mobile. The LCP image
(46KB flagship poster) is eager+high+preloaded; the delta is bandwidth
contention with the initial module chunk graph under 1.6Mbps/150ms-RTT
throttling (~78 requests of mostly 1KB route chunks). A rolldown
`codeSplitting` group that merged tiny shared modules recovered ~1.3s but
was reverted: merging across the route-split graph created circular chunk
imports that broke ESM eval order at runtime (viem `LruMap` "not a
constructor"). Closing the gap needs per-route chunk coalescing upstream or
fewer route-level modules, not a bundler hack.
