import { preload as preloadImage } from 'react-dom'
import type { ComponentProps } from 'react'
import {
  imageAttributes,
  stripUndefinedAttributes,
  type ImageSource,
} from '@nl/ui/lib/image-attributes'

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

/**
 * The framework-agnostic image primitive.
 *
 * Every app that renders this component either uses it directly (the app) or
 * aliases the specifier to its own optimiser (web generates build-time variants,
 * smashers calls the Vercel image service). The attribute contract lives in
 * `@nl/ui/lib/image-attributes`; this file keeps the loader-hint contract the
 * tests pin down and renders a native `<img>` at the supplied source.
 */
export function getOptimizedImageProps(
  props: OptimizedImageProps
): ComponentProps<'img'> & { src: string } {
  const {
    src,
    priority,
    preload,
    quality: _quality,
    placeholder: _placeholder,
    blurDataURL: _blurDataURL,
    fill,
    unoptimized: _unoptimized,
    ...attributes
  } = props

  // Callers feed `result.src` straight into the preload hints, so the resolved
  // source has to stay part of the contract.
  return stripUndefinedAttributes(
    imageAttributes({ ...attributes, src, priority, preload, fill })
  ) as ComponentProps<'img'> & { src: string }
}

/**
 * Renders a native `<img>`. Above-the-fold artwork (`priority` / `preload`)
 * also emits a matching `<link rel="preload">` so the browser starts the
 * request before React resolves the element.
 */
export function OptimizedImage(props: OptimizedImageProps) {
  const imageProps = getOptimizedImageProps(props)

  if ((props.priority || props.preload) && typeof imageProps.src === 'string') {
    preloadImage(imageProps.src, {
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
