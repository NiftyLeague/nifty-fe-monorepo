# M2 app framework decision

## Status and decision

Accepted: keep Next.js 16 App Router for `apps/app`; reject TanStack Start and React Router migration at M2. Confidence is high. Expected impact is preservation of the M1 state/data architecture with no framework churn.

## Measured evidence

Five actual routes were measured: `/degens`, `/games`, `/leaderboards`, `/mint-o-matic`, and `/dashboard/overview`. Their median LCPs ranged from 104–400 ms, JavaScript from 317–412 KiB, and transfer from 454–578 KiB. In the app-shaped workload, Next's public route was 96 ms LCP/135 KiB JS and interaction route 44 ms LCP/16 ms INP. TanStack Start was 48/315 KiB and 52/24 ms; React Router was 52/105 KiB and 52/16 ms. React Router wins the public-render/JS balance and Next wins interaction render timing; no candidate dominates the mixed workload. The alternatives’ faster builds remain real.

## Hosting and operations

The app uses Vercel’s Next path, Next image policy, route handlers, shared package transpilation, native-module externals and production-only Sentry wrapping. Both alternatives require a new adapter, deployment-output contract, cache policy and observability integration.

## Authentication and data

Wallet, Immutable, protected-route gates, audit fixtures, server request prefetch and TanStack Query hydration cross Next server/client boundaries. TanStack Start aligns with typed routing and Query, but its tested route transferred 2.3 times Next's JavaScript. React Router reduced route JavaScript by about 22% and improved the public prototype, but it does not eliminate the external wallet/chain complexity or prove route parity.

## SEO, accessibility, and observability

Public collection metadata and server HTML, authenticated fallbacks, keyboard behavior, error/loading boundaries and Sentry traces must remain exact. The prototypes prove generic equivalents only; they do not prove those app-specific surfaces.

## Migration friction and maintenance

A migration would touch every layout, route handler, server/client marker, image, navigation call, query hydration boundary, Sentry entry and deployment assumption immediately after M1 stabilized ownership. No measured gain pays that cost. Keeping Next also preserves parity with other React apps and shared UI.

## Rollback and route acceptance

No routes move. A future candidate must begin with one leaf route, reproduce wallet and audit-fixture auth, server-prefetched Query hydration, metadata, images, errors, accessibility and M0/M1 budgets, then delete the old route before expansion. Rollback is a route commit revert with Next remaining authoritative.
