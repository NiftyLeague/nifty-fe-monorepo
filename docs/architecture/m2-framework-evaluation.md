# M2 per-app framework evaluation

Status: proposed in PR #1854 on 2026-09-08. This record addresses issues #1826 through #1830 without changing a production framework.

## Evaluation method

M2 uses two evidence layers because a production application and a synthetic framework fixture answer different questions:

1. Real application controls measure 18 routes across all six deployable applications with their actual route, asset, state, and framework behavior.
2. Disposable M2 prototypes run Next.js, TanStack Start, Astro, and React Router Framework Mode against both a common fixture and app-shaped workloads. Those workloads vary asset count, content/data volume, interactive nodes, authentication and streaming according to each application.

Every run used Chrome headless at 1365x768, five new-profile samples per browser route, an unthrottled local network, a synthetic click where applicable, first-byte and response-completion timing, a cache-busted request followed by an identical warm request, five fresh-process starts, and five clean plus five incremental prototype builds. The API resource comparison is server-only. The unified run also records five fresh-process starts for every deployable application. Process-cold startup is deliberately separate from cache-cold request timing. Every server start receives a fresh OS-assigned loopback port so another checkout cannot satisfy the readiness probe. The prototypes are isolated under `benchmarks/framework-prototypes`; they are neither workspace applications nor deployment inputs.

The earlier 2026-09-07 report used one generic workload and only one real route per application. It was insufficient to determine per-app fit and is superseded by `m2-per-app-frameworks-2026-09-08.json`, captured after M1 merged.

