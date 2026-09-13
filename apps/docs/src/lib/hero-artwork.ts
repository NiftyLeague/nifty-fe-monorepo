/**
 * Single source of truth for the landing-page hero artwork's image pipeline.
 *
 * Hero.astro renders the light/dark pair and index.astro preloads the dark
 * variant's exact srcset in the page head (dark is the site's default theme, so
 * that variant is the LCP element); both sides share these options so the
 * hashed variant URLs resolve to the same files.
 *
 * The originals are served full-bleed under a 20%-opacity mask, so quality can
 * sit below the content-image floor; AVIF at 62 keeps the largest variant
 * (1920w, previously the 460 KB webp) around a third of that.
 */
import heroLight from '../../../../assets/img/games/smashers/2D-levels/mars.webp'
import heroDark from '../../../../assets/img/games/smashers/3D-levels/sushi_cropped.webp'

export const HERO_WIDTHS = [640, 960, 1350, 1920] as const
export const HERO_SIZES = '100vw'
export const HERO_FORMAT = 'avif' as const
export const HERO_QUALITY = 62
/* Caps the srcset-less fallback: the light original is an 8000×6000 webp whose
   full-size transform is ~420 KB. */
export const HERO_FALLBACK_WIDTH = 1350
/* The <Image> component clamps candidate widths to the source's intrinsic
   width (the 1920w entry lands at the dark artwork's native 1915px); the
   preload must reproduce that clamp or its top URL would never be selected. */
export const HERO_PRELOAD_WIDTHS = HERO_WIDTHS.map((width) => Math.min(width, heroDark.width))
export { heroLight, heroDark }
