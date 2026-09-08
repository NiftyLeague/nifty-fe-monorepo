# M2 docs framework decision

## Status and decision

Accepted: keep Docusaurus 3 for `apps/docs`; do not migrate to Astro in M2. Confidence is moderate because Astro is the measured static-performance winner and deserves a route-parity proof. Expected impact is stable content authoring and routing, with performance work remaining inside Docusaurus.

## Measured evidence

The actual overview, traits, and battle-guide controls recorded 216–240 ms median LCP, 626–674 KiB JavaScript, and 888–1,739 KiB transfer. In the docs-shaped workload, Astro sent zero JavaScript on the public route at 76 ms LCP; Next and React Router both recorded 40 ms while sending 135 KiB and 105 KiB respectively. Astro's React interaction island sent 189 KiB and rendered at 140 ms, versus Next's 136 KiB/40 ms and React Router's 105 KiB/92 ms. Astro clearly wins static payload, but not every runtime metric, and this does not prove migration parity for the real documentation corpus.

## Hosting and operations

Docusaurus builds CDN-ready HTML with no server runtime. Astro can do the same and has official adapters for dynamic output, but dynamic hosting is unnecessary here. The current deployment, broken-link gate and static asset model remain simpler than a content-platform rewrite.

## Authentication and data

The docs are public and have no authenticated data path. Their significant data contract is build-time MDX, sidebars, Mermaid, generated navigation and future localization/versioning support, all owned by Docusaurus today.

## SEO, accessibility, and observability

Both candidates can emit accessible static HTML and metadata. The migration gate includes heading IDs, deep links, sidebars, code blocks, Mermaid, search/index behavior, keyboard navigation, sitemap/canonical metadata and client navigation. The minimal Astro fixture does not cover that corpus.

## Migration friction and maintenance

Astro would reduce static-page JavaScript, but recreating the established docs taxonomy, preset/theme behavior, edit links and contributor workflow is a substantial content migration. The lower-risk next action is Docusaurus bundle analysis and selective hydration reduction, not framework replacement.

## Rollback and route acceptance

No routes move. Any renewed Astro proposal must convert a representative guide subtree, verify every generated URL and heading anchor, match MDX/Mermaid/sidebar/search behavior, beat the docs control, and support an atomic DNS/deployment rollback. Parallel public doc trees are forbidden.
