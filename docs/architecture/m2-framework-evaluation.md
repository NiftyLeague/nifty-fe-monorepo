# M2 per-app framework evaluation

Status: accepted for M2 on 2026-09-07. This record closes issues #1826 through #1830 without changing a production framework.

## Evaluation method

M2 uses two evidence layers because a production application and a synthetic framework fixture answer different questions:

1. The M0/M1 controls measure every deployed application in its real route, asset, state, and hosting context.
2. The disposable M2 prototypes run Next.js, TanStack Start, Astro, and React Router Framework Mode against the same public, authenticated, data-heavy, interaction-heavy, streaming, error, and 80 KB production WebP fixtures on localhost.

Every prototype run used Chrome headless at 1365x768, five new-profile samples per route, an unthrottled local network, a synthetic click, first-byte and response-completion timing, a cache-busted request followed by an identical warm request, five fresh-process starts, and five clean plus five incremental builds. The Next control run also records five fresh-process starts for every deployable application. Process-cold startup is deliberately separate from cache-cold request timing. The prototypes are isolated under `benchmarks/framework-prototypes`; they are neither workspace applications nor deployment inputs.

Official capability references used to design the experiments are the [TanStack Start overview](https://tanstack.com/start/latest/docs/framework/react/overview), [Astro islands architecture](https://docs.astro.build/en/concepts/islands/), [Astro on-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/), [React Router rendering strategies](https://reactrouter.com/start/framework/rendering), [React Router streaming guidance](https://reactrouter.com/how-to/suspense), and [Docusaurus static generation model](https://docusaurus.io/docs/advanced/ssg).

## Current application controls

| App      | Representative control                 | Median LCP | Median JS | Median transfer | Process-cold | Build evidence                 | Current capability finding                                                         |
| -------- | -------------------------------------- | ---------: | --------: | --------------: | -----------: | ------------------------------ | ---------------------------------------------------------------------------------- |
| api      | production `/`                         |     264 ms |     0 KiB |           1 KiB |       308 ms | 3 clean + 3 incremental passes | JSON service; frontend hydration and client routing are not applicable             |
| app      | local `/degens` audit fixture after M1 |     448 ms |   413 KiB |         567 KiB |       379 ms | 3 clean + 3 incremental passes | Next SSR/static routes, handlers, hydration, wallet/auth and query cache ownership |
| docs     | production `/overview/intro`           |     596 ms |   307 KiB |       1,167 KiB |       612 ms | 3 clean + 3 incremental passes | Docusaurus build-time rendering plus hydrated client navigation                    |
| smashers | production `/`                         |     600 ms |   376 KiB |       4,047 KiB |       361 ms | 3 clean + 3 incremental passes | Next static/SSR paths, NextAuth handlers, redirects, image pipeline and Sentry     |
| template | local `/`                              |     100 ms |   149 KiB |         283 KiB |       281 ms | 3 clean + 3 incremental passes | Static Next shell with a small hydrated UI demonstration                           |
| web      | production `/`                         |     380 ms |   361 KiB |         584 KiB |       325 ms | 3 clean + 3 incremental passes | Static marketing routes plus dynamic GLTF, media islands, rewrites and headers     |

Production results include network and hosting latency and therefore establish the current application baselines only. They are not numerically compared to localhost prototype timing. Exact route ownership, SSR/SSG/streaming applicability, authentication, hydration, and cache behavior are versioned in `benchmarks/m2-framework-evaluation.json`.

## Same-fixture runtime results

Values are medians of five local production samples. Transfer includes the shared 78 KiB WebP on the public route. “JS” is JavaScript transferred for the tested route, not all build chunks.

| Candidate               | Process-cold | Public LCP | Public JS | Public transfer | Navigation        | Interaction INP |                                Streaming first byte / complete |
| ----------------------- | -----------: | ---------: | --------: | --------------: | ----------------- | --------------: | -------------------------------------------------------------: |
| Next.js 16.3.4          |       256 ms |      44 ms |   136 KiB |         227 KiB | 9.5 ms, client    |           24 ms |                                                 3.8 / 153.5 ms |
| TanStack Start 1.168.50 |       140 ms |      40 ms |   315 KiB |         399 KiB | 9.6 ms, client    |           24 ms |                                               152.4 / 152.4 ms |
| Astro 7.3.1             |       112 ms |      36 ms |     0 KiB |          93 KiB | 22.8 ms, document |           16 ms | 2.1 / 2.1 ms shell; deferred server island verified separately |
| React Router 8.3.1      |       243 ms |      48 ms |   105 KiB |         190 KiB | 35.4 ms, client   |           16 ms |                                               153.3 / 153.5 ms |

The Next prototype streamed its Suspense shell before the 150 ms deferred panel completed. Astro returned the outer page immediately and fetched its server island independently. The tested default Node output for TanStack Start and React Router did not emit this fixture before its deferred loader settled. This is an observation about these pinned prototypes, not a universal framework claim.

## Build and bundle composition

| Candidate      | Clean build | Incremental build | Client JS in build | Output note                                                              |
| -------------- | ----------: | ----------------: | -----------------: | ------------------------------------------------------------------------ |
| Next.js        |     12.81 s |           11.07 s |            880 KiB | 161.22 MiB standalone output includes traced runtime dependencies        |
| TanStack Start |      0.77 s |            0.75 s |            314 KiB | 1.33 MiB Nitro output                                                    |
| Astro          |      0.72 s |            0.73 s |            188 KiB | 1.55 MiB Node adapter output; React is isolated to the interactive route |
| React Router   |      0.42 s |            0.42 s |            315 KiB | 0.40 MiB framework build output                                          |

Build duration strongly favors the Vite-based prototypes. Raw output size is not an apples-to-apples deployment metric because the Next standalone output contains its dependency closure. Route transfer, server work, memory, request counts, cache headers, sample spread, and the full build command results remain in the JSON evidence rather than being reduced to this table.

## Caching and operational findings

- Next emitted one-year `s-maxage` for static fixtures and private no-store behavior for the authenticated and dynamic streaming routes.
- Astro’s authenticated route explicitly emitted `private, no-store`; its data route emitted `s-maxage=60`. Its static route sent no JavaScript, while the React interaction island transferred 189 KiB.
- The TanStack Start and React Router prototypes emitted no explicit cache policy. A migration would have to define and verify those policies route by route before parity.
- Warm local responses were usually faster, but these synthetic server-process warmups do not substitute for a deployed CDN cache-hit test.
- Process-cold medians measure spawn-to-first-successful-response from already-built local artifacts. They do not model provider image boot, network scheduling, or a serverless platform's isolate lifecycle.
- All four prototypes passed production-server checks for session-cookie rendering, client interaction, deferred content, shared asset delivery, and controlled failures.

## Per-app decisions

| App      | Decision          | Confidence | Primary reason                                                                                                                                                |
| -------- | ----------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| api      | Keep Express 5    | High       | UI frameworks do not improve a dedicated JSON service and would enlarge its runtime boundary                                                                  |
| app      | Keep Next.js 16   | High       | No candidate offsets migration of wallet/auth, route handlers, server/client boundaries, Sentry and M1 state ownership                                        |
| docs     | Keep Docusaurus 3 | High       | Astro wins the minimal static fixture, but the control depends on Docusaurus content taxonomy, MDX, sidebar and navigation behavior                           |
| smashers | Keep Next.js 16   | High       | Asset weight dominates; NextAuth, geolocation/redirect logic, image policy and Sentry are framework-coupled                                                   |
| template | Keep Next.js 16   | Moderate   | Astro’s zero-JS advantage disappears on the React interaction fixture, while Next maintains workspace parity                                                  |
| web      | Keep Next.js 16   | Moderate   | Astro is promising for static pages, but dynamic GLTF, media islands, image optimization, rewrites, headers and observability were not proven at route parity |

The binding details, rejected alternatives, expected impact, operational factors, and rollback gates are in the six app ADRs under `docs/architecture/decisions`.

## M2.5 migration execution

No production framework migration is approved. M2.5 is therefore an explicit no-op: production source, routes, dependencies, deployment configuration, metadata, themes, accessibility behavior, and observability remain unchanged.

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
  --output benchmarks/results/m2-next-control-2026-09-07.json

bun run benchmark:m2 --candidate tanstack-start --candidate astro --candidate react-router --build \
  --output benchmarks/results/m2-framework-candidates-2026-09-07.json

bun test test/contract/m0-baseline.test.ts test/contract/m2-framework-evaluation.test.ts
```

The committed evidence is synthetic lab data with moderate confidence. It establishes a decision gate, not a promise about field Core Web Vitals. Field RUM and a production-like preview remain mandatory before any future migration approval.