Official capability references used to design the experiments are the [TanStack Start overview](https://tanstack.com/start/latest/docs/framework/react/overview), [Astro islands architecture](https://docs.astro.build/en/concepts/islands/), [Astro on-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/), [React Router rendering strategies](https://reactrouter.com/start/framework/rendering), [React Router streaming guidance](https://reactrouter.com/how-to/suspense), and [Docusaurus static generation model](https://docusaurus.io/docs/advanced/ssg).

## Current application controls

| App      | Actual routes measured | Median LCP range | Median JS range | Median transfer range | Process-cold | Current capability finding                                                         |
| -------- | ---------------------: | ---------------: | --------------: | --------------------: | -----------: | ---------------------------------------------------------------------------------- |
| api      |                      1 |              n/a |           0 KiB |                 3 KiB |       313 ms | JSON service; frontend hydration and client routing are not applicable             |
| app      |                      5 |       104–376 ms |     327–414 KiB |           455–578 KiB |       334 ms | Next SSR/static routes, handlers, hydration, wallet/auth and query cache ownership |
| docs     |                      3 |       208–252 ms |     626–674 KiB |         888–1,739 KiB |       517 ms | Docusaurus build-time rendering plus hydrated client navigation                    |
| smashers |                      4 |        72–360 ms |     289–385 KiB |         496–3,959 KiB |       314 ms | Next static/SSR paths, NextAuth handlers, redirects, image pipeline and Sentry     |
| template |                      1 |           116 ms |         148 KiB |               281 KiB |       250 ms | Static Next shell with a small hydrated UI demonstration                           |
| web      |                      4 |        68–324 ms |     161–300 KiB |           291–581 KiB |       278 ms | Static marketing routes plus dynamic GLTF, media islands, rewrites and headers     |

These controls are local production builds so they expose real application weight without production-network noise. They are not route-parity implementations of the prototypes and are not used as direct framework speed comparisons. Exact route ownership, SSR/SSG/streaming applicability, authentication, hydration, and cache behavior are versioned in `benchmarks/m2-framework-evaluation.json`.

## Same-fixture runtime results

Values are medians of five local production samples. Transfer includes the shared 78 KiB WebP on the public route. “JS” is JavaScript transferred for the tested route, not all build chunks.

| Candidate               | Process-cold | Public LCP | Public JS | Public transfer | Interaction INP |
| ----------------------- | -----------: | ---------: | --------: | --------------: | --------------: |
| Next.js 16.3.4          |       260 ms |      60 ms |   135 KiB |         220 KiB |           24 ms |
| TanStack Start 1.168.50 |       139 ms |      52 ms |   315 KiB |         399 KiB |           16 ms |
| Astro 7.3.1             |       114 ms |      52 ms |     0 KiB |          94 KiB |           16 ms |
| React Router 8.3.1      |       242 ms |      48 ms |   106 KiB |         190 KiB |           16 ms |

Next streamed its shell in 4 ms and completed the deferred content in 155 ms. TanStack Start and React Router completed their single responses in 155 ms. Astro returned the 7 KiB shell in 2 ms and requested its deferred server island separately. These are observations about pinned prototypes, not universal framework claims. INP is reported only when Chrome's Event Timing observer records an event of at least 16 ms; a null value means below that threshold, not a failed click.

## App-shaped framework results

Each row below uses identical query-controlled workload volume within that application. The values are medians of five runs. “Public” shows LCP and route JavaScript; “interaction” shows LCP and the synthetic click INP. This table answers framework-runtime fit. The real-route controls above answer how heavy the applications actually are.

| App      | Candidate             | Public LCP / JS | Interaction LCP / INP | Performance reading                                    |
| -------- | --------------------- | --------------: | --------------------: | ------------------------------------------------------ |
| api      | Express control       |     n/a / 0 KiB |                   n/a | 0.33 ms median local response                          |
| api      | React Router resource |     n/a / 0 KiB |                   n/a | 0.75 ms median local response; no service advantage    |
| app      | Next.js               | 40 ms / 135 KiB |            56 / 24 ms | Fastest public render; middle JS                       |
| app      | TanStack Start        | 44 ms / 315 KiB |            48 / 16 ms | Best interaction result, 2.3x Next route JS            |
| app      | React Router          | 44 ms / 105 KiB |            48 / 24 ms | Smallest JS; ties TanStack interaction LCP             |
| docs     | Next.js reference     | 36 ms / 135 KiB |            48 / 16 ms | Ties render timing and has the smallest interactive JS |
| docs     | Astro                 |   36 ms / 0 KiB |            48 / 16 ms | Static payload winner; React island is 189 KiB         |
| docs     | React Router          | 40 ms / 105 KiB |            44 / 24 ms | Fastest interaction LCP, but not static-first          |
| smashers | Next.js               | 72 ms / 135 KiB |            36 / 20 ms | Best interaction result with middle route JS           |
| smashers | TanStack Start        | 60 ms / 315 KiB |            64 / 24 ms | Fastest public LCP, 2.3x Next route JS                 |
| smashers | React Router          | 96 ms / 105 KiB |            48 / 20 ms | Smallest JS; assets still dominate transfer            |
| template | Next.js               | 48 ms / 135 KiB |            48 / 24 ms | Middle route JS and render timing                      |
| template | Astro                 |   36 ms / 0 KiB |            36 / 16 ms | Runtime winner; interaction island is 189 KiB          |
| template | React Router          | 48 ms / 105 KiB |            48 / 24 ms | Smallest always-interactive JS                         |
| web      | Next.js               | 44 ms / 135 KiB |            40 / 16 ms | Strong result, but Astro is faster and static-first    |
| web      | Astro                 |   40 ms / 0 KiB |            36 / 16 ms | Runtime and static-payload winner; island is 189 KiB   |
| web      | React Router          | 44 ms / 105 KiB |            44 / 20 ms | Smallest always-interactive JS                         |

## Build and bundle composition

| Candidate      | Clean build | Incremental build | Client JS in build | Output note                                                              |
| -------------- | ----------: | ----------------: | -----------------: | ------------------------------------------------------------------------ |
| Next.js        |     13.26 s |           13.36 s |            880 KiB | 161.17 MiB standalone output includes traced runtime dependencies        |
| TanStack Start |      0.81 s |            0.76 s |            315 KiB | 1.33 MiB Nitro output                                                    |
| Astro          |      0.79 s |            0.71 s |            188 KiB | 1.56 MiB Node adapter output; React is isolated to the interactive route |
| React Router   |      0.41 s |            0.40 s |            316 KiB | 0.40 MiB framework build output                                          |

Build duration strongly favors the Vite-based prototypes. Raw output size is not an apples-to-apples deployment metric because the Next standalone output contains its dependency closure. Route transfer, server work, memory, request counts, cache headers, sample spread, and the full build command results remain in the JSON evidence rather than being reduced to this table.

## Caching and operational findings

- Next emitted one-year `s-maxage` for static fixtures and private no-store behavior for the authenticated and dynamic streaming routes.
- Astro’s authenticated route explicitly emitted `private, no-store`; its data route emitted `s-maxage=60`. Its static route sent no JavaScript, while the React interaction island transferred 189 KiB.
- The TanStack Start and React Router prototypes emitted no explicit cache policy. A migration would have to define and verify those policies route by route before parity.
- Warm local responses were usually faster, but these synthetic server-process warmups do not substitute for a deployed CDN cache-hit test.
- Process-cold medians measure spawn-to-first-successful-response from already-built local artifacts. They do not model provider image boot, network scheduling, or a serverless platform's isolate lifecycle.
- All four prototypes passed production-server checks for session-cookie rendering, client interaction, deferred content, shared asset delivery, and controlled failures.

## Current-app optimization findings

Framework retention does not close the performance work exposed by the real-route audit:

- `apps/app`: `/degens` recorded the highest median LCP at 372 ms and 24 ms INP; `/leaderboards` recorded 340 ms LCP/16 ms INP. The signed-out `/dashboard/overview` gate was lighter at 104 ms. These are post-M1 controls and make public data-route hydration the highest app-local follow-up.
- `apps/docs`: the three sampled content routes transferred 626–674 KiB JavaScript; selective hydration or an Astro parity proof has a measurable target.
- `apps/smashers`: the home route transferred 3.87 MiB (3.96 MB). Asset delivery remains more material than the 30–210 KiB prototype route-JS differences.
- `apps/template`: the single route recorded 116 ms LCP, 32 ms INP, and 148 KiB JavaScript. It is healthy enough that framework fragmentation has no demonstrated payoff.
- `apps/web`: the home and roadmap controls each recorded 40 ms INP, while `/gltf/1` had the highest LCP at 324 ms. The current framework decision does not erase those interaction and dynamic-asset targets.
- `apps/api`: the root response remained browser-runtime-free at a 0.33 ms median local response; no renderer work is indicated.

These are controlled local results, not field Core Web Vitals. They identify where a follow-up should measure first; they do not establish a production regression without RUM or a comparable deployed baseline.

## Per-app decisions

“Performance winner” names what won the measured app-shaped workload. “M2 decision” also includes feature parity, deployment, maintenance, migration cost, and rollback. Keeping a framework does not mean it was fastest in every cell.

| App      | Performance winner                               | M2 decision                                       | Confidence | Why migration is not approved now                                                                                                              |
| -------- | ------------------------------------------------ | ------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| api      | Express 5                                        | Keep Express 5                                    | High       | The actual service responded about 2.3x faster than the React Router resource fixture and needs no UI runtime                                  |
| app      | Mixed: Next public; TanStack interaction; RR JS  | Keep Next.js 16                                   | High       | No candidate dominated before counting wallet, auth, route-handler, Sentry, and M1 ownership parity                                            |
| docs     | Mixed: Astro static payload; Next interactive JS | Keep Docusaurus 3 pending route parity            | Moderate   | Astro's zero-JS result is meaningful, but MDX, Mermaid, sidebars, anchors, search, and the authoring contract were not migrated or verified    |
| smashers | Mixed: TanStack public; Next interaction; RR JS  | Keep Next.js 16                                   | High       | No candidate dominated, while auth, redirects, image policy, and Sentry would also need replacement                                            |
| template | Astro                                            | Keep Next.js 16                                   | Moderate   | Astro won the synthetic runtime, but the small starter has no measured user problem large enough to justify maintaining a second default stack |
| web      | Astro                                            | Keep Next.js 16 pending an Astro leaf-route proof | Moderate   | Astro won the shaped runtime, but GLTF/embed behavior, media islands, headers, rewrites, images, and observability lack route parity           |

The binding details, rejected alternatives, expected impact, operational factors, and rollback gates are in the six app ADRs under `docs/architecture/decisions`.

## M2.5 migration execution

No production framework migration is approved. M2.5 is therefore an explicit no-op: production source, routes, dependencies, deployment configuration, metadata, themes, accessibility behavior, and observability remain unchanged. This avoids unproven parity work; it is not a finding that Next.js or Docusaurus is always the fastest framework.

### No dead parallel routes

The only alternative routes are disposable prototypes under `benchmarks/framework-prototypes`. They are outside the root workspace, have independent lockfiles, are not referenced by Turbo or Vercel configuration, and cannot shadow a production route.

### Route-by-route acceptance

Any later proposal must start with one app and obtain approval only after its candidate branch demonstrates, for every migrated route:

- identical URL, redirect, auth, data, mutation, error, metadata, theme and keyboard/screen-reader behavior;
- equal or better M0/M2 budgets for LCP, INP, CLS, transfer, client JS, memory, server response, caching and build time;
- production-equivalent hosting, image/media delivery, Sentry/observability and rollback;
- deletion of the superseded route with no parallel implementation left behind.

Rollback is a single-app revert to its accepted framework commit. No shared package or another app may depend on candidate-only APIs before route acceptance.

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

The committed evidence is synthetic lab data with moderate confidence. It establishes a decision gate, not a promise about field Core Web Vitals. Field RUM and a production-like preview remain mandatory before any future migration approval.
