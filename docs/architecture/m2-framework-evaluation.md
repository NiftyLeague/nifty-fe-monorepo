# M2 per-app framework evaluation

Status: proposed in PR #1854 on 2026-09-08. This record addresses issues #1826 through #1830 without changing a production framework.

## Evaluation method

M2 uses two evidence layers because a production application and a synthetic framework fixture answer different questions:

1. Real application controls measure 18 routes across all six deployable applications with their actual route, asset, state, and framework behavior.
2. Disposable M2 prototypes run Next.js, TanStack Start, Astro, and React Router Framework Mode against both a common fixture and app-shaped workloads. Those workloads vary asset count, content/data volume, interactive nodes, authentication and streaming according to each application.

Every run used Chrome headless at 1365x768, five new-profile samples per browser route, an unthrottled local network, a synthetic click where applicable, first-byte and response-completion timing, a cache-busted request followed by an identical warm request, five fresh-process starts, and five clean plus five incremental prototype builds. The API resource comparison is server-only. The Next control run also records five fresh-process starts for every deployable application. Process-cold startup is deliberately separate from cache-cold request timing. The prototypes are isolated under `benchmarks/framework-prototypes`; they are neither workspace applications nor deployment inputs.

The earlier 2026-09-07 report used one generic workload and only one real route per application. It was insufficient to determine per-app fit and is superseded by the two `m2-per-app-*` reports dated 2026-09-08.

