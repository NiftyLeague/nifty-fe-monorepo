# Nifty League App

## Deployments

- main: [app.niftyleague.com](https://app.niftyleague.com)
- staging: [staging.app.niftyleague.com](https://staging.app.niftyleague.com)

## Info

The web3 app is built on [TanStack Start](https://tanstack.com/start) (React +
[TanStack Router](https://tanstack.com/router) file routes, bundled by Vite and
deployed to Vercel through [Nitro](https://nitro.build)).

## Getting Started

### Set up environment variables

Copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
vercel env pull .env.local   # preferred: pulls from Vercel (source of truth)
# fallback: cp .env.example .env.local
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
bun run build    # production build into .vercel/output
bun run preview  # serve the production build locally
bun test         # bun:test unit and component tests
bun run type-check
```

## Environment Variables

Environment variables are managed in **Vercel** (source of truth). Sync them locally:

```bash
# Link this project to its Vercel project (one-time)
vercel link --scope niftyleague

# Pull all env vars into .env.local (gitignored)
vercel env pull .env.local
```

To push local changes back to Vercel:

```bash
vercel env push .env.local
# or set them per-environment (Production / Preview) in the Vercel dashboard
```

> Never commit `.env.local` — it is gitignored. For team projects use `vercel --scope niftyleague`.
