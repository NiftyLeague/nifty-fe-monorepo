/**
 * Single source of truth for the roadmap poster's image pipeline.
 *
 * The page and head preload use the same generated image options.
 */
import roadmapPoster from '../../../../assets/media/img/roadmap/nifty_roadmap.webp'

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
