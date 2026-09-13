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

Performance: home and `/loot` measured on mobile and desktop (evidence:
`lh-smashers-production-2026-09-12.json`): home 91/76 (LCP 2756/2769 ms), /loot 91/98
(LCP 1095/884 ms), a11y/SEO 100 everywhere; best-practices 77 is the third-party-cookie
finding from the GTM container. The image-optimizer path (`/_vercel/image` posters/logos
with capped srcSet) is exercised by the production load and pinned by
`smashers-assets.test.ts` and the shared image attribute core. Island payload drill-down and SSR TTFB p95: TTFB medians are in the M5 run
(183 ms home); hot-path work (session seal, telemetry) runs behind the deferred activation
schedule.

Accessibility: the OAuth round-trip stays covered by `oauth-flow.test.ts`; the shared
a11y primitives and the axe sweep cover the rendered surface; #1869's fixes (main
landmark, heading levels, AA rarity colours) are pinned by the contract tests.

SEO: metadata surface (`src/runtime/metadata.ts`) with unique title/description/canonical;
`sitemap.xml` + `robots.txt` are generated (`smashers-assets` contract); authenticated
surfaces gate through the session.

Caching: `/_astro/*` immutable is now **declared** in vercel.json (#1920) instead of
relying on the Astro preset; SSR HTML stays on the revalidating default;
`edge-geo` cacheability is pinned by the cache contract. **`NEXTAUTH_SECRET` retirement:
blocked, sequence documented** — verified against the Vercel project on 2026-09-12:
`NEXTAUTH_SECRET` exists and `SESSION_SECRET` does **not**, so the code fallback
(`session.ts`) is load-bearing for every production session. Retirement sequence:
(1) add `SESSION_SECRET` to the Vercel project with the same value (zero session
invalidation — the code prefers it), (2) deploy, (3) remove `NEXTAUTH_SECRET` from the
project and the fallback from `session.ts` plus its test. Requires a production-env owner.

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
