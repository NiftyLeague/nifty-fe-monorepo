'use client'

import type { ComponentPropsWithoutRef } from 'react'
import { useRef } from 'react'

import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import LazyYouTubeEmbed from '@nl/ui/custom/lazy-youtube-embed'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

type DeferredYouTubeEmbedProps = Omit<
  ComponentPropsWithoutRef<'iframe'>,
  'allow' | 'allowFullScreen' | 'loading' | 'src' | 'title'
> & {
  rootMargin?: string
  src: string
  title: string
}

export const DEFAULT_DEFERRED_YOUTUBE_ROOT_MARGIN = '160px'

/**
 * Keeps below-the-fold YouTube embeds out of the initial third-party request
 * path while preserving the iframe's reserved dimensions and an accessible
 * fallback link until the embed is close to view.
 */
export function DeferredYouTubeEmbed({
  className,
  rootMargin = DEFAULT_DEFERRED_YOUTUBE_ROOT_MARGIN,
  src,
  title,
  ...props
}: DeferredYouTubeEmbedProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const isNearViewport = useOnScreen(rootRef, rootMargin, { once: true })

  return (
    <div ref={rootRef} className={className} aria-busy={!isNearViewport}>
      {isNearViewport ? (
        <LazyYouTubeEmbed {...props} className="size-full" src={src} title={title} />
      ) : (
        <DeferredSkeleton
          className="flex h-full w-full items-center justify-center"
          role="status"
          aria-label={`Loading ${title}`}
        >
          <a href={src} target="_blank" rel="noreferrer" className="underline">
            Watch {title} on YouTube
          </a>
        </DeferredSkeleton>
      )}
    </div>
  )
}

export default DeferredYouTubeEmbed
