# M5.5–M5.8 — Per-app optimization audits

Issues: [#1882](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1882) (web),
[#1883](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1883) (smashers),
[#1884](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1884) (docs),
[#1885](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1885) (app).

Method: the shared harness (`bun run lighthouse:<app>`, devtools CDP throttling, medians of
five, mobile + desktop) against the app's production-equivalent delivery surface, plus the
CWV/weight medians from `benchmarks/results/m5-production-2026-09-12.json` and the cache
contracts from `test/contract/cache-surface.test.ts`. Evidence files:
`benchmarks/results/lh-*.json`. Lighthouse navigation runs record LCP/TBT/CLS/FCP/SI;
interaction timing is kept as an explicit `inpMs` field and is measured by the CDP vitals
harness when an interaction profile is available.

## M5.5 — apps/web (#1882)

Completed 2026-09-13. The initial gaps closed in #1936 (roadmap `translate3d` milestones,
axe sweep, `fetchpriority` LCP preloads) are retained; the closeout run adds the measured
fixes below and records the remaining gaps as accepted exceptions with their root causes.
Closeout evidence: `benchmarks/results/lh-web-m5.5-closeout-2026-09-14.json` (14 routes,
mobile + desktop, median of five against the Worker-equivalent delivery surface; previous
capture kept in `lh-web-m5.5-current-2026-09-13.json` for comparison).

Closeout medians (mobile / desktop performance, with the previous capture in parentheses):

| route             | mobile    | desktop | desktop LCP ms |
| ----------------- | --------- | ------- | -------------- |
| /                 | 100 (100) | 71 (81) | 4618           |
| /games            | 96 (96)   | 76 (80) | 4182           |
| /degens           | 99 (99)   | 68 (80) | 4979           |
| /roadmap          | 96 (95)   | 89 (82) | 1859           |
| /overview         | 99 (99)   | 86 (77) | 2361           |
| /community        | 100 (99)  | 94 (76) | 1200           |
| /compete-and-earn | 74 (75)   | 84 (72) | 2302           |
| /niftyworld       | 99 (99)   | 68 (79) | 4912           |
| /lore             | 100 (100) | 92 (75) | 783            |
| /careers          | 100 (100) | 86 (86) | 1849           |
| legal + /team     | 100       | 98–99   | 778–800        |

Accessibility is 100 on every route except `/degens` mobile at 98 (`heading-order`: the
shared `HomeDegensSection` renders its `h2` above the page's own `h1`; a heading-level
decision for the shared section is the follow-up). `best-practices` is 100 everywhere
except the two YouTube-embed routes noted below.

Performance fixes (each driven by a per-route LCP breakdown, not guesses):

- `/compete-and-earn` splash logo was the LCP candidate on both form factors and shipped
  `loading="lazy"` — a ~3.5-second discovery delay before its request even started. It is
  now `priority` (eager + `fetchpriority=high`, preload-injected at build).
- `/overview` LearnCard backgrounds 2–4 are inside the initial desktop viewport but lazy;
  card 2 was the throttled LCP after a ~2.4 s discovery delay. All four are now eager
  (card 1 keeps the single `priority` hint).
- The home hero character mural is as large as the backdrop in the first desktop viewport;
  lazy discovery made it the throttled LCP 0.6 s late with a 3.8 s serialized fetch. It now
  renders eager with `fetchpriority=high` behind an art-directed `<picture>`, and
  `finalize-static.mjs` injects its desktop-scoped preload from the `<source>` candidates
  (`media="(min-width: 769px)"` keeps it off the mobile request path).
- `/compete-and-earn` shipped its YouTube embed in the initial document (`loadImmediately`).
  Measured cost: ~1.1 MB of third-party player assets racing the page at mobile throttle,
  with the player's internal poster becoming a ~7 s LCP (`requestDiscoverable: false` —
  Lighthouse cannot even see it from the document). The embed is deferred behind the shared
  skeleton facade again and moved to `youtube-nocookie.com`; the e2e now pins the
  skeleton-in-document, iframe-on-hydration behavior.

Accepted exceptions (documented, not waived silently):

- Four many-request routes (`/`, `/games`, `/degens`, `/niftyworld`) show desktop
  performance 68–76 with LCP ≈ 4.2–5.0 s in this capture while mobile passes 96–100 on the
  same pages. The mechanical causes this audit found there are gone — the LCP candidates now
  pass every discovery check (eager, in-document, priority-hinted where appropriate) — and
  the LCP samples within the capture are tight (±15 ms), so this is not run noise. It is the
  deviation between Lighthouse's devtools emulation on this machine and a plain CDP
  reproduction: repeating the identical throttling (10 Mbps / 40 ms / 1× over CDP) in a
  Playwright run paints the same `/degens` backdrop at ~670 ms, and the previous capture of
  the same elements landed at 2.2–2.3 s LCP. The closeout captures ran while another agent
  session held ~99% CPU. First-party levers that remain are bounded and filed as follow-ups
  rather than slipped in: request count on the media-heavy routes, the `/games` lobby video
  poster (135 KB original, ~113 KB over its rendered size, served outside the variant
  manifest), and the oversized originals the delivery insight still flags on `/degens`
  (218 KiB) and `/niftyworld` (438 KiB).
- `/compete-and-earn` mobile LCP remains ~7 s: the LCP element is the third-party player
  inside an embed that genuinely sits above the fold on the compact layout (top 164 px at
  412×823), so no honest intersection trick defers it. First-party content paints at
  FCP 0.8 s / SI 2.5 s. A click-to-play facade (poster + button, iframe only on demand) is
  the follow-up that would clear it; it needs a shared-component decision, so it is filed
  rather than slipped into this audit.
- `best-practices` 96 on `/compete-and-earn` and `/games` mobile: the YouTube player's own
  cookie access is flagged by the `inspector-issues` audit even through
  `youtube-nocookie.com`. Third-party embed behavior, same class as M5.6's trailer-dialog
  exception.
- `/lore` `image-aspect-ratio` (desktop 96): the full-bleed background intentionally uses
  `object-fit: fill` over a content-driven box; the mobile breakpoint already pins the
  swapped source's ratio (#1936). Distortion-free rendering would change the artwork, so it
  stays an explicit design exception.

Accessibility: the axe sweep (`e2e/a11y.e2e.ts`, zero serious/critical across all 14
indexable routes) is joined by a completed keyboard-only pass: a skip link is now the first
tab stop on every marketing page (reveals on focus, targets the `<main>` landmark), all
three nav disclosures open and expose their links from the keyboard, and focus walks every
route to a clean wrap without traps (14/14 routes). The cold-load tab-order E2E pins the
skip link as the walk's first stop.

SEO: the built documents carry unique titles, descriptions, canonicals and full
OG/Twitter surfaces for all 14 routes (re-verified against the closeout build). Production
probes on 2026-09-13 confirm the deployed state: sitemap.xml lists exactly the 14 indexable
routes; robots.txt disallows `/shells/`, `/invite/` and `/party/` and links the sitemap;
malformed `/gltf/*` paths return 404 while numeric IDs render (the numeric-only rewrite from
#1936 is live); direct `/shells/*` documents serve 200 with `<meta name="robots"
content="noindex,nofollow">`; `/party/*` returns 404.

Caching: immutable `/_astro/*` + `/__images/*`, refresh policy on media, and HTML on the
revalidating default are pinned by `cache-surface.test.ts`. Production curl spot checks on
2026-09-13 confirmed Vercel HTML revalidation, gzip HTML, immutable hashed JavaScript, and
WebP media with hit/miss changes. The Worker contract additionally pins no-store referral
shells, one-hour shared GLTF shell responses, and deep-link robots headers. **Worker cutover
decision: formally parked** — the `nifty-league-web-astro` Worker is deliberately unbound
(`wrangler.jsonc` comment), production serves from Vercel, and the two delivery paths
configure headers differently; revisit only if the cutover is rescheduled.

## M5.6 — apps/smashers (#1883)

Completed 2026-09-13 against production (`niftysmashers.com`), with the fresh
median-of-five capture in `benchmarks/results/lh-smashers-m5.6-audit-2026-09-13.json`
(4 routes × mobile + desktop) and the live curl/trace captures recorded below. The
fixes that came out of the audit are in the PR closing #1883; numbers marked
"pre-fix" describe the deployed state they were measured against.

### Performance

| route    | perf m / d (median of 5) | LCP m / d (ms) | TBT m / d (ms) |
| -------- | ------------------------ | -------------- | -------------- |
| /        | 95 / 76                  | 2712 / 2710    | 98 / 0         |
| /loot    | 96 / 98                  | 954 / 857      | 212 / 0        |
| /login   | 78 / 67 (pre-fix)        | 4197 / 4133    | 120 / 0        |
| /profile | 72 / 64 (pre-fix)        | 4793 / 4705    | 168 / 0        |

- **Auth surfaces (fixed).** `/login` and `/profile` were `client:only` islands:
  nothing contentful painted until hydration finished — the skeleton fallback is a
  colored box, which does not count as a contentful paint — so FCP/LCP sat at
  hydration time (~3.5–4.8 s on every sample, both form factors). The surfaces are
  SSR-safe (deterministic logged-out first render; the session arrives client-side
  through SWR), so they now ship `client:load` and their markup is in the document.
  Local SSR smoke of the built function confirms the form renders server-side; the
  post-deploy re-measure is `bun run lighthouse:smashers --base-url
https://niftysmashers.com --label m5.6-postfix --runs 5`.
- **`/loot` last point.** Desktop is 98 with FCP = LCP = SI ≈ 0.9 s (the page is
  prerendered with zero islands). Mobile loses its points to TBT (203–264 ms) on a
  page with no hydration: the main-thread cost is the third-party telemetry — the
  deferred activation schedule uses `delay: 0`, which fires at the first idle
  callback (~0.5 s), so GTM → gtag/Clarity + Sentry + web-vitals execute inside
  the Lighthouse trace window at 4× CPU. This is the shared telemetry schedule
  (`packages/ui` deferred-activation consumers), so it is recorded as a cross-app
  candidate rather than changed under web/docs in this audit.
- **Home, desktop 76 — accepted exception.** The LCP (hero wordmark) passes every
  discovery check (in-document preload with `fetchpriority=high`, matched
  `imagesrcset`/`srcset`, eager), TTFB is 179 ms, TBT is 0–4 ms and FCP 0.8 s; the
  2.6 s "resource load duration" is Lighthouse's devtools emulation serializing a
  many-request page (fonts + two eager low-priority backdrops + islands). The real
  levers left are request count (the eager console-game and hero-background
  backdrops, ~200 KB combined at 1920w) and the width-ladder granularity — both
  bounded, neither worth the UX trade inside this audit.
- **Hero `sizes` (fixed).** The wordmark renders at `width: 400px; max-width:
70vw` but declared `sizes="… 824px"`, so desktop downloaded the 750w rung for a
  400px box (~40 KB flagged oversized). `sizes` now describes the CSS box
  (`(max-width: 571px) 70vw, 400px`); because the ladder caps at 640w for that box
  and the 640w/750w encodes are nearly identical at q85, the byte win is ~1.5 KB —
  the fix is for correctness (hint describes the rendered candidate) more than
  for bytes.
- **Island payload drill-down.** Home: 5 islands, ~7 KB of island code total, all
  below-the-fold sections `client:visible` with dynamic `import()` of the section
  components; shared chunks (react/react-dom ~58 KB raw, Sentry ~49 KB via the
  deferred telemetry) load outside the HTML graph. `/loot`: zero islands, a 291 KB
  prerendered document (~35 KB on the wire). `/login`: one island chunk, 132 KB
  raw / 42 KB brotli (the PlayFabAuthForm graph). The remaining server-render-more
  candidates were exactly the auth surfaces — now done.
- **Image optimizer path.** `/_vercel/image` serves genuinely resized rungs
  (640w is 640×444, 55 KB) and passes the original through byte-identical for
  off-ladder/over-width requests; widths outside the ladder 400. Content
  negotiation returns **webp, not AVIF, for webp sources** (Vercel optimizer
  behavior — the sources are already webp, so there is nothing to win); the
  audit's "sized AVIF variants" therefore resolves as sized webp variants
  everywhere. The hero preload's `imagesrcset`/`imagesizes` match the `<img>`
  exactly (pinned by `Image.test.tsx`).
- **SSR latency.** TTFB over 20 warm samples each: `/` p50 250 ms / p95 302 ms;
  `/loot` 233/299 (edge `x-vercel-cache: HIT` — prerendered); `/login` 247/313;
  `/profile` 240/293 (302); `/sitemap.xml` 214/283 (`s-maxage=3600` consumed by
  the CDN, stripped client-side); `/api/edge-geo` 223/261. No per-request session
  or telemetry work runs in middleware (it only wraps Sentry error capture).

### Accessibility

- New browser suite `apps/smashers/e2e/a11y.e2e.ts` (production base URL): axe
  floor of zero serious/critical per public route, the unauthenticated
  `/profile → /login` redirect, a keyboard-only pass over the home dialogs and the
  sign-in form. All green against the branch build; the authenticated `/profile`
  surface (tabs, panels) remains bounded by the #1915 test-identity dependency.
- Findings fixed: the loot tables scrolled in fixed-height containers that no
  keyboard user could scroll (now named focusable regions); the auth form's
  view-switch controls were bare anchors — keyboard-unreachable, and the accent
  color missed AA on the backdrop (now real buttons on the muted foreground,
  matching the passing label color).
- **Trailer dialog exception.** When the trailer opens, focus moves into the
  YouTube iframe and the player consumes Escape — closing uses the focusable
  close control instead. Third-party embed behavior, same class as the web axe
  iframe exclusion.
- #1869's fixes (main landmark, heading order, AA rarity colours, viewport
  `maximum-scale`) verified holding on the live routes and pinned by the
  contract tests.

### SEO

- Sitemap/robots are generated endpoints. The audit removed `/login` and
  `/profile` from the sitemap — both render `noindex` via `Auth.astro`, and
  submitting them produced the Search Console "Submitted URL marked noindex"
  contradiction. The sitemap↔metadata agreement (plus route backing and unique
  titles/canonicals) is pinned by the new `test/contract/smashers-seo.test.ts`.
- Head surface: canonical, description, keywords, full OG set and Twitter cards
  render per route; `/`, `/loot` carry indexable titles, `/login`, `/profile`,
  `/404` are noindex; robots disallows `/api/` and `/invite/`. Lighthouse's SEO 61
  on the auth routes is the `is-crawlable` penalty for that intentional noindex —
  correct behavior, not a finding.
- No stray static robots/sitemap exists in `apps/smashers/public/` to shadow the
  generated endpoints.

### Caching

- Live curl evidence per class (captured 2026-09-13): `/_astro/*` →
  `public, max-age=31536000, immutable` (declared in vercel.json, contract-pinned);
  HTML SSR routes → `public, max-age=0, must-revalidate` with every request a
  function invocation (MISS), correct for authenticated SSR; `/loot` and
  `/sitemap.xml`/`robots.txt` → edge HITs (`s-maxage=3600` on the endpoints);
  store deep links and auth redirects → platform default on 302/307.
- **Fixed:** `public/` media (`/img/*`, `/icons/*`, `/video/*`, `/favicon/*`) rode
  the platform default; they now carry web's refresh policy
  (`max-age=86400, stale-while-revalidate=604800`) — these names are unhashed, so
  immutable was never an option. Session-bound API payloads (the shared `json()`
  helper, `edge-geo`) now send explicit `no-store` — Vercel's injected default is
  `public`, which invites shared-cache storage of per-user/per-geo responses.
  Both pinned in `cache-surface.test.ts`.
- **`NEXTAUTH_SECRET` retirement: done.** The audit doc previously recorded this
  as blocked on a production-env owner. Executed as the documented sequence:
  `SESSION_SECRET` added to the Vercel project (production/preview/development,
  each environment's existing secret value — zero session invalidation, the code
  already preferred the new name), then `NEXTAUTH_SECRET` removed from all three
  environments, then the fallback deleted from `session.ts`/`oauth.ts` with the
  turbo env inputs, `.env.example`, and contract tests updated. The running
  deployment is unaffected until the next deploy, which reads only
  `SESSION_SECRET`.

### Accepted exceptions

| Exception                                                                                  | Where                                          | Bound                                                                                                           |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Best-practices 77 — third-party cookies from the GTM container (GA4, Clarity, DoubleClick) | every smashers route                           | Identical on web's routes; the analytics stack is the #1903 decision                                            |
| Desktop home perf 76 — Lighthouse devtools serialization of a many-request page            | `/` desktop                                    | LCP discovery/priority checks all pass; levers (eager backdrops, ladder granularity) bounded with UX trade-offs |
| Trailer Escape swallowed by the YouTube iframe                                             | `/` trailer dialog                             | Close control is keyboard-reachable; third-party embed internals                                                |
| Telemetry `delay: 0` fires at first idle (~0.5 s), inside the load window                  | shared primitive (smashers + web + docs + app) | Cross-app change; recorded as the `/loot` mobile TBT source                                                     |
| Authenticated `/profile` axe/tabs sweep                                                    | `/profile`                                     | Blocked on the #1915 PlayFab test identity                                                                      |

## M5.7 — apps/docs (#1884)

Deep-dive app for the M4.0 dedup work. Measured with the shared harness at medians of five
against production, before the fixes (`lh-docs-production-median5-2026-09-13.json`, the
pre-fix deploy with the corrected route list) and after (`lh-docs-production-postfix-2026-09-13.json`,
captured once #1933's deploy was live, with `scripts/cache-probe.mjs` passing all four
route classes). Branch-build medians of three (`lh-docs-local-m57-v2-2026-09-13.json`)
guided the work; the preview server's uncompressed HTML caps local desktop numbers, so
production is the evidence of record.

| route                                   | perf mobile (before → after) | perf desktop (before → after) | a11y (before → after) |
| --------------------------------------- | ---------------------------- | ----------------------------- | --------------------- |
| /                                       | 98 → 100                     | 86 → 91                       | 100 → 100             |
| /overview/intro                         | 100 → 100                    | 91 → 91                       | 96 → 100              |
| /overview/roadmap                       | 95 → 97                      | 82 → 84                       | 96 → 100              |
| /overview/nifty-dao/nftl/supply         | 94 → 99                      | 90 → 90                       | 96 → 100              |
| /overview/nfts/nifty-marketplace/comics | 100 → 99                     | 83 → 83                       | 96 → 100              |

Harness correction: the routes file listed `/nftl/supply` and `/marketplace/comics`, which
404 on the docs domain — the #1923 capture recorded them as "WAF-blocked", but they were
simply wrong slugs (the real routes are `/overview/nifty-dao/nftl/supply` and
`/overview/nfts/nifty-marketplace/comics`). Fixed in `scripts/lighthouse-routes/docs.json`.

Performance: the roadmap poster — the route's LCP — is preloaded from the head with an
`imagesrcset` resolved per-width through the same shared constants module as the `<Image>`
(`src/lib/roadmap-poster.ts`), so the preloaded URLs are exactly the srcset candidates (a
single `getImage({ widths })` call produces a differently-hashed variant; the per-width
shape is what matches). Variants moved to AVIF q55 (761w: 262 KB webp q76 → 190 KB) and the
1200w candidate was dropped — the article column caps at 761 px, so it existed only for
desktop-DPR2 (483 KB per visit). Remaining floor: the throttled mobile LCP sits at
~2.6 s because the 1800×3791 poster at q50 and below starts to smudge; going lower trades
legibility of the roadmap text for single-digit score points, so 97 is recorded as the
route's image-bound floor with every prescribed lever (variants, AVIF, `sizes`, priority
preload for the LCP image only) applied. The landing hero artwork ports from raw public
paths (460 KB light webp, 8000×6000 source) to astro:assets AVIF variants (1350w ≈ 88 KB)
with the dark variant's exact srcset preloaded. Mermaid stays auto-rendering (it is page
content, not an interaction target) but is now viewport-gated with a 100 px margin: the
supply pie chart rendered during load for 210 ms TBT and 7 s TTI, and the render's
figure→SVG swap reserves the source block's height to keep CLS at the 0.054 floor.
DocSearch remains interaction-gated — verified: content pages ship no search code until
first use, and the chunk now warms on hover/focus; the warm open issues zero new requests.
Fonts unchanged: self-hosted IBM Plex preloaded, Roboto Mono non-blocking, CLS at floor.

Accessibility: axe (dark + light, all five routes + /search) and the keyboard passes are
clean — skip link first, desktop sidebar focusable while the footer clamps the column, FAQ
disclosures toggle from the keyboard, the DocSearch modal traps focus, closes on Escape and
returns focus, and the mobile drawer's two-level navigation opens, navigates and closes
with focus returned. Fixes landed for what the sweep found: the dark accent tokens
(#5e72eb/#4158e7/#b6bff6 measured 4.28:1/4.41:1/3.11:1) moved to #7587ef/#3a51dd/#e4e7fc;
the light `--sl-color-text-accent` was an `oklch()` literal with a 0.584-degree hue
(pink #e60076, 4.0:1) and now resolves to the palette accent (6.9:1); markdown links carry
a persistent underline (colour alone was 2.5:1 against surrounding text — axe
link-in-text-block); both search buttons' accessible names mirror their rendered
"Search ⌘ K" run (label-content-name-mismatch); the sidebar pane clears its drawer
view-state `inert` at the desktop breakpoint, which had left the /search column's links
visible but unreachable; and the four flagged public-path markdown images gained intrinsic
dimensions.

SEO: every page now emits exactly one canonical, og:url, og:image and twitter:card — the
override drops Starlight's generated copies instead of duplicating them, and the broken
relative `og:image` from the config head is gone (the override's absolute URL is first in
crawl order). robots.txt is served from the domain root pointing at the sitemap index,
which Starlight's built-in sitemap already provides (54 URLs, every route); /search is
noindex; the Algolia crawler config's `sitemap_urls` entry now resolves. All of this is
pinned by `docs-seo-surface.test.ts`, and `docs-routing.test.ts` continues to pin the
/docs prefix rewrites (the old-URL surface unchanged).

Caching: the audit's headline finding — every hashed asset revalidated per visit. Docs
builds under the `/docs` base, so the URL surface the HTML references is `/docs/_astro/*`,
while vercel.json declared immutable caching only for the bare `/_astro/*` twin (verified
by curl: prefixed path `max-age=0, must-revalidate`, bare path immutable). vercel.json now
declares both forms immutable plus the web-style refresh policy for the `/docs/img`,
`/docs/video` and `/docs/favicon` classes and their bare twins, all pinned by
`cache-surface.test.ts`; `scripts/cache-probe.mjs` re-captures live evidence per route
class on demand — the post-deploy run passes all four classes (HTML revalidate,
`/docs/_astro/*` immutable, img/favicon refresh) and was executed against the live
deploy on 2026-09-13. HTML stays on the revalidating default — long-lived

- SWR was considered and rejected in #1923 (DocSearch index and content freshness favour
  revalidation).

## M5.8 — apps/app (#1885)

The M5.8 structural work landed on top of #1930's `/world` launch. Baseline: the
pre-audit TanStack build shipped 424 client JS files (263 under 3 KB) and originals
for every image. Post-audit evidence (`lh-app-m5.8-audit-2026-09-13.json`): the
shared harness against the local Nitro preview build (`vite preview` of the
production Vercel-preset output), medians of 3, mobile **and** desktop — mobile is
the audit's acceptance profile; `before` numbers are the production evidence from
`lh-app-production-2026-09-12.json`:

| route                | perf before → after | LCP ms before → after | perf desktop | a11y | seo | script files before → after |
| -------------------- | ------------------- | --------------------- | ------------ | ---- | --- | --------------------------- |
| /                    | 98 → 100            | 2111 → 1463           | 91           | 100  | 100 | 52 → 12                     |
| /world               | — → 100             | — → 1374              | 92           | 100  | 100 | new route → 14              |
| /games               | 97 → 100            | 2147 → 1454           | 91           | 100  | 100 | 80 → 12                     |
| /games/smashers      | 63 → 93             | 8518 → 1442           | 87           | 100  | 92  | 147 → 58                    |
| /games/wen-game      | 63 → 95             | 9166 → 1433           | 87           | 100  | 92  | 90 → 57                     |
| /games/crypto-winter | 64 → 95             | 9163 → 1442           | 87           | 100  | 92  | 90 → 57                     |
| /games/mt-gawx       | 63 → 95             | 9170 → 1442           | 87           | 100  | 92  | 90 → 57                     |
| /degens              | 67 → 100            | 6186 → 1444           | 88           | 100  | 100 | 90 → 36                     |
| /leaderboards        | 95 → 98             | 1772 → 1453           | 88           | 100  | 100 | 80 → 32                     |
| /mint-o-matic        | 60 → 92             | 7963 → 1443           | 90           | 100  | 100 | 114 → 35                    |
| /verification        | 17 → 43             | 13479 → 13598         | 56           | 86   | 100 | 84 → 62                     |

Every route clears its Next.js baseline (games 62–63, dashboard-class surfaces the
#1870 gap) and sits in the CWV good band on both form factors (LCP ≤ 1.5 s, CLS ≈ 0,
TBT ≤ 330 ms). `/verification` stays the documented AppKit exception: its 13.5 s
LCP, CLS 0.27 and a11y 86 are the third-party modal (identical pre-migration). The
seo 92 on game routes is Lighthouse flagging the cross-domain canonical on a
localhost capture — production serves the same origin the canonical names. Script
file counts: the total client build fell 424 → 244 files (tail under 3 KB:
263 → 181).

### Performance

| route    | perf m / d (median of 5) | LCP m / d (ms) | TBT m / d (ms) |
| -------- | ------------------------ | -------------- | -------------- |
| /        | 95 / 76                  | 2712 / 2710    | 98 / 0         |
| /loot    | 96 / 98                  | 954 / 857      | 212 / 0        |
| /login   | 78 / 67 (pre-fix)        | 4197 / 4133    | 120 / 0        |
| /profile | 72 / 64 (pre-fix)        | 4793 / 4705    | 168 / 0        |

- **Auth surfaces (fixed).** `/login` and `/profile` were `client:only` islands:
  nothing contentful painted until hydration finished — the skeleton fallback is a
  colored box, which does not count as a contentful paint — so FCP/LCP sat at
  hydration time (~3.5–4.8 s on every sample, both form factors). The surfaces are
  SSR-safe (deterministic logged-out first render; the session arrives client-side
  through SWR), so they now ship `client:load` and their markup is in the document.
  Local SSR smoke of the built function confirms the form renders server-side; the
  post-deploy re-measure is `bun run lighthouse:smashers --base-url
https://niftysmashers.com --label m5.6-postfix --runs 5`.
- **`/loot` last point.** Desktop is 98 with FCP = LCP = SI ≈ 0.9 s (the page is
  prerendered with zero islands). Mobile loses its points to TBT (203–264 ms) on a
  page with no hydration: the main-thread cost is the third-party telemetry — the
  deferred activation schedule uses `delay: 0`, which fires at the first idle
  callback (~0.5 s), so GTM → gtag/Clarity + Sentry + web-vitals execute inside
  the Lighthouse trace window at 4× CPU. This is the shared telemetry schedule
  (`packages/ui` deferred-activation consumers), so it is recorded as a cross-app
  candidate rather than changed under web/docs in this audit.
- **Home, desktop 76 — accepted exception.** The LCP (hero wordmark) passes every
  discovery check (in-document preload with `fetchpriority=high`, matched
  `imagesrcset`/`srcset`, eager), TTFB is 179 ms, TBT is 0–4 ms and FCP 0.8 s; the
  2.6 s "resource load duration" is Lighthouse's devtools emulation serializing a
  many-request page (fonts + two eager low-priority backdrops + islands). The real
  levers left are request count (the eager console-game and hero-background
  backdrops, ~200 KB combined at 1920w) and the width-ladder granularity — both
  bounded, neither worth the UX trade inside this audit.
- **Hero `sizes` (fixed).** The wordmark renders at `width: 400px; max-width:
70vw` but declared `sizes="… 824px"`, so desktop downloaded the 750w rung for a
  400px box (~40 KB flagged oversized). `sizes` now describes the CSS box
  (`(max-width: 571px) 70vw, 400px`); because the ladder caps at 640w for that box
  and the 640w/750w encodes are nearly identical at q85, the byte win is ~1.5 KB —
  the fix is for correctness (hint describes the rendered candidate) more than
  for bytes.
- **Island payload drill-down.** Home: 5 islands, ~7 KB of island code total, all
  below-the-fold sections `client:visible` with dynamic `import()` of the section
  components; shared chunks (react/react-dom ~58 KB raw, Sentry ~49 KB via the
  deferred telemetry) load outside the HTML graph. `/loot`: zero islands, a 291 KB
  prerendered document (~35 KB on the wire). `/login`: one island chunk, 132 KB
  raw / 42 KB brotli (the PlayFabAuthForm graph). The remaining server-render-more
  candidates were exactly the auth surfaces — now done.
- **Image optimizer path.** `/_vercel/image` serves genuinely resized rungs
  (640w is 640×444, 55 KB) and passes the original through byte-identical for
  off-ladder/over-width requests; widths outside the ladder 400. Content
  negotiation returns **webp, not AVIF, for webp sources** (Vercel optimizer
  behavior — the sources are already webp, so there is nothing to win); the
  audit's "sized AVIF variants" therefore resolves as sized webp variants
  everywhere. The hero preload's `imagesrcset`/`imagesizes` match the `<img>`
  exactly (pinned by `Image.test.tsx`).
- **SSR latency.** TTFB over 20 warm samples each: `/` p50 250 ms / p95 302 ms;
  `/loot` 233/299 (edge `x-vercel-cache: HIT` — prerendered); `/login` 247/313;
  `/profile` 240/293 (302); `/sitemap.xml` 214/283 (`s-maxage=3600` consumed by
  the CDN, stripped client-side); `/api/edge-geo` 223/261. No per-request session
  or telemetry work runs in middleware (it only wraps Sentry error capture).

### Accessibility

- New browser suite `apps/smashers/e2e/a11y.e2e.ts` (production base URL): axe
  floor of zero serious/critical per public route, the unauthenticated
  `/profile → /login` redirect, a keyboard-only pass over the home dialogs and the
  sign-in form. All green against the branch build; the authenticated `/profile`
  surface (tabs, panels) remains bounded by the #1915 test-identity dependency.
- Findings fixed: the loot tables scrolled in fixed-height containers that no
  keyboard user could scroll (now named focusable regions); the auth form's
  view-switch controls were bare anchors — keyboard-unreachable, and the accent
  color missed AA on the backdrop (now real buttons on the muted foreground,
  matching the passing label color).
- **Trailer dialog exception.** When the trailer opens, focus moves into the
  YouTube iframe and the player consumes Escape — closing uses the focusable
  close control instead. Third-party embed behavior, same class as the web axe
  iframe exclusion.
- #1869's fixes (main landmark, heading order, AA rarity colours, viewport
  `maximum-scale`) verified holding on the live routes and pinned by the
  contract tests.

### SEO

- Sitemap/robots are generated endpoints. The audit removed `/login` and
  `/profile` from the sitemap — both render `noindex` via `Auth.astro`, and
  submitting them produced the Search Console "Submitted URL marked noindex"
  contradiction. The sitemap↔metadata agreement (plus route backing and unique
  titles/canonicals) is pinned by the new `test/contract/smashers-seo.test.ts`.
- Head surface: canonical, description, keywords, full OG set and Twitter cards
  render per route; `/`, `/loot` carry indexable titles, `/login`, `/profile`,
  `/404` are noindex; robots disallows `/api/` and `/invite/`. Lighthouse's SEO 61
  on the auth routes is the `is-crawlable` penalty for that intentional noindex —
  correct behavior, not a finding.
- No stray static robots/sitemap exists in `apps/smashers/public/` to shadow the
  generated endpoints.

### Caching

- Live curl evidence per class (captured 2026-09-13): `/_astro/*` →
  `public, max-age=31536000, immutable` (declared in vercel.json, contract-pinned);
  HTML SSR routes → `public, max-age=0, must-revalidate` with every request a
  function invocation (MISS), correct for authenticated SSR; `/loot` and
  `/sitemap.xml`/`robots.txt` → edge HITs (`s-maxage=3600` on the endpoints);
  store deep links and auth redirects → platform default on 302/307.
- **Fixed:** `public/` media (`/img/*`, `/icons/*`, `/video/*`, `/favicon/*`) rode
  the platform default; they now carry web's refresh policy
  (`max-age=86400, stale-while-revalidate=604800`) — these names are unhashed, so
  immutable was never an option. Session-bound API payloads (the shared `json()`
  helper, `edge-geo`) now send explicit `no-store` — Vercel's injected default is
  `public`, which invites shared-cache storage of per-user/per-geo responses.
  Both pinned in `cache-surface.test.ts`.
- **`NEXTAUTH_SECRET` retirement: done.** The audit doc previously recorded this
  as blocked on a production-env owner. Executed as the documented sequence:
  `SESSION_SECRET` added to the Vercel project (production/preview/development,
  each environment's existing secret value — zero session invalidation, the code
  already preferred the new name), then `NEXTAUTH_SECRET` removed from all three
  environments, then the fallback deleted from `session.ts`/`oauth.ts` with the
  turbo env inputs, `.env.example`, and contract tests updated. The running
  deployment is unaffected until the next deploy, which reads only
  `SESSION_SECRET`.

### Accepted exceptions

| Exception                                                                                  | Where                                          | Bound                                                                                                           |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Best-practices 77 — third-party cookies from the GTM container (GA4, Clarity, DoubleClick) | every smashers route                           | Identical on web's routes; the analytics stack is the #1903 decision                                            |
| Desktop home perf 76 — Lighthouse devtools serialization of a many-request page            | `/` desktop                                    | LCP discovery/priority checks all pass; levers (eager backdrops, ladder granularity) bounded with UX trade-offs |
| Trailer Escape swallowed by the YouTube iframe                                             | `/` trailer dialog                             | Close control is keyboard-reachable; third-party embed internals                                                |
| Telemetry `delay: 0` fires at first idle (~0.5 s), inside the load window                  | shared primitive (smashers + web + docs + app) | Cross-app change; recorded as the `/loot` mobile TBT source                                                     |
| Authenticated `/profile` axe/tabs sweep                                                    | `/profile`                                     | Blocked on the #1915 PlayFab test identity                                                                      |

## M5.7 — apps/docs (#1884)

Deep-dive app for the M4.0 dedup work. Measured with the shared harness at medians of five
against production, before the fixes (`lh-docs-production-median5-2026-09-13.json`, the
pre-fix deploy with the corrected route list) and after (`lh-docs-production-postfix-2026-09-13.json`,
captured once #1933's deploy was live, with `scripts/cache-probe.mjs` passing all four
route classes). Branch-build medians of three (`lh-docs-local-m57-v2-2026-09-13.json`)
guided the work; the preview server's uncompressed HTML caps local desktop numbers, so
production is the evidence of record.

| route                                   | perf mobile (before → after) | perf desktop (before → after) | a11y (before → after) |
| --------------------------------------- | ---------------------------- | ----------------------------- | --------------------- |
| /                                       | 98 → 100                     | 86 → 91                       | 100 → 100             |
| /overview/intro                         | 100 → 100                    | 91 → 91                       | 96 → 100              |
| /overview/roadmap                       | 95 → 97                      | 82 → 84                       | 96 → 100              |
| /overview/nifty-dao/nftl/supply         | 94 → 99                      | 90 → 90                       | 96 → 100              |
| /overview/nfts/nifty-marketplace/comics | 100 → 99                     | 83 → 83                       | 96 → 100              |

Harness correction: the routes file listed `/nftl/supply` and `/marketplace/comics`, which
404 on the docs domain — the #1923 capture recorded them as "WAF-blocked", but they were
simply wrong slugs (the real routes are `/overview/nifty-dao/nftl/supply` and
`/overview/nfts/nifty-marketplace/comics`). Fixed in `scripts/lighthouse-routes/docs.json`.

Performance: the roadmap poster — the route's LCP — is preloaded from the head with an
`imagesrcset` resolved per-width through the same shared constants module as the `<Image>`
(`src/lib/roadmap-poster.ts`), so the preloaded URLs are exactly the srcset candidates (a
single `getImage({ widths })` call produces a differently-hashed variant; the per-width
shape is what matches). Variants moved to AVIF q55 (761w: 262 KB webp q76 → 190 KB) and the
1200w candidate was dropped — the article column caps at 761 px, so it existed only for
desktop-DPR2 (483 KB per visit). Remaining floor: the throttled mobile LCP sits at
~2.6 s because the 1800×3791 poster at q50 and below starts to smudge; going lower trades
legibility of the roadmap text for single-digit score points, so 97 is recorded as the
route's image-bound floor with every prescribed lever (variants, AVIF, `sizes`, priority
preload for the LCP image only) applied. The landing hero artwork ports from raw public
paths (460 KB light webp, 8000×6000 source) to astro:assets AVIF variants (1350w ≈ 88 KB)
with the dark variant's exact srcset preloaded. Mermaid stays auto-rendering (it is page
content, not an interaction target) but is now viewport-gated with a 100 px margin: the
supply pie chart rendered during load for 210 ms TBT and 7 s TTI, and the render's
figure→SVG swap reserves the source block's height to keep CLS at the 0.054 floor.
DocSearch remains interaction-gated — verified: content pages ship no search code until
first use, and the chunk now warms on hover/focus; the warm open issues zero new requests.
Fonts unchanged: self-hosted IBM Plex preloaded, Roboto Mono non-blocking, CLS at floor.

Accessibility: axe (dark + light, all five routes + /search) and the keyboard passes are
clean — skip link first, desktop sidebar focusable while the footer clamps the column, FAQ
disclosures toggle from the keyboard, the DocSearch modal traps focus, closes on Escape and
returns focus, and the mobile drawer's two-level navigation opens, navigates and closes
with focus returned. Fixes landed for what the sweep found: the dark accent tokens
(#5e72eb/#4158e7/#b6bff6 measured 4.28:1/4.41:1/3.11:1) moved to #7587ef/#3a51dd/#e4e7fc;
the light `--sl-color-text-accent` was an `oklch()` literal with a 0.584-degree hue
(pink #e60076, 4.0:1) and now resolves to the palette accent (6.9:1); markdown links carry
a persistent underline (colour alone was 2.5:1 against surrounding text — axe
link-in-text-block); both search buttons' accessible names mirror their rendered
"Search ⌘ K" run (label-content-name-mismatch); the sidebar pane clears its drawer
view-state `inert` at the desktop breakpoint, which had left the /search column's links
visible but unreachable; and the four flagged public-path markdown images gained intrinsic
dimensions.

SEO: every page now emits exactly one canonical, og:url, og:image and twitter:card — the
override drops Starlight's generated copies instead of duplicating them, and the broken
relative `og:image` from the config head is gone (the override's absolute URL is first in
crawl order). robots.txt is served from the domain root pointing at the sitemap index,
which Starlight's built-in sitemap already provides (54 URLs, every route); /search is
noindex; the Algolia crawler config's `sitemap_urls` entry now resolves. All of this is
pinned by `docs-seo-surface.test.ts`, and `docs-routing.test.ts` continues to pin the
/docs prefix rewrites (the old-URL surface unchanged).

Caching: the audit's headline finding — every hashed asset revalidated per visit. Docs
builds under the `/docs` base, so the URL surface the HTML references is `/docs/_astro/*`,
while vercel.json declared immutable caching only for the bare `/_astro/*` twin (verified
by curl: prefixed path `max-age=0, must-revalidate`, bare path immutable). vercel.json now
declares both forms immutable plus the web-style refresh policy for the `/docs/img`,
`/docs/video` and `/docs/favicon` classes and their bare twins, all pinned by
`cache-surface.test.ts`; `scripts/cache-probe.mjs` re-captures live evidence per route
class on demand — the post-deploy run passes all four classes (HTML revalidate,
`/docs/_astro/*` immutable, img/favicon refresh) and was executed against the live
deploy on 2026-09-13. HTML stays on the revalidating default — long-lived

- SWR was considered and rejected in #1923 (DocSearch index and content freshness favour
  revalidation).

## M5.8 — apps/app (#1885)

The M5.8 structural work landed in feat/m5.8-app-audit on top of #1930's `/world`
launch. Baseline: the pre-audit TanStack build shipped 424 client JS files (263
under 3 KB) and originals for every image; the audit's production evidence and
desktop pass are in `lh-app-production-2026-09-12.json` (mobile medians in the
table below). Post-audit local-build evidence: `lh-app-local-m5.8-*.json`, run
through the same harness against the Nitro preview build.

| route                | perf (before → after†) | LCP ms (before → after†) | script files (before → after) |
| -------------------- | ---------------------- | ------------------------ | ----------------------------- |
| /                    | 98 → TBD               | 2111 → TBD               | 52 → TBD                      |
| /world               | — → TBD                | — → TBD                  | new route → TBD               |
| /games               | 97 → TBD               | 2147 → TBD               | TBD                           |
| /games/smashers      | 63 → TBD               | 8518 → TBD               | 147 → TBD                     |
| /games/wen-game      | 63 → TBD               | 9166 → TBD               | TBD                           |
| /games/crypto-winter | 64 → TBD               | 9163 → TBD               | TBD                           |
| /games/mt-gawx       | 63 → TBD               | 9170 → TBD               | TBD                           |
| /degens              | 67 → TBD               | 6186 → TBD               | 90 → TBD                      |
| /leaderboards        | 95 → TBD               | 1772 → TBD               | 80 → TBD                      |
| /mint-o-matic        | 60 → TBD               | 7963 → TBD               | 114 → TBD                     |
| /verification        | 17 → TBD               | 13479 → TBD              | TBD                           |

† after = local Nitro preview build, mobile devtools throttling, medians of 3 —
a harsher network profile than the production CDN captures; the acceptance
comparison is against the same-harness local baseline.

### Performance

- **Chunk groups (the dominant gap).** The 424-file client build was rolldown
  fragment explosion behind the deferred wallet/AppKit boundaries — 263 files
  under 3 KB, costing more in request overhead than bytes. `codeSplitting`
  groups now pin five shapes: `framework` (react/react-dom/scheduler/@tanstack —
  eager everywhere already), `sentry` (idle-loaded, no longer fragmenting), the
  wallet stack in **dependency-layer groups** (`web3-primitives` → viem/noble,
  `web3-contracts` → wagmi/ethers, `web3-appkit` → AppKit/WalletConnect,
  `web3-side` → bnc/Safe/Coinbase), `ui` (packages/ui, used by nearly every
  route), and `icons` (lucide-react). Client JS fell 424 → 244 files (tail under
  3 KB: 263 → 181); `/games/smashers` loads 58 script files instead of 147.
  Two further dead ends are now documented next to #1870's: rolldown `maxSize`
  splitting slices a dependency layer mid-package and breaks constructor
  bindings (`new LruMap` before its class — found by bisect, reproduced as
  "Wallet provider could not be loaded" on the dashboard), and package-aligned
  groups break the same way on the AppKit↔wagmi↔viem cycle. Layer-aligned
  groups keep every cycle inside one chunk and are pinned by the app E2E suite,
  which fails the dashboard render on any chunk shape that breaks cross-chunk
  evaluation order.
- **Build-time image variants.** Web's `prepare-images.mjs` approach ported:
  60 statically-referenced sources → 1,675 content-addressed WebP rungs under
  `/__images/*` (gitignored `.app-images/`, emitted as client-build assets so
  the Nitro node-server preset's embedded asset list serves them — a post-build
  copy 404s there). `OptimizedImage` resolves the manifest to a responsive
  `srcSet` with the shared attribute contract; API-driven artwork (10k degen
  NFT files) stays on originals by design. The games-index LCP poster now ships
  a full rung ladder with a matching `imagesrcset` preload (960w ≈ 24 KB vs the
  46 KB original JPG).
- **Prerendered marketing shells.** `/`, `/games`, `/world` prerender at build
  time (Nitro `prerender`, crawlLinks off): user-independent shells served as
  static files at the edge; dashboard, data, parameterized and cookie-aware
  routes stay on the SSR function. `/world` scene/game routes embed the remote
  Nifty World origin (cross-origin media — out of scope for the local
  pipeline).
- **Dashboard waterfalls.** Audited: no serial fetch chains exist — dashboard
  pages use component-level TanStack Query with auth-gated `enabled`, firing in
  parallel; the one multi-fetch flow (rentals) already fans out through
  `Promise.all`.
- Third-party weight (AppKit/wagmi/bnc) verified lazy: the entry chunk
  references none of the wallet packages; the stack loads through the deferred
  boundaries only.

### Accessibility

- The axe sweep (public + fixture-dashboard routes, zero serious/critical) and
  the dashboard shell render survive the chunk changes. Faster loads now let
  the deferred mint 3D surface and the home game cards mount _before_ the sweep
  runs, surfacing two real findings that the fragmented build had been hiding
  behind load latency: the public shell's scroll-constrained `<main>` was not
  keyboard-scrollable (now a tab stop), and the game-card description clamps
  used `overflow-y: hidden`, which creates an unfocusable scroll container
  (now `overflow-y: clip` — identical visuals, no scroll container).
- New keyboard-only pass: a 30-stop tab sweep asserting every persistent focus
  stop is a native control or ARIA-interactive role across public and
  fixture-dashboard routes (transient stops on re-rendering live surfaces are
  re-read before flagging), plus keyboard reachability of the wallet connect
  trigger on `/`. `/mint-o-matic` is excluded from the strict sweep (full-screen
  canvas whose deferred surface resets focus mid-traversal; same chrome as the
  other public shells, axe-covered).
- `/verification` stays the documented AppKit third-party exception (86/100 on
  the audit run — its shadow-DOM modal, identical pre-migration).

### SEO

- **Canonical links.** `buildHead` now emits `<link rel="canonical">` plus a
  route-scoped `og:url` for every route that passes `path` — previously every
  route shared the bare-origin `og:url` and none had a canonical, leaving
  parameterized surfaces unaddressable. Pinned by the new
  `test/contract/app-seo-surface.test.ts` (every route file must pass a path).
- `/degens/$id` stays a redirect onto the catalog; its `tokenId` filter
  canonicalizes to clean `/degens`, so filtered views do not multiply documents.
- **Sitemap.** The `/world` launch shipped without sitemap entries; the sitemap
  now enumerates the world index, nine scenes, and six mini games from the same
  constants the routes validate against (new surfaces become crawlable when
  they become routable). 16 → 32 entries, uniqueness pinned by the seo unit
  test.

### Caching

- `/__images/*` joins `/assets/*` on `immutable` + ACAO (content-addressed like
  the hashed chunks), and app media (`/img`, `/icons`, `/video`, `/favicon`)
  moves off the platform default onto the shared refresh policy
  (`max-age=86400, SWR=604800`) — the same finding the M5.6 smashers audit
  fixed on its surface. All pinned in `cache-surface.test.ts`.
- Prerendered `/`, `/games`, `/world` serve as static Build Output files
  (`handle: filesystem` wins over the server function); HTML elsewhere stays on
  the revalidating default and never immutable.

## Exceptions summary

| Exception                             | Route                                  | Bound                                                                             |
| ------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------- |
| satoshi `left/top` animation CLS      | web `/roadmap`                         | transform rewrite scoped; needs container height as CSS                           |
| AppKit shadow-DOM modal axe findings  | app `/verification`                    | third-party; upstream-file option                                                 |
| AppKit/wagmi chunk weight             | app game routes                        | lazy-loaded off the paint path; wallet layer chunks load async on wallet surfaces |
| Authenticated dashboard data variance | app + smashers                         | live contract APIs; shell-level assertions                                        |
| Roadmap poster mobile LCP (~2.6 s)    | docs `/overview/roadmap`               | 1800×3791 poster below q55 AVIF starts to smudge; all levers applied, perf 97     |
| Mermaid figure→SVG swap CLS (0.054)   | docs `/overview/nifty-dao/nftl/supply` | render-time swap reserves the source height; growth shifts remain possible        |
