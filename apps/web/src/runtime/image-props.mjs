export const DEVICE_WIDTHS = [384, 480, 640, 750, 828, 1080, 1200, 1440, 1920, 2560, 3840]
export const SMALL_WIDTHS = [32, 48, 64, 96, 128, 256]
export const IMAGE_QUALITIES = [60, 65, 75]

export function candidateWidths(nativeWidth) {
  const widths = [...SMALL_WIDTHS, ...DEVICE_WIDTHS].filter((width) => width < nativeWidth)
  return [...new Set([...widths, nativeWidth])].sort((a, b) => a - b)
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
    loader: _loader,
    overrideSrc,
    onLoadingComplete: _onLoadingComplete,
    ...attributes
  } = input
  const source = typeof suppliedSource === 'string' ? suppliedSource : suppliedSource?.src
  if (typeof source !== 'string' || !source) throw new TypeError('Image src is required')
  if (/^(?:javascript|vbscript):/i.test(source) || source.startsWith('//'))
    throw new TypeError('Unsafe image source')
  const props = {
    ...attributes,
    src: overrideSrc ?? source,
    decoding: attributes.decoding ?? 'async',
    loading: attributes.loading ?? (priority || preload ? 'eager' : 'lazy'),
  }
  if (!props.width && suppliedSource?.width) props.width = suppliedSource.width
  if (!props.height && suppliedSource?.height) props.height = suppliedSource.height
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
  const entry = !unoptimized && manifest[source]
  if (entry) {
    const q = IMAGE_QUALITIES.reduce((best, current) =>
      Math.abs(current - Number(quality)) < Math.abs(best - Number(quality)) ? current : best
    )
    const widths = selectWidths(candidateWidths(entry.width), attributes.sizes, props.width)
    const url = (w) => `/__images/${entry.hash}-${w}-q${q}.webp`
    props.src = overrideSrc ?? url(widths.at(-1))
    props.srcSet = widths.map((w) => `${url(w)} ${w}w`).join(', ')
  } else if (!props.srcSet) {
    // ResponsiveOnlyImage consumes srcSet even for SVGs, GIFs and dynamic assets.
    props.srcSet = `${props.src} 1x`
  }
  for (const key of Object.keys(props)) if (props[key] === undefined) delete props[key]
  return props
}