Official capability references used to design the experiments are the [TanStack Start overview](https://tanstack.com/start/latest/docs/framework/react/overview), [Astro islands architecture](https://docs.astro.build/en/concepts/islands/), [Astro on-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/), [React Router rendering strategies](https://reactrouter.com/start/framework/rendering), [React Router streaming guidance](https://reactrouter.com/how-to/suspense), and [Docusaurus static generation model](https://docusaurus.io/docs/advanced/ssg).

## Current application controls

| App      | Actual routes measured | Median LCP range | Median JS range | Median transfer range | Process-cold | Current capability finding                                                         |
| -------- | ---------------------: | ---------------: | --------------: | --------------------: | -----------: | ---------------------------------------------------------------------------------- |
| api      |                      1 |              n/a |           0 KiB |                 3 KiB |       410 ms | JSON service; frontend hydration and client routing are not applicable             |
| app      |                      5 |       104–400 ms |     317–412 KiB |           454–578 KiB |       380 ms | Next SSR/static routes, handlers, hydration, wallet/auth and query cache ownership |
| docs     |                      3 |       216–240 ms |     626–674 KiB |         888–1,739 KiB |       511 ms | Docusaurus build-time rendering plus hydrated client navigation                    |
| smashers |                      4 |        52–364 ms |     289–391 KiB |         496–3,959 KiB |       342 ms | Next static/SSR paths, NextAuth handlers, redirects, image pipeline and Sentry     |
| template |                      1 |           112 ms |         148 KiB |               281 KiB |       286 ms | Static Next shell with a small hydrated UI demonstration                           |
| web      |                      4 |        64–328 ms |     161–300 KiB |           291–563 KiB |       315 ms | Static marketing routes plus dynamic GLTF, media islands, rewrites and headers     |

These controls are local production builds so they expose real application weight without production-network noise. They are not route-parity implementations of the prototypes and are not used as direct framework speed comparisons. Exact route ownership, SSR/SSG/streaming applicability, authentication, hydration, and cache behavior are versioned in `benchmarks/m2-framework-evaluation.json`.

## Same-fixture runtime results

Values are medians of five local production samples. Transfer includes the shared 78 KiB WebP on the public route. “JS” is JavaScript transferred for the tested route, not all build chunks.

| Candidate               | Process-cold | Public LCP | Public JS | Public transfer | Interaction INP |
| ----------------------- | -----------: | ---------: | --------: | --------------: | --------------: |
| Next.js 16.3.4          |       283 ms |      56 ms |   135 KiB |         220 KiB |           16 ms |
| TanStack Start 1.168.50 |       347 ms |     164 ms |   315 KiB |         399 KiB |           20 ms |
| Astro 7.3.1             |       362 ms |      64 ms |     0 KiB |          94 KiB |           32 ms |
| React Router 8.3.1      |       613 ms |     104 ms |   106 KiB |         190 KiB |           20 ms |

Next streamed its shell in 8 ms and completed the deferred content in 158 ms. TanStack Start and React Router completed their single responses in 154 ms. Astro returned the 7 KiB shell in 7 ms and requested its deferred server island separately. These are observations about pinned prototypes, not universal framework claims. INP is reported only when Chrome's Event Timing observer records an event of at least 16 ms; a null value means below that threshold, not a failed click.

## App-shaped framework results

Each row below uses identical query-controlled workload volume within that application. The values are medians of five runs. “Public” shows LCP and route JavaScript; “interaction” shows LCP and the synthetic click INP. This table answers framework-runtime fit. The real-route controls above answer how heavy the applications actually are.

| App      | Candidate             |  Public LCP / JS | Interaction LCP / INP | Performance reading                                                      |
| -------- | --------------------- | ---------------: | --------------------: | ------------------------------------------------------------------------ |
| api      | Express control       |      n/a / 0 KiB |                   n/a | 0.45 ms median local response                                            |
| api      | React Router resource |      n/a / 0 KiB |                   n/a | 1.22 ms median local response; no service advantage                      |
| app      | Next.js               |  96 ms / 135 KiB |            44 / 16 ms | Fastest interaction render; middle JS                                    |
| app      | TanStack Start        |  48 ms / 315 KiB |            52 / 24 ms | Fast public render, 2.3x Next route JS                                   |
| app      | React Router          |  52 ms / 105 KiB |            52 / 16 ms | Best public-render/JS balance in the prototype                           |
| docs     | Next.js reference     |  40 ms / 135 KiB |            40 / 16 ms | Fastest interaction render but hydrates static content                   |
| docs     | Astro                 |    76 ms / 0 KiB |          140 / <16 ms | Static payload winner; React island is 189 KiB                           |
| docs     | React Router          |  40 ms / 105 KiB |            92 / 16 ms | Smaller than Next, but not static-first                                  |
| smashers | Next.js               |  64 ms / 135 KiB |            40 / 16 ms | Best measured interaction/render balance with assets held constant       |
| smashers | TanStack Start        |  80 ms / 315 KiB |            48 / 16 ms | No route-JS advantage                                                    |
| smashers | React Router          |  68 ms / 105 KiB |           132 / 16 ms | Less JS, slower interaction rendering; assets still dominate transfer    |
| template | Next.js               |  40 ms / 135 KiB |            76 / 16 ms | Fastest measured render timing                                           |
| template | Astro                 |   210 ms / 0 KiB |           130 / 16 ms | Zero-JS static payload, slower local LCP in this run                     |
| template | React Router          | 100 ms / 105 KiB |           100 / 20 ms | Smallest interactive JS, middle render timing                            |
| web      | Next.js               | 116 ms / 135 KiB |            80 / 16 ms | Middle result                                                            |
| web      | Astro                 |    56 ms / 0 KiB |           144 / 32 ms | Static-route payload and LCP winner; island cost applies only where used |
| web      | React Router          | 104 ms / 105 KiB |            64 / 16 ms | Best measured interactive result                                         |

## Build and bundle composition

| Candidate      | Clean build | Incremental build | Client JS in build | Output note                                                              |
| -------------- | ----------: | ----------------: | -----------------: | ------------------------------------------------------------------------ |
| Next.js        |     14.94 s |           13.72 s |            880 KiB | 161.17 MiB standalone output includes traced runtime dependencies        |
| TanStack Start |      1.82 s |            2.62 s |            315 KiB | 1.33 MiB Nitro output                                                    |
| Astro          |      1.62 s |            1.57 s |            188 KiB | 1.56 MiB Node adapter output; React is isolated to the interactive route |
| React Router   |      1.89 s |            1.52 s |            316 KiB | 0.40 MiB framework build output                                          |

Build duration strongly favors the Vite-based prototypes. Raw output size is not an apples-to-apples deployment metric because the Next standalone output contains its dependency closure. Route transfer, server work, memory, request counts, cache headers, sample spread, and the full build command results remain in the JSON evidence rather than being reduced to this table.

## Caching and operational findings

- Next emitted one-year `s-maxage` for static fixtures and private no-store behavior for the authenticated and dynamic streaming routes.
- Astro’s authenticated route explicitly emitted `private, no-store`; its data route emitted `s-maxage=60`. Its static route sent no JavaScript, while the React interaction island transferred 189 KiB.
- The TanStack Start and React Router prototypes emitted no explicit cache policy. A migration would have to define and verify those policies route by route before parity.
- Warm local responses were usually faster, but these synthetic server-process warmups do not substitute for a deployed CDN cache-hit test.
- Process-cold medians measure spawn-to-first-successful-response from already-built local artifacts. They do not model provider image boot, network scheduling, or a serverless platform's isolate lifecycle.
- All four prototypes passed production-server checks for session-cookie rendering, client interaction, deferred content, shared asset delivery, and controlled failures.

## Per-app decisions

“Performance winner” names what won the measured app-shaped workload. “M2 decision” also includes feature parity, deployment, maintenance, migration cost, and rollback. Keeping a framework does not mean it was fastest in every cell.

| App      | Performance winner                                     | M2 decision                                       | Confidence | Why migration is not approved now                                                                                                                   |
| -------- | ------------------------------------------------------ | ------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| api      | Express 5                                              | Keep Express 5                                    | High       | The actual service responded about 2.7x faster than the React Router resource fixture and needs no UI runtime                                       |
| app      | Mixed: React Router public/JS; Next interactive render | Keep Next.js 16                                   | High       | No candidate dominated before counting wallet, auth, route-handler, Sentry, and M1 ownership parity                                                 |
| docs     | Mixed: Astro static payload; Next interaction render   | Keep Docusaurus 3 pending route parity            | Moderate   | Astro's zero-JS result is meaningful, but MDX, Mermaid, sidebars, anchors, search, and the authoring contract were not migrated or verified         |
| smashers | Next.js for the asset-heavy mixed workload             | Keep Next.js 16                                   | High       | Next led the measured runtime balance, while auth, redirects, image policy, and Sentry would also need replacement                                  |
| template | Mixed: Astro static payload; Next render timing        | Keep Next.js 16                                   | Moderate   | The small starter has no measured user problem large enough to justify maintaining a second default stack                                           |
| web      | Astro static; React Router interactive                 | Keep Next.js 16 pending an Astro leaf-route proof | Moderate   | Neither alternative dominates the mixed app, and GLTF/embed behavior, media islands, headers, rewrites, images, and observability lack route parity |

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

bun run benchmark:m2 --candidate next-control --build \
  --output benchmarks/results/m2-per-app-next-control-2026-09-08.json

bun run benchmark:m2 --candidate tanstack-start --candidate astro --candidate react-router --build \
  --output benchmarks/results/m2-per-app-candidates-2026-09-08.json

bun test test/contract/m0-baseline.test.ts test/contract/m2-framework-evaluation.test.ts
```

The committed evidence is synthetic lab data with moderate confidence. It establishes a decision gate, not a promise about field Core Web Vitals. Field RUM and a production-like preview remain mandatory before any future migration approval.
