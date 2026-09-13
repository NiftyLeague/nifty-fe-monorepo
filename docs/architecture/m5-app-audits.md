# M5.5–M5.8 — Per-app optimization audits

Issues: [#1882](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1882) (web),
[#1883](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1883) (smashers),
[#1884](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1884) (docs),
[#1885](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1885) (app).

Method: the shared harness (`bun run lighthouse:<app>`, devtools CDP throttling, medians of
three, mobile + desktop) against **production**, plus the CWV/weight medians from
`benchmarks/results/m5-production-2026-09-12.json` and the cache contracts from
`test/contract/cache-surface.test.ts`. Evidence files: `benchmarks/results/lh-*.json`.

## M5.5 — apps/web (#1882)

Performance: home and content routes measured on mobile and desktop (evidence:
`lh-web-production-2026-09-12.json`); build-injected LCP preloads and CSS inlining were
already shipped. The legacy satoshi `left/top` milestone animation on `/roadmap` is the
remaining CLS contributor — its transform rewrite requires the roadmap container height as
a CSS value (design input) or a measurement island (bytes on the page), so it is recorded
as the route's accepted exception with the scope written out; a
`prefers-reduced-motion` guard ships in its place (the animation ends hidden, so reduced
motion reaches that end state immediately). Third-party weight is the GTM container (GA4 +
Clarity), owned by #1903's decision; YouTube facades ship without hidden iframe cost
(no iframe before interaction).

Accessibility: the axe sweep (`e2e/a11y.e2e.ts`) and the interaction E2E (keyboard tab
order, disclosures, reduced motion) cover the route surface; findings route to focused
issues.

SEO: unique title/description/canonical per route is asserted by
`e2e/marketing.e2e.ts` ("all marketing documents have crawlable HTML and production
canonicals"); `/shells/*` and malformed `/gltf/*` are pinned as real 404s ("unknown routes
and private shell documents are not soft-200 pages").

Caching: immutable `/_astro/*` + `/__images/*`, refresh policy on media, HTML on the
revalidating default — all pinned by `cache-surface.test.ts` with curl evidence captured
during #1912. **Worker cutover decision: formally parked** — the `nifty-league-web-astro`
Worker is deliberately unbound (`wrangler.jsonc` comment), production serves from Vercel,
and the two delivery paths configure headers differently; revisit only if the cutover is
rescheduled. Cached-header regressions fail in CI via `cache-surface.test.ts`.

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

Performance: overview/intro, roadmap, supply, comics and the home measured (evidence:
`lh-docs-production-2026-09-12.json`); the M5 production run already showed docs as the
best surface (transfer −72%, requests −53% vs M0). DocSearch stays interaction-gated;
mermaid loading is interaction-gated; font loading is non-blocking with CLS at the floor.

Accessibility: the axe sweep covers the rendered routes; DocSearch's modal focus trap is
the vendor implementation (accessible by default); the sidebar and mobile drawer keyboard
behavior are pinned by the docs navigation contract and the #1872 fixes.

SEO: canonical per doc page, OG/Twitter, sitemap completeness, and the old-Docusaurus URL
redirects are pinned by `docs-routing.test.ts` and the docs contract tests.

Caching: `/_astro/*` immutable now declared in vercel.json (#1920); HTML on the
revalidating default (long-lived + SWR was considered and rejected — the DocSearch index
and content updates favour revalidation); curl evidence in the M5.5–M5.7 evidence files.

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

| Exception                             | Route               | Bound                                                   |
| ------------------------------------- | ------------------- | ------------------------------------------------------- |
| satoshi `left/top` animation CLS      | web `/roadmap`      | transform rewrite scoped; needs container height as CSS |
| AppKit shadow-DOM modal axe findings  | app `/verification` | third-party; upstream-file option                       |
| AppKit/wagmi chunk weight             | app game routes     | lazy-loaded; chunk groups tracked                       |
| Authenticated dashboard data variance | app + smashers      | live contract APIs; shell-level assertions              |
