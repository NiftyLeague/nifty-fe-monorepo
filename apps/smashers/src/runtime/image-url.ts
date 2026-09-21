/**
 * The width-selection policy shared by every smashers image surface: the React
 * adapter (`runtime/Image.tsx`) and the preload hints in `Base.astro`. Both
 * resolve through this module so a preload hint and its `<img>` always agree
 * on the candidate artwork — when they diverged, the hero wordmark was
 * downloaded twice.
 *
 * The module is imported by client bundles, so it must stay free of
 * server-only imports (`astro:assets`, the adapter).
 */

/** The optimizer ladder the imagery was historically sized against. */
const OPTIMIZER_WIDTHS = [640, 750, 828, 1080, 1200, 1920, 2048, 3840]

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
    OPTIMIZER_WIDTHS[0] as number
  )
  const ladder = OPTIMIZER_WIDTHS.filter((width) => width <= cap)
  return ladder.length ? ladder : [OPTIMIZER_WIDTHS[0] as number]
}
