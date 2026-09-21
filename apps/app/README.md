# Nifty League App

## Deployments

- main: [app.niftyleague.com](https://app.niftyleague.com)
- staging: [staging.app.niftyleague.com](https://staging.app.niftyleague.com)

## Info

The web3 app is built on [TanStack Start](https://tanstack.com/start) (Solid +
[TanStack Router](https://tanstack.com/router) file routes, bundled by Vite and
deployed to Cloudflare Workers through [Nitro](https://nitro.build)).

## Getting Started

### Set up environment variables

Copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local   # then fill in the values from the shared secret store
```

Local development runs the **testnet mirror** end to end: with
`VITE_NETWORK=sepolia`, sandbox Immutable URLs, and `VITE_DEPLOY_ENV`
anything other than `production` (the local default is `development`), the
app targets `immutableZkEvmTestnet` and the Immutable sandbox — burn,
spend, and mint flows exercise testnet contracts with no real money and no
contract deployment needed. The deployed preview builds use the same
values via the `Preview – app` GitHub environment; production secrets stay
mainnet on `Production – app`.

Because the app is SSR, the reliable local loop is a testnet production
build served locally (the nitro-beta `vite dev` worker sandbox is flaky
under bun's isolated layout):

```bash
NITRO_PRESET=node-server bun run build && node .output/server/index.mjs
```

Client-visible settings use the `VITE_` prefix and are read through
`src/runtime/env.ts`. Never put a secret behind `VITE_` — those values are
embedded in the browser bundle.

### Run the development server

```bash
bun dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Project layout

| Path              | Purpose                                                         |
| ----------------- | --------------------------------------------------------------- |
| `src/routes/**`   | File-based routes. `__root.tsx` owns the HTML document shell.   |
| `src/pages/**`    | Route components and dialogs, grouped by feature.               |
| `src/layouts/**`  | Shared app shell, header, sidebar, and public navigation.       |
| `src/runtime/**`  | Framework adapters: router hooks, link, lazy loading, metadata. |
| `src/server/**`   | Server-only request handlers and SEO document generators.       |
| `src/contexts/**` | Wallet, network, and feature-flag providers.                    |
| `src/url/**`      | nuqs search-param parsers and normalization.                    |

`src/routeTree.gen.ts` is generated from `src/routes/**` on the first `dev` or
`build` run. It is committed because `type-check` reads it, but never edit it by
hand.

## Scripts

```bash
bun dev          # Vite dev server on :3001
bun run build    # production build into .output/ (Cloudflare Workers)
bun run preview  # serve the production build locally
bun test         # bun:test unit and component tests
bun run type-check
```

## Performance benchmarks

`scripts/benchmark.mjs` runs Lighthouse against a running build and writes a
JSON report plus a console table.

```bash
bun run build
bunx vite preview --port 4402 --strictPort
BENCH_RUNS=3 node scripts/benchmark.mjs http://localhost:4402 baseline
```

Options: `BENCH_RUNS` (per route, median reported), `BENCH_FORMS`
(`mobile,desktop`), `BENCH_THROTTLE` (`devtools` or `simulate`), and an optional
routes file argument. `scripts/measure-eager.mjs` reports just the initial script
payload for a route, which is useful when a score drops.

Use `BENCH_THROTTLE=devtools` (the default) when comparing scores. Lighthouse's
`simulate` mode models the network analytically and under-reports this app by
roughly 15 points, which is enough to hide or invent a regression.

Compare against the pre-migration build with a checkout of the parent
commit: build `apps/app`, serve it on another port, and pass that URL as the
base. Local builds are unminified for transfer-size purposes but the request
counts and timings remain comparable.

Reports land in `artifacts/benchmarks/` (gitignored).

## Environment Variables

Client-visible `VITE_*` values are build-time: they are GitHub environment
secrets on the `Production – app` / `Preview – app` environments, and the
Workers deploy has no runtime secrets beyond them.

> Never commit `.env.local` — it is gitignored.
