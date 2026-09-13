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

Performance: the 14 sitemap routes are measured on mobile and desktop with five-run medians
in `benchmarks/results/lh-web-m5.5-current-2026-09-13.json`; the route manifest now matches
the indexable sitemap surface. Build-injected LCP preloads and CSS inlining were already
shipped. The `/roadmap` Satoshi milestone now uses compositor-friendly `translate3d`
keyframes and reduced motion ends hidden; the targeted follow-up evidence is
`lh-web-m5.5-roadmap-transform-2026-09-13.json` (mobile CLS improved from 0.1221 to 0.0684
in that comparison). Desktop performance and LCP remain below the issue's 100/100 and
2.5-second acceptance targets on several media-heavy routes, so M5.5 is still in progress.
Third-party weight is the GTM container (GA4 + Clarity), owned by #1903's decision; YouTube
facades ship without hidden iframe cost (no iframe before interaction).

Accessibility: the axe sweep (`e2e/a11y.e2e.ts`) now covers all 14 indexable routes with zero
serious or critical findings. It also fixed the `/careers` nested-interactive Apply control.
The interaction E2E covers desktop keyboard traversal, disclosures, reduced motion, and the
mobile drawer's fixed independent scroll surface. A complete human keyboard-only and assistive
technology pass remains an acceptance gate.

SEO: unique title/description/canonical per route is asserted by
`e2e/marketing.e2e.ts` ("all marketing documents have crawlable HTML and production
canonicals"), including route-specific descriptions for the legal pages. OG/Twitter tags,
the 14-entry sitemap, and robots output are emitted by the static build. The Worker pins
`/shells/*` and malformed `/gltf/*` as 404s. Vercel intentionally keeps direct shell
compatibility documents at 200 with `noindex,nofollow` and robots exclusion; its GLTF rewrite
accepts only numeric 1–12 digit IDs, so the malformed-path soft-200 is removed after deploy.

Caching: immutable `/_astro/*` + `/__images/*`, refresh policy on media, and HTML on the
revalidating default are pinned by `cache-surface.test.ts`. Production curl spot checks on
2026-09-13 confirmed Vercel HTML revalidation, gzip HTML, immutable hashed JavaScript, and
WebP media with hit/miss changes. The Worker contract additionally pins no-store referral
shells, one-hour shared GLTF shell responses, and deep-link robots headers. **Worker cutover
decision: formally parked** — the `nifty-league-web-astro` Worker is deliberately unbound
(`wrangler.jsonc` comment), production serves from Vercel, and the two delivery paths
configure headers differently; revisit only if the cutover is rescheduled. A production
deployment is still required to re-probe the new Vercel malformed-GLTF behavior.

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

Performance: all ten public routes measured on mobile and desktop (evidence:
`lh-app-production-2026-09-12.json`), which also delivers the audit's desktop pass — the
first time desktop was measured for this app. Mobile medians (Lighthouse throttled):

| route                | perf | a11y | LCP ms | TBT ms | CLS    |
| -------------------- | ---- | ---- | ------ | ------ | ------ |
| /                    | 98   | 100  | 2111   | 13     | 0.0000 |
| /games               | 97   | 100  | 2147   | 2      | 0.0000 |
| /games/smashers      | 63   | 100  | 8518   | 0      | 0.0001 |
| /games/wen-game      | 63   | 100  | 9166   | 0      | 0.0001 |
| /games/crypto-winter | 64   | 100  | 9163   | 0      | 0.0001 |
| /games/mt-gawx       | 63   | 100  | 9170   | 0      | 0.0001 |
| /degens              | 67   | 100  | 6186   | 23     | 0.0117 |
| /leaderboards        | 95   | 100  | 1772   | 192    | 0.0284 |
| /mint-o-matic        | 60   | 100  | 7963   | 0      | 0.0042 |
| /verification        | 17   | 86   | 13479  | 1228   | 0.2696 |

Every route improved over the audit baseline (game routes 59–60 → 63–64, /degens 60 → 67),
and all remain above the Lighthouse 50 floor except /verification (17), whose failures are
the documented AppKit exception below. The M5 production run shows CWV in the good
band on every route (LCP median 1152 ms, INP 16 ms, CLS 0.0037) while transfer fell to
593 KB and heap to 8.9 MB.

The two structural items stay scoped as the dominant remaining work, with the measured
baseline recorded: per-route manual chunk groups (422 vs 53 files — the two dead ends from
#1870 are documented; per-route grouping is the remaining approach, and it must be
validated against eager-byte and route-file-count regressions when landed), and the
build-time image-variant pipeline (porting web's `prepare-images.mjs` approach).
Third-party weight (AppKit/wagmi) is lazy-loaded off the critical path.

Accessibility: the axe sweep covers the public routes and — via the visual-audit fixture
(`VITE_AUDIT_FIXTURE`, which the AuthGuard already honours) — the dashboard routes without
a PlayFab session (`apps/app/e2e/app.e2e.ts`). `/verification`'s axe findings sit in
AppKit's shadow-DOM modal, identical pre-migration: recorded as an accepted third-party
exception with the upstream-file option noted.

SEO: head tags as React element props verified per route (`degens/$id` included) by the
route metadata contract; `/verification` re-indexed in #1870.

Caching: the dead header copy question was settled by #1912 — vercel.json is the live
source on the Build Output API deploy and the Nitro duplicate was deleted; `/assets/*`
immutable + ACAO is pinned by `cache-surface.test.ts`; API proxy routes stay on the shared
API contract. Prerender/SWR for public routes is the remaining bounded item.

## Exceptions summary

| Exception                             | Route                                  | Bound                                                                         |
| ------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------- |
| satoshi `left/top` animation CLS      | web `/roadmap`                         | transform rewrite scoped; needs container height as CSS                       |
| AppKit shadow-DOM modal axe findings  | app `/verification`                    | third-party; upstream-file option                                             |
| AppKit/wagmi chunk weight             | app game routes                        | lazy-loaded; chunk groups tracked                                             |
| Authenticated dashboard data variance | app + smashers                         | live contract APIs; shell-level assertions                                    |
| Roadmap poster mobile LCP (~2.6 s)    | docs `/overview/roadmap`               | 1800×3791 poster below q55 AVIF starts to smudge; all levers applied, perf 97 |
| Mermaid figure→SVG swap CLS (0.054)   | docs `/overview/nifty-dao/nftl/supply` | render-time swap reserves the source height; growth shifts remain possible    |
