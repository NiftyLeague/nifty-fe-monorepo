'use client'

import { memo, useRef, type ComponentProps } from 'react'

import AnimatedImage from '@nl/ui/custom/animated-image'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

export const DEFAULT_DEFERRED_ANIMATED_IMAGE_ROOT_MARGIN = '160px'

export type DeferredAnimatedImageProps = Omit<ComponentProps<typeof AnimatedImage>, 'webpSrc'> & {
  /** Load the animated source this many pixels before it enters the viewport. */
  rootMargin?: string
  /** Static fallback wrapper classes, while image className styles the image itself. */
  containerClassName?: string
  webpSrc: string
}

/**
 * Keeps an animated image's static fallback in the initial markup and attaches
 * the larger animated source only when the image is near the viewport.
 */
export const DeferredAnimatedImage = memo(function DeferredAnimatedImage({
  containerClassName,
  rootMargin = DEFAULT_DEFERRED_ANIMATED_IMAGE_ROOT_MARGIN,
  webpSrc,
  ...imageProps
}: DeferredAnimatedImageProps) {
  const imageRef = useRef<HTMLDivElement>(null)
  const isNearViewport = useOnScreen(imageRef, rootMargin, { once: true })

  return (
    <div
      ref={imageRef}
      className={containerClassName}
      aria-busy={!isNearViewport}
      data-deferred-animated-image
    >
      <AnimatedImage {...imageProps} webpSrc={isNearViewport ? webpSrc : undefined} />
    </div>
  )
})

export default DeferredAnimatedImage
