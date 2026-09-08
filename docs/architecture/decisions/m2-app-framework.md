# M2 app framework decision

## Status and decision

Accepted: keep Next.js 16 App Router for `apps/app`; reject TanStack Start and React Router migration at M2. Confidence is high. Expected impact is preservation of the M1 state/data architecture with no framework churn.

## Measured evidence

The M1 local `/degens` control recorded median 448 ms LCP, 11.9 ms TTFB, 16 ms INP, 413 KiB JavaScript, 567 KiB transfer and 8.4 MiB memory. In the same synthetic fixture, Next transferred 136 KiB JavaScript, React Router 105 KiB and TanStack Start 315 KiB. The alternatives’ faster builds are real, but neither demonstrates the production app’s wallet/auth/data behavior or a decisive route-runtime improvement.

## Hosting and operations

The app uses Vercel’s Next path, Next image policy, route handlers, shared package transpilation, native-module externals and production-only Sentry wrapping. Both alternatives require a new adapter, deployment-output contract, cache policy and observability integration.

## Authentication and data

Wallet, Immutable, protected-route gates, audit fixtures, server request prefetch and TanStack Query hydration cross Next server/client boundaries. TanStack Start aligns with typed routing and Query, but its tested route transferred more JavaScript and its official overview still labels Start a release candidate. React Router would replace the route and hydration contract without eliminating the external wallet/chain complexity.

## SEO, accessibility, and observability

Public collection metadata and server HTML, authenticated fallbacks, keyboard behavior, error/loading boundaries and Sentry traces must remain exact. The prototypes prove generic equivalents only; they do not prove those app-specific surfaces.

## Migration friction and maintenance

A migration would touch every layout, route handler, server/client marker, image, navigation call, query hydration boundary, Sentry entry and deployment assumption immediately after M1 stabilized ownership. No measured gain pays that cost. Keeping Next also preserves parity with other React apps and shared UI.

## Rollback and route acceptance

No routes move. A future candidate must begin with one leaf route, reproduce wallet and audit-fixture auth, server-prefetched Query hydration, metadata, images, errors, accessibility and M0/M1 budgets, then delete the old route before expansion. Rollback is a route commit revert with Next remaining authoritative.
