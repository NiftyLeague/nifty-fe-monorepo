# M2 template framework decision

## Status and decision

Accepted: keep Next.js 16 App Router for `apps/template`; do not migrate to Astro or React Router in M2. Confidence is moderate because the template is intentionally small and may change with future product needs. Expected impact is continued workspace consistency.

## Measured evidence

The actual template route recorded 112 ms median LCP, 28 ms INP, 148 KiB JavaScript, and 281 KiB transfer. In the template-shaped public workload Astro sent zero JavaScript at 210 ms LCP; Next was 40 ms/135 KiB and React Router 100 ms/105 KiB. For the interaction workload Next rendered fastest at 76 ms, React Router at 100 ms, and Astro at 130 ms; recorded INP was 16, 20, and 16 ms respectively. Astro wins static payload while Next wins the measured render timings, so there is no single winner across metrics.

## Hosting and operations

The template inherits the monorepo’s Next, React, shared UI, image sizes and Bun/Turbo conventions. Adding another default framework increases scaffolding, deployment and dependency maintenance even if its isolated build is faster.

## Authentication and data

The current template has no auth or data-heavy route. Next keeps those full-stack paths available without choosing a second stack prematurely. If the template becomes strictly content-only, Astro should be re-evaluated then.

## SEO, accessibility, and observability

The current route’s metadata, theme, responsive layout, progress interaction and keyboard behavior are the acceptance surface. All candidates can support them; the measured interactive bundle does not establish an Astro win.

## Migration friction and maintenance

Maintaining one representative Next starter reduces cognitive and upgrade overhead for the apps that consume shared React UI. React Router’s smaller tested route and faster build are noted, but not enough to fragment the template contract.

## Rollback and route acceptance

No route moves. A future change requires an explicit template mission, equivalent shared UI and interaction behavior, lower route budgets, documented deployment scaffolding and deletion of the old template. Rollback is restoration of the single Next template directory.
