# M2 React framework evaluation

Status: proposed in PR #1854 on 2026-09-08. This is a React framework decision record; it does not select an API framework.

## Scope and buckets

M2 answers two separate questions:

| Bucket                | Applications                             | Decision question                                                                                                                                         |
| --------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Static-first websites | `apps/web`, `apps/smashers`, `apps/docs` | Does Astro or another static-capable React framework improve the primary public experience?                                                               |
| Stateful application  | `apps/app`                               | Does Next.js, TanStack Start, or React Router Framework Mode (the current Remix lineage) best serve authenticated, data-heavy, and interactive workflows? |

`apps/api` is intentionally excluded: it is an API-framework question for a future audit. `apps/template` is intentionally excluded: it is a starter repository, not a production workload. Their M0 controls remain available in the M0 record and are not React-framework evidence.

## What was tested

The final report is `benchmarks/results/m2-per-app-frameworks-2026-09-08.json`, captured after M1. The report records the exact source revision used for its run.

- 16 real production routes across the four in-scope applications.
- 52 app-shaped candidate workloads: five for `app`, three for `docs`, four for `smashers`, and four for `web`, with only candidates that fit each bucket.
- 20 common candidate workloads for cross-framework behavior: public, authenticated, data-heavy, interaction-heavy, and streaming.
- Five new-browser-profile samples per route, five fresh-process cold starts, five clean builds, and five incremental builds.
- LCP, INP, CLS, TTFB, response completion, stream gap, client navigation, transfer, JavaScript, request count, memory, cache headers, and build output.

The browser runs used headless Chrome at 1365x768 on an unthrottled local network. Every server received a fresh OS-assigned loopback port, so another checkout could not satisfy readiness. These are controlled lab measurements, not field Core Web Vitals; deployed preview and RUM remain migration gates.

The common fixtures are directional. The app-shaped routes vary assets, content volume, interactive nodes, authentication, and streaming to reflect each production app. React Router Framework Mode is used as the current Remix lineage; the report does not claim to have benchmarked the retired Remix package separately.

## Current production controls

These are measurements of the real applications, not claims that their current framework is optimal.

| App        | Bucket       | Routes |  Median LCP |   Median JS |  Median transfer | Process-cold |
| ---------- | ------------ | -----: | ----------: | ----------: | ---------------: | -----------: |
| `app`      | Stateful     |      5 |  244–380 ms | 327–414 KiB |      455–578 KiB |       365 ms |
| `docs`     | Static-first |      3 |  232–296 ms | 626–674 KiB |    888–1,739 KiB |       512 ms |
| `smashers` | Static-first |      4 | 148–360 ms* | 289–391 KiB | 496 KiB–3.87 MiB |       349 ms |
| `web`      | Static-first |      4 |  204–518 ms | 161–300 KiB |      291–563 KiB |       321 ms |

\* `/profile` is a redirect control and therefore has no meaningful LCP; its other metrics remain recorded.

## Static-first bucket: Astro versus Next.js in practice

Astro is not universally faster. It consistently removes JavaScript from static routes, but Next.js wins or ties several render and interaction cells. The answer depends on whether a route is genuinely static or spends its budget on a hydrated island, dynamic media, or a dashboard/auth boundary.

| App / workload         | Next.js                | Astro                                    | React Router      | Result                                |
| ---------------------- | ---------------------- | ---------------------------------------- | ----------------- | ------------------------------------- |
| `docs` public          | 48 ms LCP / 135 KiB JS | 44 ms / 0 KiB                            | 56 ms / 105 KiB   | Astro wins payload and LCP            |
| `docs` interaction     | 48 ms / 16 ms INP      | 56 ms / 16 ms INP; 189 KiB island        | 88 ms / 16 ms INP | Next wins render and interactive JS   |
| `smashers` public      | 64 ms / 135 KiB JS     | 64 ms / 0 KiB; 3.69 MiB assets (3.87 MB) | 116 ms / 105 KiB  | Astro ties LCP and removes route JS   |
| `smashers` interaction | 44 ms / 16 ms INP      | 64 ms / 16 ms INP; 189 KiB island        | 68 ms / 20 ms INP | Next wins                             |
| `web` public           | 48 ms / 135 KiB JS     | 56 ms / 0 KiB                            | 80 ms / 105 KiB   | Next wins LCP; Astro wins payload     |
| `web` interaction      | 48 ms / 16 ms INP      | 52 ms / 16 ms INP; 189 KiB island        | 68 ms / 16 ms INP | Next wins LCP; Astro wins only JS     |
| `web` streaming        | 44 ms LCP              | 40 ms LCP                                | 128 ms LCP        | Astro wins this static/deferred shape |

What this means:

- `docs`: Astro is a credible static-first improvement, but it does not win the hydrated interaction route. A route-parity proof is warranted before changing the docs stack.
- `smashers`: Astro was tested explicitly after classifying Smashers as static-first. It removes route JavaScript, but the primary landing route is already dominated by roughly 3.87 MiB of assets and Next wins the interaction route. Astro is not a clear whole-app win.
- `web`: Astro is attractive for truly static leaves, while Next wins the measured public and interaction LCPs. The dynamic GLTF/embed route makes a whole-site switch unsafe without a real asset and hosting proof.

The static-site conclusion is therefore “Astro can be materially better on static payload, not ‘Astro always renders faster.’” React Router was generally smaller than Next in JavaScript, but it did not beat Astro’s zero-JS result or Next’s render timing across these sites.

