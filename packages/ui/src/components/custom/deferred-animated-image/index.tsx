'use client'

import { memo, useRef, type ComponentProps } from 'react'

import AnimatedImage from '@nl/ui/custom/animated-image'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'
import useDeferredActivation from '@nl/ui/hooks/useDeferredActivation'

export const DEFAULT_DEFERRED_ANIMATED_IMAGE_ROOT_MARGIN = '160px'

export type DeferredAnimatedImageProps = Omit<
  ComponentProps<typeof AnimatedImage>,
  'animatedSrc' | 'webpSrc'
> & {
  /** Load the animated source this many pixels before it enters the viewport. */
  rootMargin?: string
  /** Wait for shared idle/interaction activation after the image is near the viewport. */
  deferAnimation?: boolean
  /** Delay before idle activation when deferAnimation is enabled. */
  activationDelay?: number
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
 * the larger animated source only when the image is near the viewport. Heavy
 * animations can also wait for the shared idle/interaction activation window.
 */
export const DeferredAnimatedImage = memo(function DeferredAnimatedImage({
  activationDelay,
  containerClassName,
  deferAnimation = false,
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
  const isAnimationActivated = useDeferredActivation({
    delay: activationDelay,
    enabled: deferAnimation && isNearViewport && Boolean(deferredSrc),
  })
  const shouldAttachAnimatedSource =
    isNearViewport && (!deferredSrc || !deferAnimation || isAnimationActivated)

  return (
    <div
      ref={imageRef}
      className={containerClassName}
      aria-busy={!shouldAttachAnimatedSource}
      data-deferred-animated-image
    >
      <AnimatedImage
        {...imageProps}
        animatedMedia={deferredMedia}
        animatedSrc={shouldAttachAnimatedSource ? deferredSrc : undefined}
        animatedType={deferredType}
      />
    </div>
  )
})

export default DeferredAnimatedImage
