/**
 * Single source of truth for the landing-page hero artwork's image pipeline.
 *
 * The page and head preload use the same generated image options.
 */
import heroLight from '../assets/games/smashers/2D-levels/mars.webp'
import heroDark from '../assets/games/smashers/3D-levels/sushi_cropped.webp'

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
