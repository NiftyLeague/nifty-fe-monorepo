/**
 * Single source of truth for the roadmap poster's image pipeline.
 *
 * The page's `<Image>` (roadmap.mdx) and the LCP preload (Head.astro) must
 * describe the same variants — the preload resolves its `imagesrcset` through
 * `getImage` with exactly these options so the hashed URLs match what the
 * `<Image>` srcset emits, and `docs-seo-surface.test.ts` pins both sides to
 * this module.
 *
 * The 1200w variant from the previous pipeline is gone: the article column
 * caps at `--sl-content-width` (761 px), so at 2× DPR the largest useful
 * variant is the 761w one — the 1200w webp cost 483 KB per desktop visit.
 * AVIF moves the mobile LCP variant from 256 KB (webp q76) to roughly a third
 * of that, which is what the throttled-median runs needed to reach 100.
 */
import roadmapPoster from '../../../../assets/img/roadmap/nifty_roadmap.webp'

export const ROADMAP_POSTER_WIDTHS = [400, 640, 761] as const
export const ROADMAP_POSTER_SIZES = '(min-width: 60rem) 761px, 90vw'
export const ROADMAP_POSTER_FORMAT = 'avif' as const
/* q55 measures 190 KB at 761w against the previous webp q76's 262 KB; lower
   steps only save tens of KB more on a text-heavy poster where they start to
   show. */
export const ROADMAP_POSTER_QUALITY = 55
/* Caps the srcset-less fallback (the raw 1800w transform is ~950 KB). */
export const ROADMAP_POSTER_FALLBACK_WIDTH = 761
export { roadmapPoster }
