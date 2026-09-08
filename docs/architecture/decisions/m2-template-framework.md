# M2 template framework decision

## Status and decision

Accepted: keep Next.js 16 App Router for `apps/template`; do not migrate to Astro or React Router in M2. Confidence is moderate because the template is intentionally small and may change with future product needs. Expected impact is continued workspace consistency.

## Measured evidence

The local template control recorded median 100 ms LCP, 3.2 ms TTFB, 16 ms INP, 149 KiB JavaScript, 283 KiB transfer and 5.4 MiB memory. Astro sent zero JavaScript on the static fixture but 189 KiB when the equivalent React interaction island was enabled. Next’s interactive fixture sent 136 KiB. React Router sent 104 KiB on the interaction route but would replace the established app template for a small synthetic delta.

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
