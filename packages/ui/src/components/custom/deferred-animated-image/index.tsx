'use client'

import { memo, useRef, type ComponentProps } from 'react'

import AnimatedImage from '@nl/ui/custom/animated-image'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

export const DEFAULT_DEFERRED_ANIMATED_IMAGE_ROOT_MARGIN = '160px'

export type DeferredAnimatedImageProps = Omit<
  ComponentProps<typeof AnimatedImage>,
  'animatedSrc' | 'webpSrc'
> & {
  /** Load the animated source this many pixels before it enters the viewport. */
  rootMargin?: string
  /** Static fallback wrapper classes, while image className styles the image itself. */
  containerClassName?: string
  /** New callers can defer any media format, including GIF. */
  animatedSrc?: string
  animatedType?: string
  animatedMedia?: string
  /** @deprecated Use animatedSrc for new callers. */
  webpSrc?: string
  /** @deprecated Use animatedMedia for new callers. */
  webpMedia?: string
}

/**
 * Keeps an animated image's static fallback in the initial markup and attaches
 * the larger animated source only when the image is near the viewport.
 */
export const DeferredAnimatedImage = memo(function DeferredAnimatedImage({
  containerClassName,
  animatedMedia,
  animatedSrc,
  animatedType,
  rootMargin = DEFAULT_DEFERRED_ANIMATED_IMAGE_ROOT_MARGIN,
  webpMedia,
  webpSrc,
  ...imageProps
}: DeferredAnimatedImageProps) {
  const imageRef = useRef<HTMLDivElement>(null)
  const isNearViewport = useOnScreen(imageRef, rootMargin, { once: true })
  const deferredSrc = animatedSrc ?? webpSrc
  const deferredMedia = animatedMedia ?? webpMedia
  const deferredType =
    animatedType ?? (animatedSrc ? undefined : webpSrc ? 'image/webp' : undefined)

  return (
    <div
      ref={imageRef}
      className={containerClassName}
      aria-busy={!isNearViewport}
      data-deferred-animated-image
    >
      <AnimatedImage
        {...imageProps}
        animatedMedia={deferredMedia}
        animatedSrc={isNearViewport ? deferredSrc : undefined}
        animatedType={deferredType}
      />
    </div>
  )
})

export default DeferredAnimatedImage
