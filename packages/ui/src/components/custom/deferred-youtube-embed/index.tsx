'use client'

import { memo, useRef } from 'react'

import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import { LazyYouTubeEmbed, type LazyYouTubeEmbedProps } from '@nl/ui/custom/lazy-youtube-embed'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

export const DEFAULT_DEFERRED_YOUTUBE_ROOT_MARGIN = '160px'

export type DeferredYouTubeEmbedProps = LazyYouTubeEmbedProps & {
  /** Load the third-party iframe this many pixels before it enters the viewport. */
  rootMargin?: string
}

/**
 * Keeps YouTube out of the initial page load until a visitor is close to the
 * video, while preserving the shared iframe's accessible and themed markup.
 */
export const DeferredYouTubeEmbed = memo(function DeferredYouTubeEmbed({
  rootMargin = DEFAULT_DEFERRED_YOUTUBE_ROOT_MARGIN,
  title,
  ...props
}: DeferredYouTubeEmbedProps) {
  const embedRef = useRef<HTMLDivElement>(null)
  const isNearViewport = useOnScreen(embedRef, rootMargin, { once: true })

  return (
    <div ref={embedRef} aria-busy={!isNearViewport}>
      {isNearViewport ? (
        <LazyYouTubeEmbed title={title} {...props} />
      ) : (
        <DeferredSkeleton
          role="status"
          aria-live="polite"
          aria-label={`Loading ${title}`}
          className={props.className}
        />
      )}
    </div>
  )
})

export default DeferredYouTubeEmbed
