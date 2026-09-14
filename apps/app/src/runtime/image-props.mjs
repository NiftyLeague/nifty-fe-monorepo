import { imageAttributes, imageSource, stripUndefinedAttributes } from '@nl/ui/lib/image-attributes'

export const DEVICE_WIDTHS = [384, 480, 640, 750, 828, 1080, 1200, 1440, 1920, 2560, 3840]
export const SMALL_WIDTHS = [32, 48, 64, 96, 128, 256]
export const IMAGE_QUALITIES = [60, 65, 75]

export function candidateWidths(nativeWidth) {
  const widths = [...SMALL_WIDTHS, ...DEVICE_WIDTHS].filter((width) => width < nativeWidth)
  return [...new Set([...widths, nativeWidth])].toSorted((a, b) => a - b)
}

function pickAtLeast(widths, minimum) {
  return widths.find((width) => width >= minimum) ?? widths.at(-1)
}

export function selectWidths(widths, sizes, width) {
  const fixed = typeof sizes === 'string' && /^\s*(\d+(?:\.\d+)?)px\s*$/.exec(sizes)
  if (fixed || !sizes) {
    const target = fixed ? Number(fixed[1]) : Number(width)
    if (Number.isFinite(target) && target > 0)
      return [...new Set([pickAtLeast(widths, target), pickAtLeast(widths, target * 2)])]
  }
  // Preserve a responsive width ladder for fluid and media-query sizes.
  return widths.filter((value) => value >= DEVICE_WIDTHS[0] || value === widths.at(-1))
}

/**
 * The app's image props: the shared attribute contract plus this app's
 * build-time manifest. The manifest holds one pre-generated WebP variant per
 * width (see `apps/app/scripts/prepare-images.mjs`), so the optimizer here is
 * a lookup rather than a service — the same arrangement web uses.
 *
 * Unlike web there is no `overrideSrc` escape hatch and no `1x` fallback for
 * manifest-less sources: API-driven images (degen/item artwork) keep their
 * original URL as a plain `src`.
 */
export function imageProps(input, manifest = {}) {
  const {
    src: suppliedSource,
    priority,
    preload,
    unoptimized,
    quality = 75,
    fill,
    placeholder: _placeholder,
    blurDataURL: _blurDataURL,
    ...attributes
  } = input

  const source = imageSource(suppliedSource)
  if (/^(?:javascript|vbscript):/i.test(source) || source.startsWith('//'))
    throw new TypeError('Unsafe image source')

  const props = imageAttributes({
    ...attributes,
    src: suppliedSource,
    priority,
    preload,
    fill,
  })

  const entry = !unoptimized && manifest[source]
  if (entry) {
    const q = IMAGE_QUALITIES.reduce((best, current) =>
      Math.abs(current - Number(quality)) < Math.abs(best - Number(quality)) ? current : best
    )
    const widths = selectWidths(candidateWidths(entry.width), props.sizes, props.width)
    const url = (w) => `/__images/${entry.hash}-${w}-q${q}.webp`
    props.src = url(widths.at(-1))
    props.srcSet = widths.map((w) => `${url(w)} ${w}w`).join(', ')
  }

  return stripUndefinedAttributes(props)
}
