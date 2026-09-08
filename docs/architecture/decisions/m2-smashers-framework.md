# M2 Smashers framework decision

## Status and decision

Accepted: keep Next.js 16 App Router for `apps/smashers`; reject TanStack Start and React Router migration at M2. Confidence is high. Expected impact is no production behavior change while asset work remains the dominant optimization target.

## Measured evidence

The production home control recorded median 600 ms LCP, 247 ms TTFB, 16 ms INP, 376 KiB JavaScript, 4,047 KiB transfer and 7.7 MiB memory. React Router’s generic fixture transferred less route JavaScript than Next, while TanStack Start transferred more, but the app’s multi-megabyte asset transfer dwarfs that synthetic delta. The successful Smashers build evidence contains three clean and three incremental runs.

## Hosting and operations

Smashers relies on Vercel-aware country redirects, store/referral routes, Next image remote patterns, generated sitemap output, shared package transpilation and production Sentry wrapping. Alternative adapters must reproduce all of these before any routing change.

## Authentication and data

NextAuth v4 route handlers, profile sessions, PlayFab data, edge geography and referral state are framework-coupled. Replacing them would be an authentication migration as well as a renderer migration; the disposable prototypes prove only a synthetic cookie loader.

## SEO, accessibility, and observability

Home/store metadata, social previews, sitemap, redirects, responsive images, keyboard access, error states and Sentry traces are release requirements. Both React alternatives support equivalents, but no app-specific parity evidence exists.

## Migration friction and maintenance

The likely performance return is smaller than optimizing posters, media, image sizing and hydration inside the current app. A router rewrite would add auth and redirect risk while leaving the largest transfer source unchanged.

## Rollback and route acceptance

No routes move. A future proof must start with one public leaf route, retain country/store/referral behavior and images, then separately prove NextAuth/profile and PlayFab flows before approval. It must remove the superseded path and permit an atomic Vercel rollback.
