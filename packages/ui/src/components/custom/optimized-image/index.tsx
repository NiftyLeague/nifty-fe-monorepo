import { preload } from 'react-dom'
import { getImgProps, type ImageProps } from 'next/dist/shared/lib/get-img-props'
import type { ImageConfigComplete } from 'next/dist/shared/lib/image-config'
import defaultLoader from 'next/dist/shared/lib/image-loader'

export type OptimizedImageProps = ImageProps

// Next injects this build-time value so the shared helper keeps each app's
// configured responsive image ladder and loader behavior.
// eslint-disable-next-line turbo/no-undeclared-env-vars
const imageConfig = process.env.__NEXT_IMAGE_OPTS as unknown as ImageConfigComplete

const FIXED_PIXEL_SIZE_PATTERN = /^\s*(\d+(?:\.\d+)?)px\s*$/

/**
 * Next's `sizes` prop switches to the complete device ladder whenever it is
 * present. That is correct for fluid layouts, but it is unnecessarily large
 * for artwork whose rendered width is a fixed number of pixels. Keep one
 * candidate for a 1x display and one for a 2x display in that narrow case.
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

export function getOptimizedImageProps(props: OptimizedImageProps) {
  const { props: imageProps, meta } = getImgProps(props, {
    defaultLoader,
    imgConf: imageConfig,
  })

  // Keep the shared native renderer conservative by default. Callers can
  // still opt into eager loading explicitly, while Next's priority/preload
  // metadata continues to win for above-the-fold assets.
  if (imageProps.loading === undefined) {
    imageProps.loading = props.priority || meta.preload ? 'eager' : 'lazy'
  }

  // The native <img> renderer cannot consume Next's preload metadata. Carry
  // its priority signal across as standard browser hints instead of silently
  // dropping it when the shared primitive avoids the stateful next/image
  // client component.
  if (meta.preload) {
    imageProps.loading ??= 'eager'
    imageProps.fetchPriority ??= 'high'
  }

  // Keep below-the-fold artwork from competing with the route's LCP resource.
  // Respect explicit priorities for hero and above-the-fold images.
  if (imageProps.loading === 'lazy' && imageProps.fetchPriority === undefined) {
    imageProps.fetchPriority = 'low'
  }

  // Decode artwork off the critical rendering path by default, matching the
  // shared NativeImage primitive used by client-only consumers.
  imageProps.decoding ??= 'async'

  imageProps.srcSet = trimFixedWidthSrcSet(imageProps.srcSet, props.sizes)

  for (const [key, value] of Object.entries(imageProps)) {
    if (value === undefined) delete imageProps[key as keyof typeof imageProps]
  }

  return imageProps
}

/**
 * Keeps Next's responsive image generation on the server without shipping the
 * stateful next/image client component for static artwork. The public
 * `next/image` entry re-exports that client component, so this stays on the
 * shared server-side implementation used by the pinned Next version.
 */
export function OptimizedImage(props: OptimizedImageProps) {
  const imageProps = getOptimizedImageProps(props)

  // The native renderer replaces Next's client image component, so carry its
  // explicit priority signal through as a matching resource hint. Keeping the
  // preload URL and responsive candidates derived from the same props avoids a
  // second request for a different image variant.
  if (props.priority || props.preload) {
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
