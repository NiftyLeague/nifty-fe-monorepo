import { preload } from 'react-dom'
import type { ComponentProps } from 'react'

/**
 * App-local replacement for `@nl/ui/custom/optimized-image`, which is built on
 * next/image internals.
 *
 * The shared props contract is preserved, including the optimisation the Next
 * build performed: `/_next/image?url=...&w=...` is replaced by Vercel's own
 * image optimiser, `/_vercel/image?url=...&w=...`, with the same responsive
 * `srcSet` ladder. Serving the untouched originals instead cost ~40 KB on the
 * hero wordmark and showed up as a 600 ms LCP regression.
 *
 * The optimiser only exists on Vercel, so the URL is gated on `VERCEL` and
 * everything else (dev, local builds, tests) gets the plain asset path.
 *
 * The Vite alias in astro.config.mjs redirects the shared specifier here; the
 * consuming components keep importing `@nl/ui/custom/optimized-image`.
 */
const OPTIMIZED_WIDTHS = [640, 750, 828, 1080, 1200, 1920, 2048, 3840]

/**
 * Read at call time rather than once at import, so the behaviour is
 * controllable from tests and from a build that sets the flag late. Vite still
 * statically replaces `import.meta.env.VERCEL` in the bundle.
 */
const canOptimize = (): boolean => Boolean(import.meta.env.VERCEL)

/** Vercel image-optimizer URL; passes the source through off Vercel. */
const optimizedUrl = (src: string, width: number, quality: number): string =>
  `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`

/**
 * Pick the optimizer width ladder for an element.
 *
 * The ladder is capped by the element's layout box, taken from the largest
 * `px` branch of `sizes` (or a desktop viewport when only `vw` is given). Two
 * failure modes motivated this: resolving `sizes` before the intrinsic width
 * requested 1080w for an 824px asset, and trusting the declared native width let
 * a 4842px full-bleed backdrop request 3840w on a phone.
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
    OPTIMIZED_WIDTHS[0] as number
  )
  const ladder = OPTIMIZED_WIDTHS.filter((width) => width <= cap)
  return ladder.length ? ladder : [OPTIMIZED_WIDTHS[0] as number]
}

export interface OptimizedImageProps extends Omit<ComponentProps<'img'>, 'src'> {
  src: string | { src: string; width?: number; height?: number }
  priority?: boolean
  preload?: boolean
  fill?: boolean
  unoptimized?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export function getOptimizedImageProps({
  src: suppliedSource,
  priority,
  preload,
  fill,
  unoptimized,
  quality = 75,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  ...attributes
}: OptimizedImageProps): ComponentProps<'img'> & { src: string } {
  const source = typeof suppliedSource === 'string' ? suppliedSource : suppliedSource?.src
  if (typeof source !== 'string' || !source) throw new TypeError('Image src is required')

  const props: ComponentProps<'img'> & { src: string; srcSet?: string } = {
    ...attributes,
    src: source,
    decoding: attributes.decoding ?? 'async',
    loading: attributes.loading ?? (priority || preload ? 'eager' : 'lazy'),
  }
  if (!props.width && typeof suppliedSource === 'object' && suppliedSource?.width)
    props.width = suppliedSource.width
  if (!props.height && typeof suppliedSource === 'object' && suppliedSource?.height)
    props.height = suppliedSource.height
  if (!props.fetchPriority)
    props.fetchPriority =
      priority || preload ? 'high' : props.loading === 'lazy' ? 'low' : undefined
  if (fill) {
    delete props.width
    delete props.height
    props.style = {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      ...attributes.style,
    }
  }

  // Only local artwork is optimised; remote URLs and SVGs pass through.
  const optimizable = canOptimize() && !unoptimized && source.startsWith('/img/')
  if (optimizable) {
    const nativeWidth =
      typeof suppliedSource === 'object' ? suppliedSource?.width : Number(props.width) || undefined
    const widths = selectWidths(nativeWidth, attributes.sizes)
    props.src = optimizedUrl(source, widths.at(-1) as number, quality)
    props.srcSet = widths
      .map((width) => `${optimizedUrl(source, width, quality)} ${width}w`)
      .join(', ')
  }

  for (const key of Object.keys(props) as (keyof typeof props)[])
    if (props[key] === undefined) delete props[key]
  return props
}

/**
 * Build the `imagesrcset`/`imagesizes` pair for a preload hint.
 *
 * The browser resolves a preload against `imagesrcset` exactly as it resolves
 * the `<img>` against `srcset`. Without it the hint names one width while the
 * element picks another, and the artwork is downloaded twice — which is what
 * made the hero wordmark the LCP element at 1.7s.
 */
export function getImagePreloadProps(
  props: Pick<OptimizedImageProps, 'src' | 'sizes' | 'width' | 'quality'>
): {
  href: string
  imageSrcSet?: string
  imageSizes?: string
} {
  const { src, sizes, width, quality = 75 } = props
  if (typeof src !== 'string') return { href: src.src }

  const optimizable = canOptimize() && src.startsWith('/img/')
  if (!optimizable) return { href: src }

  // `width` comes from the intrinsic <img> attribute and may be a CSS length.
  const intrinsicWidth = Number(width)
  const widths = selectWidths(Number.isFinite(intrinsicWidth) ? intrinsicWidth : undefined, sizes)
  const url = (w: number) => optimizedUrl(src, w, quality)
  return {
    href: url(widths.at(-1) as number),
    imageSrcSet: widths.map((w) => `${url(w)} ${w}w`).join(', '),
    imageSizes: sizes,
  }
}

export default function OptimizedImage(props: OptimizedImageProps) {
  const result = getOptimizedImageProps(props)
  // next/image turned `priority` into a preload hint; Astro's SSR does not emit
  // react-dom's preload, so pages declare their LCP artwork through the layout.
  if (props.priority || props.preload) {
    preload(result.src, {
      as: 'image',
      fetchPriority: 'high',
      imageSrcSet: result.srcSet,
      imageSizes: props.sizes,
    })
  }
  return <img {...result} />
}
export { OptimizedImage }
