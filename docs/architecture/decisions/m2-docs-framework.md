# M2 docs framework decision

## Status and decision

Accepted: keep Docusaurus 3 for `apps/docs`; do not migrate to Astro in M2. Confidence is high. Expected impact is stable content authoring and routing, with performance work remaining inside Docusaurus.

## Measured evidence

The production overview control recorded median 596 ms LCP, 236 ms TTFB, 307 KiB JavaScript, 1,167 KiB transfer and 6.7 MiB memory. Astro’s equivalent static fixture used zero JavaScript and 93 KiB total transfer including the shared 78 KiB image; its React island route used 189 KiB JavaScript. This proves Astro’s static advantage but not migration parity for the real documentation corpus.

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
