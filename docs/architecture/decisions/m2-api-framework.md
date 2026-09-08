# M2 API framework decision

## Status and decision

Accepted: keep Express 5 for `apps/api`. React Router resource routes were considered only as a consolidation candidate; no migration is approved. Confidence is high. Expected impact is zero production behavior change and preservation of the smallest service boundary.

## Measured evidence

The production root control recorded median 264 ms LCP/199 ms TTFB, 1 KiB transfer, zero client JavaScript and 0.8 MiB browser memory across five runs. Three clean and three incremental API builds passed. The React Router fixture builds quickly, but that frontend result does not improve an API whose representative output is JSON and already ships no browser runtime.

## Hosting and operations

The service is packaged as one Vercel Function with an Express rewrite, copied configuration/contracts, a 30-second duration limit and endpoint-specific cache behavior. Moving handlers into a frontend router would combine failure domains and require re-proving deployment packaging, timeouts, request limits and every public endpoint.

## Authentication and data

Authentication, validation, chain data, cached assets and proxy policy are server concerns here. A UI router adds no ownership benefit. The current Express middleware/handler composition remains the rollback-safe boundary.

## SEO, accessibility, and observability

SEO, hydration and browser accessibility do not apply to JSON endpoints. Response semantics, structured errors, security headers, logs and Sentry/server telemetry remain the relevant acceptance surface.

## Migration friction and maintenance

A React Router move would rewrite routing and Vercel packaging without reducing client bytes or solving a measured API bottleneck. It would also couple API releases to a frontend framework lifecycle. The team already owns the tested Express path.

## Rollback and route acceptance

No routes move. Any future replacement must prove all endpoint contracts, status/header/body parity, security controls, cold starts, cache policy, 30-second behavior and deployment packaging before traffic switches. Rollback is a single-app revert to the accepted Express artifact.
