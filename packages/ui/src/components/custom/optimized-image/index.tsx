import { preload } from 'react-dom'
import type { ComponentProps, CSSProperties } from 'react'

type ImageSource = string | { src: string; width?: number; height?: number }

/**
 * Framework-agnostic image primitive.
 *
 * Every app that renders this component aliases the specifier to its own
 * implementation (web and smashers generate responsive variants at build time;
 * the app serves originals natively). This shared copy is the fallback: it
 * keeps the loader-hint contract the tests pin down and renders a native
 * `<img>` at the supplied source.
 */
export interface OptimizedImageProps extends Omit<ComponentProps<'img'>, 'src'> {
  src: ImageSource
  priority?: boolean
  preload?: boolean
  fill?: boolean
  unoptimized?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

const FIXED_PIXEL_SIZE_PATTERN = /^\s*(\d+(?:\.\d+)?)px\s*$/

/**
 * A `sizes` value in whole pixels only needs one candidate for a 1x display and
 * one for a 2x display. Fluid sizes (`vw`, `%`, media queries) keep the full
 * candidate ladder.
 */
export function trimFixedWidthSrcSet(srcSet: string | undefined, sizes: string | undefined) {
  if (!srcSet || !sizes) return srcSet

  const match = FIXED_PIXEL_SIZE_PATTERN.exec(sizes)
  if (!match) return srcSet

  const targetWidth = Number(match[1])
  const candidates = srcSet
    .split(',')
    .map((candidate) => {
      const trimmed = candidate.trim()
      const widthMatch = /(?:^|\s)(\d+)w$/.exec(trimmed)

      return widthMatch ? { source: trimmed, width: Number(widthMatch[1]) } : undefined
    })
    .filter((candidate): candidate is { source: string; width: number } => candidate !== undefined)

  if (candidates.length < 3 || !Number.isFinite(targetWidth) || targetWidth <= 0) {
    return srcSet
  }

  const selectAtLeast = (minimumWidth: number) =>
    candidates.find(({ width }) => width >= minimumWidth) ?? candidates.at(-1)

  const selected = [selectAtLeast(targetWidth), selectAtLeast(targetWidth * 2)].filter(
    (candidate): candidate is { source: string; width: number } => candidate !== undefined
  )
  const unique = selected.filter(
    (candidate, index) => selected.findIndex(({ width }) => width === candidate.width) === index
  )

  return unique.length > 0 ? unique.map(({ source }) => source).join(', ') : srcSet
}

const FILL_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
}

export function getOptimizedImageProps(props: OptimizedImageProps): ComponentProps<'img'> {
  const {
    src: suppliedSource,
    priority,
    preload,
    quality: _quality,
    placeholder: _placeholder,
    blurDataURL: _blurDataURL,
    fill,
    unoptimized: _unoptimized,
    ...attributes
  } = props

  const source = typeof suppliedSource === 'string' ? suppliedSource : suppliedSource?.src
  if (typeof source !== 'string' || !source) throw new TypeError('Image src is required')

  const imageProps: ComponentProps<'img'> = {
    ...attributes,
    src: source,
    decoding: attributes.decoding ?? 'async',
    loading: attributes.loading ?? (priority || preload ? 'eager' : 'lazy'),
  }

  if (imageProps.width === undefined && typeof suppliedSource !== 'string') {
    imageProps.width = suppliedSource?.width
  }
  if (imageProps.height === undefined && typeof suppliedSource !== 'string') {
    imageProps.height = suppliedSource?.height
  }

  // Keep below-the-fold artwork from competing with the route's LCP resource
  // while explicit priority and eager loading still win.
  if (imageProps.fetchPriority === undefined) {
    if (priority || preload) imageProps.fetchPriority = 'high'
    else if (imageProps.loading === 'lazy') imageProps.fetchPriority = 'low'
  }

  if (fill) {
    delete imageProps.width
    delete imageProps.height
    imageProps.style = { ...FILL_STYLE, ...attributes.style }
  }

  for (const key of Object.keys(imageProps)) {
    if (imageProps[key as keyof ComponentProps<'img'>] === undefined) {
      delete imageProps[key as keyof ComponentProps<'img'>]
    }
  }

  return imageProps
}

/**
 * Renders a native `<img>`. Above-the-fold artwork (`priority` / `preload`)
 * also emits a matching `<link rel="preload">` so the browser starts the
 * request before React resolves the element.
 */
export function OptimizedImage(props: OptimizedImageProps) {
  const imageProps = getOptimizedImageProps(props)

  if ((props.priority || props.preload) && typeof imageProps.src === 'string') {
    preload(imageProps.src, {
      as: 'image',
      fetchPriority: 'high',
      ...(imageProps.srcSet
        ? { imageSrcSet: imageProps.srcSet, imageSizes: imageProps.sizes }
        : {}),
    })
  }

  return <img {...imageProps} />
}

export default OptimizedImage
