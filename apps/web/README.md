# Nifty League Web

Public marketing site for Nifty League, built with [Astro](https://astro.build) (static output)
plus a small [Cloudflare Worker](https://developers.cloudflare.com/workers/) that owns the
special routes: DEGEN 3D viewer deep links (`/gltf/:tokenId`), referral deep links
(`/invite/...`, `/party/...`), shop/docs proxies, and the legacy short-link redirects
(`/blog`, `/OS`, `/d/:tokenId`, …).

## Architecture

- `src/pages/*.astro` — one static HTML document per marketing route. Each wraps the
  original React page component (`src/app/(main)/*/page.tsx`) which now acts as a
  **slot composer**: Astro fills named `webIsland*` slots with hydrated React islands
  (`client:load` / `client:visible`); anything not islanded renders as static HTML.
- `src/layouts/Base.astro` — document shell (metadata, canonical, fonts, analytics
  bootstrap). `src/layouts/Marketing.astro` adds the shared Navbar/Footer islands.
- `src/pages/shells/gltf.astro` + `src/pages/shells/referral.astro` — minimal shells the
  Worker serves for the special routes (they are **not** publicly routable).
- `src/runtime/` — app-local shims shared by the React components: the image component
  and manifest (`Image.tsx`, `image-props.mjs`, generated variants in `.web-images/`),
  native navigation (`Link.tsx`), the `next/dynamic` replacement (`client-only.tsx`),
  metadata, and lazy telemetry (`telemetry.ts`).
- `worker/routes.mjs` — pure routing functions (redirects, proxies, deep links) covered
  by `checks/routes.node.mjs`; `worker/index.ts` applies them on Cloudflare.
- `publicDir` points at the shared `../../assets` directory; no app-local `public/`.

## Commands

```bash
bun run dev          # astro dev on :3000 (prepares image variants first)
bun run build        # prepare images → astro build → finalize static output → size checks
bun run start        # wrangler dev on :3000 (serves dist/ through the Worker locally)
bun run preview      # build, then wrangler dev
bun run type-check   # astro check
bun run test         # bun unit tests (components, hooks, worker contract)
bun run test:routes  # node --test suite for worker/routes.mjs + image ladder
bun run test:e2e     # build + playwright against wrangler dev on :4337
bun run cloudflare:build   # build + wrangler deploy --dry-run
bun run performance:compare  # lighthouse before/after harness (needs two deployed origins)
```

## Environment variables

All build-time configuration uses Astro's `PUBLIC_*` convention (see `.env.example`):

- `PUBLIC_DEPLOY_ENV` — `production` enables analytics/telemetry.
- `PUBLIC_TELEMETRY` — set to `false` to disable analytics even in production.
- `PUBLIC_INFURA_ID` — optional; RPC endpoint for the NFTL claimable read on GLTF pages.

Worker runtime variables (e.g. `DEPLOY_ENV`) are set in `wrangler.jsonc` and the
Cloudflare dashboard — no Vercel involvement.

## Deployment

Deployed as a Cloudflare Worker with static assets (`wrangler.jsonc`). The Worker name is
deliberately isolated until the production cutover is confirmed; static marketing assets
bypass the Worker entirely. Cloudflare handles headers via the generated `_headers` file
(`scripts/finalize-static.mjs`).

> Never commit `.env.local` — it is gitignored.