## Stateful bucket: `apps/app`

| Workload      | Next.js                | TanStack Start    | React Router Framework Mode |
| ------------- | ---------------------- | ----------------- | --------------------------- |
| Public        | 44 ms LCP / 135 KiB JS | 44 ms / 315 KiB   | 116 ms / 105 KiB            |
| Authenticated | 44 ms / 135 KiB        | 36 ms / 315 KiB   | 80 ms / 105 KiB             |
| Data-heavy    | 48 ms / 135 KiB        | 44 ms / 315 KiB   | 180 ms / 105 KiB            |
| Interaction   | 48 ms / 16 ms INP      | 52 ms / 16 ms INP | 116 ms / 16 ms INP          |
| Streaming     | 36 ms                  | 180 ms            | 184 ms                      |

TanStack Start wins the authenticated and data-heavy fixture LCPs and has much faster builds and cold starts, but sends about 2.3x Next’s route JavaScript. Next ties or wins the public, interaction, and streaming shapes. React Router Framework Mode has the smallest route JavaScript, but its measured stateful render timings are substantially slower.

The current decision remains Next.js 16 for M2 because the tested alternatives do not dominate and none has proven wallet/auth, server-prefetched query hydration, route handlers, metadata, Sentry, image behavior, cache policy, and rollback parity.

## Build and startup evidence

| Candidate      | Clean build | Incremental build | Process-cold | Client JS in build |
| -------------- | ----------: | ----------------: | -----------: | -----------------: |
| Next.js        |     12.75 s |           11.39 s |       290 ms |            880 KiB |
| TanStack Start |      0.77 s |            0.78 s |       148 ms |            315 KiB |
| Astro          |      0.75 s |            0.75 s |       113 ms |            188 KiB |
| React Router   |      0.44 s |            0.44 s |       242 ms |            316 KiB |

Vite-based candidates have a real development/build-speed advantage. Next’s standalone output is not directly comparable to the smaller adapter outputs because it includes its traced dependency closure.

## Cloudflare decision context

Cloudflare changes the operational tradeoff, but it does not erase the parity work:

- [Cloudflare’s TanStack Start guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/) documents automatic Wrangler detection and a first-party Vite plugin path for Workers.
- [Cloudflare’s React Router deployment guidance](https://reactrouter.com/start/framework/deploying) lists a Cloudflare-maintained template for Framework Mode.
- [Cloudflare’s Next.js guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/) currently recommends `vinext` for new Next.js-on-Workers deployments; [the OpenNext guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/) remains the compatibility path for existing applications.
- [Cloudflare Pages supports Docusaurus](https://developers.cloudflare.com/pages/framework-guides/deploy-a-docusaurus-site/) as a static deployment, so moving providers alone is not a reason to move the docs framework.

For a future `apps/app` decision, the meaningful comparison is therefore not “Next on Vercel versus TanStack locally.” It is Next plus its Cloudflare adapter path versus TanStack Start or React Router on Workers, with the same route behavior, edge/runtime constraints, observability, image/media handling, cache headers, and rollback procedure. That should be a separate Cloudflare preview benchmark with production-like bindings.

## Decisions

| App        | Bucket       | Measured performance result                                                                              | M2 decision                                                          |
| ---------- | ------------ | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `app`      | Stateful     | Mixed: TanStack wins auth/data LCP, Next wins public/interaction/streaming, React Router has smallest JS | Keep Next.js 16; revisit with a Cloudflare preview proof             |
| `docs`     | Static-first | Astro wins static payload and public LCP; Next wins hydrated interaction                                 | Keep Docusaurus 3 pending representative Astro route parity          |
| `smashers` | Static-first | Astro removes route JS and ties public LCP; Next wins interaction; assets dominate the landing page      | Keep Next.js 16; optimize asset delivery first                       |
| `web`      | Static-first | Astro wins static payload and selected deferred shapes; Next wins public/interaction LCP                 | Keep Next.js 16 pending an Astro marketing and GLTF leaf-route proof |

No production framework migration is approved in M2. The only alternative implementations are disposable prototypes under `benchmarks/framework-prototypes`; they are outside the workspace and cannot shadow production routes.

## M2.5 migration gate

M2.5 is an explicit no-op because no candidate cleared the route-by-route acceptance gate. Any future migration must prove, for every moved route:

### Route-by-route acceptance

- URL, redirect, auth, data, mutation, error, metadata, theme, keyboard, and screen-reader parity;
- equal or better LCP, INP, CLS, transfer, client JavaScript, memory, server response, cache, and build budgets;
- production-equivalent Cloudflare/Vercel hosting, image/media delivery, Sentry/observability, and rollback;
- deletion of the superseded route, with no parallel production implementation.

## Reproduce

```sh
bun install --frozen-lockfile

NEXTAUTH_SECRET=local-m2-benchmark-only-32-characters GITHUB_ACTIONS=true bun run build

for candidate in next tanstack-start astro react-router; do
  (cd "benchmarks/framework-prototypes/$candidate" && bun install --frozen-lockfile && bun run type-check && bun run build)
done

bun run benchmark:m2 --candidate next-control --candidate tanstack-start \
  --candidate astro --candidate react-router --build \
  --output benchmarks/results/m2-per-app-frameworks-2026-09-08.json

bun test test/contract/m0-baseline.test.ts test/contract/m2-framework-evaluation.test.ts
```
