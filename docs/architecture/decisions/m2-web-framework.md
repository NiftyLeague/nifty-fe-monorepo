# M2 web framework decision

## Status and decision

Accepted: keep Next.js 16 App Router for `apps/web`; do not migrate to Astro or React Router in M2 even though Astro won the measured web-shaped runtime. Confidence is moderate. Astro remains the strongest candidate if a future route-level proof covers the actual marketing and GLTF surfaces. Expected impact is zero migration risk now.

## Measured evidence

Four actual routes were measured: `/`, `/games`, `/roadmap`, and `/gltf/1`. Their median LCPs ranged from 68–324 ms, JavaScript from 161–300 KiB, and transfer from 291–581 KiB. In the web-shaped public workload Astro delivered 40 ms LCP with zero JavaScript, Next 44 ms/135 KiB, and React Router 44 ms/105 KiB. In the interaction workload Astro's React island rendered at 36 ms/16 ms INP with 189 KiB JS, Next at 40/16 ms with 136 KiB, and React Router at 44/20 ms with 105 KiB. Astro is the synthetic runtime winner, but this does not establish whole-app parity for the dynamic GLTF/embed path or production operations.

## Hosting and operations

Web uses Vercel Next output, image optimization, Sentry, inline route CSS, external shop/docs rewrites, redirects, static-chunk CORS for embedded GLTF and environment-specific destinations. Astro has a Vercel adapter, but every rule and preview/production distinction would need reimplementation and deployed verification.

## Authentication and data

The site has no primary authenticated route, which favors Astro. However, `/gltf/[tokenId]` is dynamic, embedded and asset-sensitive, and media/roadmap surfaces are interactive. The server-island prototype validates deferred content generically, not GLTF or embed policy.

## SEO, accessibility, and observability

Canonical metadata, social previews, sitemap, redirects, responsive media, reduced-motion behavior, keyboard access, embedded-route CORS and Sentry are required. The static prototype covers only basic metadata and alt text, so approving a full migration would overstate its evidence.

## Migration friction and maintenance

Astro would require translating layouts and deciding island boundaries for every interactive/media component while retaining shared React UI. That can be worthwhile only after a real route proof shows material field and bundle gains. React Router offers less static specialization and no stronger app fit.

## Rollback and route acceptance

No routes move. A future Astro proof should start with one static marketing leaf, reuse production assets, match metadata/theme/accessibility, improve budgets, and remove the old route before proceeding. The dynamic GLTF/embed route is a separate final gate. Rollback must restore the prior Vercel deployment without DNS or URL changes.
