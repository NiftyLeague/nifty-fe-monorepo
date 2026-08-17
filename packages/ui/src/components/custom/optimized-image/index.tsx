import { getImgProps, type ImageProps } from 'next/dist/shared/lib/get-img-props'
import type { ImageConfigComplete } from 'next/dist/shared/lib/image-config'
import defaultLoader from 'next/dist/shared/lib/image-loader'

export type OptimizedImageProps = ImageProps

// Next injects this build-time value so the shared helper keeps each app's
// configured responsive image ladder and loader behavior.
// eslint-disable-next-line turbo/no-undeclared-env-vars
const imageConfig = process.env.__NEXT_IMAGE_OPTS as unknown as ImageConfigComplete

export function getOptimizedImageProps(props: OptimizedImageProps) {
  const imageProps = getImgProps(props, {
    defaultLoader,
    imgConf: imageConfig,
  }).props

  // Keep below-the-fold artwork from competing with the route's LCP resource.
  // Respect explicit priorities for hero and above-the-fold images.
  if (imageProps.loading === 'lazy' && imageProps.fetchPriority === undefined) {
    imageProps.fetchPriority = 'low'
  }

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
  return <img {...getOptimizedImageProps(props)} />
}

export default OptimizedImage
