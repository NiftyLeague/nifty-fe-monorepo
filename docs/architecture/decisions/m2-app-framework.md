# M2 app framework decision

## Status and decision

Accepted: keep Next.js 16 App Router for `apps/app` at M2; keep TanStack Start and React Router Framework Mode (the current Remix lineage) as evaluated alternatives, not production routes. Confidence is high. Expected impact is preservation of the M1 state/data architecture with no framework churn.

## Measured evidence

Five actual routes were measured after M1 merged: `/degens`, `/games`, `/leaderboards`, `/mint-o-matic`, and `/dashboard/overview`. Their median LCPs ranged from 72–408 ms, JavaScript from 327–414 KiB, and transfer from 455–578 KiB. In the app-shaped workload, Next's public route was 48 ms LCP/135 KiB JS, authenticated 36/135, data-heavy 40/135, interaction 44 ms/24 ms INP, and streaming 40 ms. TanStack Start was 40/315, 40/315, 36/315, 40/32, and 192 ms respectively. React Router was 40/105, 36/105, 40/105, 48/24, and 196 ms. TanStack wins public/data LCP, React Router sends the least JS, and Next wins streaming/interaction INP. No candidate dominates. The alternatives’ faster builds remain real.

## Hosting and operations

The app uses Vercel’s Next path, Next image policy, route handlers, shared package transpilation, native-module externals and production-only Sentry wrapping. Both alternatives require a new adapter, deployment-output contract, cache policy and observability integration. Cloudflare documents a first-party TanStack Start Workers path and a React Router Cloudflare template; Next on Workers requires the Cloudflare `vinext` path for new projects or OpenNext compatibility for an existing app. Those options make a future Cloudflare preview worthwhile, but do not replace route-parity evidence.

## Authentication and data

Wallet, Immutable, protected-route gates, audit fixtures, server request prefetch and TanStack Query hydration cross Next server/client boundaries. TanStack Start aligns with typed routing and Query, but its tested route transferred 2.3 times Next's JavaScript. React Router reduced route JavaScript by about 22% and improved the public prototype, but it does not eliminate the external wallet/chain complexity or prove route parity.

## SEO, accessibility, and observability

Public collection metadata and server HTML, authenticated fallbacks, keyboard behavior, error/loading boundaries and Sentry traces must remain exact. The prototypes prove generic equivalents only; they do not prove those app-specific surfaces.

## Migration friction and maintenance

A migration would touch every layout, route handler, server/client marker, image, navigation call, query hydration boundary, Sentry entry and deployment assumption immediately after M1 stabilized ownership. TanStack’s build/cold-start advantage is meaningful, but its 2.3x route JavaScript and unverified app-specific parity leave the migration case unproven. Keeping Next also preserves parity with other React apps and shared UI.

## Rollback and route acceptance

No routes move. A future candidate must begin with one leaf route, reproduce wallet and audit-fixture auth, server-prefetched Query hydration, metadata, images, errors, accessibility and M0/M1 budgets, then delete the old route before expansion. Rollback is a route commit revert with Next remaining authoritative.
