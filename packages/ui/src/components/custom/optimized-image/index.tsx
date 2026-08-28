import { getImgProps, type ImageProps } from 'next/dist/shared/lib/get-img-props'
import type { ImageConfigComplete } from 'next/dist/shared/lib/image-config'
import defaultLoader from 'next/dist/shared/lib/image-loader'

export type OptimizedImageProps = ImageProps

// Next injects this build-time value so the shared helper keeps each app's
// configured responsive image ladder and loader behavior.
// eslint-disable-next-line turbo/no-undeclared-env-vars
const imageConfig = process.env.__NEXT_IMAGE_OPTS as unknown as ImageConfigComplete

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
