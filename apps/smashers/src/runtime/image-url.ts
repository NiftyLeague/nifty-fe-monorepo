/**
 * The optimizer policy shared by every smashers image surface: the React
 * adapter (`runtime/Image.tsx`), the astro:assets image service
 * (`runtime/vercel-image-service.ts`), and the preload hints in `Base.astro`.
 *
 * Keeping the gate and the URL construction in one module is what guarantees
 * a preload hint and its `<img>` resolve to the same candidate — when they
 * diverged, the hero wordmark was downloaded twice.
 *
 * The module is imported by client bundles, so it must stay free of
 * server-only imports (`astro:assets`, the Vercel adapter).
 */

/** Vercel's image optimizer accepts exactly these widths. */
const VERCEL_IMAGE_WIDTHS = [640, 750, 828, 1080, 1200, 1920, 2048, 3840]

/**
 * Read at call time rather than once at import, so the behaviour is
 * controllable from tests and from a build that sets the flag late. Vite still
 * statically replaces `import.meta.env.VERCEL` in the bundle.
 */
export const canOptimize = (): boolean => Boolean(import.meta.env.VERCEL)

/**
 * Only local artwork under `/img/` is optimised; remote URLs, bundled assets,
 * and SVGs pass through untouched — the same rule the previous shim applied.
 */
export const isOptimizableSource = (src: string): boolean => src.startsWith('/img/')

/** Vercel image-optimizer URL; identical to the adapter service's own shape. */
export const optimizedUrl = (src: string, width: number, quality: number): string =>
  `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`

/**
 * Pick the optimizer width ladder for an element.
 *
 * The ladder is capped by the element's layout box, taken from the largest
 * `px` branch of `sizes` (or a desktop viewport when only `vw` is given).
 *
 * All rungs up to the cap are emitted, not just the smallest fit, so the browser
 * still chooses per viewport and device pixel ratio. The preload hint and the
 * `<img>` share this function, so they resolve to the same candidate and the
 * artwork is never fetched twice.
 */
export const selectWidths = (
  nativeWidth: number | undefined,
  sizes: string | undefined
): number[] => {
  const pixels = typeof sizes === 'string' ? [...sizes.matchAll(/(\d+(?:\.\d+)?)px/g)] : []
  const viewport = typeof sizes === 'string' ? /(\d+(?:\.\d+)?)vw/.exec(sizes) : null
  const fixed = typeof sizes === 'string' ? /^\s*(\d+(?:\.\d+)?)px\s*$/.exec(sizes) : null

  // A pinned size ("824px") is the box; otherwise the desktop branch of a media
  // query list, else the reference desktop viewport for a fluid image.
  const layoutBox = fixed
    ? Number(fixed[1])
    : pixels.length
      ? Math.max(...pixels.map((match) => Number(match[1])))
      : viewport
        ? Number(viewport[1]) * 19.2
        : nativeWidth

  // Never serve wider than the file the author shipped.
  const cap = Math.max(
    Math.min(layoutBox ?? Number.POSITIVE_INFINITY, nativeWidth ?? Number.POSITIVE_INFINITY),
    VERCEL_IMAGE_WIDTHS[0] as number
  )
  const ladder = VERCEL_IMAGE_WIDTHS.filter((width) => width <= cap)
  return ladder.length ? ladder : [VERCEL_IMAGE_WIDTHS[0] as number]
}
