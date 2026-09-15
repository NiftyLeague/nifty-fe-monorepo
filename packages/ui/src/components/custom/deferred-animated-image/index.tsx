import { splitProps } from 'solid-js'

import AnimatedImage from '@nl/ui/custom/animated-image'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'
import useDeferredActivation from '@nl/ui/hooks/useDeferredActivation'

export const DEFAULT_DEFERRED_ANIMATED_IMAGE_ROOT_MARGIN = '160px'

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean
  }
}

function prefersReducedData() {
  return (
    typeof navigator !== 'undefined' &&
    (navigator as NavigatorWithConnection).connection?.saveData === true
  )
}

export type DeferredAnimatedImageProps = Omit<
  Parameters<typeof AnimatedImage>[0],
  'animatedSrc' | 'animatedType' | 'animatedMedia' | 'fallbackAnimatedSrc' | 'fallbackAnimatedType'
> & {
  /** Load the animated source this many pixels before it enters the viewport. */
  rootMargin?: string
  /** Wait for shared idle/interaction activation after the image is near the viewport. */
  deferAnimation?: boolean
  /** Delay before idle activation when deferAnimation is enabled. */
  activationDelay?: number
  /** Static fallback wrapper classes, while image class styles the image itself. */
  containerClassName?: string
  /** New callers can defer any media format, including GIF. */
  animatedSrc?: string
  animatedType?: string
  animatedMedia?: string
  /** Compatibility source attached at the same time as the primary animation. */
  fallbackAnimatedSrc?: string
  /** MIME type for fallbackAnimatedSrc. */
  fallbackAnimatedType?: string
}

/**
 * Keeps an animated image's static fallback in the initial markup and attaches
 * the larger animated source only when the image is near the viewport. Heavy
 * animations can also wait for the shared idle/interaction activation window.
 */
export function DeferredAnimatedImage(props: DeferredAnimatedImageProps) {
  const [local, imageProps] = splitProps(props, [
    'activationDelay',
    'containerClassName',
    'deferAnimation',
    'animatedMedia',
    'animatedSrc',
    'animatedType',
    'fallbackAnimatedSrc',
    'fallbackAnimatedType',
    'rootMargin',
  ])
  let imageEl: HTMLDivElement | undefined
  const isNearViewport = useOnScreen(
    () => imageEl,
    local.rootMargin ?? DEFAULT_DEFERRED_ANIMATED_IMAGE_ROOT_MARGIN,
    { once: true }
  )
  const hasAnimatedSource = () => Boolean(local.animatedSrc || local.fallbackAnimatedSrc)
  const isAnimationActivated = useDeferredActivation({
    delay: local.activationDelay,
    enabled: () => (local.deferAnimation ?? false) && isNearViewport() && hasAnimatedSource(),
  })
  const isDataSavingRequested = prefersReducedData()
  const isAnimationReady = () =>
    !hasAnimatedSource() ||
    isDataSavingRequested ||
    (isNearViewport() && (!local.deferAnimation || isAnimationActivated()))
  const shouldAttachAnimatedSource = () => isAnimationReady() && !isDataSavingRequested

  return (
    <div
      ref={(el) => (imageEl = el)}
      class={local.containerClassName}
      aria-busy={!isAnimationReady()}
      data-deferred-animated-image
    >
      <AnimatedImage
        {...imageProps}
        animatedMedia={local.animatedMedia}
        animatedSrc={shouldAttachAnimatedSource() ? local.animatedSrc : undefined}
        animatedType={local.animatedType}
        fallbackAnimatedSrc={shouldAttachAnimatedSource() ? local.fallbackAnimatedSrc : undefined}
        fallbackAnimatedType={local.fallbackAnimatedType}
      />
    </div>
  )
}

export default DeferredAnimatedImage
