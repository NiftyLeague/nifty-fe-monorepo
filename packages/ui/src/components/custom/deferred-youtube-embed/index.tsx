'use client'

import { useRef, useState } from 'react'

import { buttonVariants } from '@nl/ui/base/button-variants'
import NativeImage from '@nl/ui/custom/native-image'
import LazyYouTubeEmbed, { type LazyYouTubeEmbedProps } from '@nl/ui/custom/lazy-youtube-embed'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'
import { cx } from '@nl/ui/class-names'

export const DEFAULT_DEFERRED_YOUTUBE_ROOT_MARGIN = '200px 0px'

export type DeferredYouTubeEmbedProps = LazyYouTubeEmbedProps & {
  /** Optional local or CDN poster. YouTube's lightweight thumbnail is used by default. */
  poster?: string
  rootMargin?: string
}

function getYouTubeThumbnail(src: string): string | undefined {
  try {
    const url = new URL(src)
    const videoId = url.pathname.match(/\/embed\/([^/]+)/)?.[1]
    return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : undefined
  } catch {
    return undefined
  }
}

/**
 * Keeps YouTube's third-party iframe out of the initial document until the
 * player is close to the viewport or the visitor explicitly activates it.
 * The lightweight thumbnail and accessible activation control preserve a useful fallback
 * while the iframe is deferred.
 */
export function DeferredYouTubeEmbed({
  className,
  poster,
  rootMargin = DEFAULT_DEFERRED_YOUTUBE_ROOT_MARGIN,
  style,
  title,
  ...props
}: DeferredYouTubeEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isNearViewport = useOnScreen(containerRef, rootMargin, { once: true })
  const [isActivated, setIsActivated] = useState(false)
  const isLoaded = isNearViewport || isActivated
  const thumbnail = poster ?? getYouTubeThumbnail(props.src)

  return (
    <div ref={containerRef} className={cx('relative overflow-hidden', className)} style={style}>
      {isLoaded ? (
        <LazyYouTubeEmbed {...props} title={title} className="block h-full w-full" />
      ) : (
        <button
          data-slot="button"
          type="button"
          className={cx(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'absolute inset-0 z-10 !h-full !w-full !rounded-none !border-0 !bg-black !p-0 !text-white hover:!bg-black focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          )}
          aria-label={`Load ${title} video`}
          onClick={() => setIsActivated(true)}
        >
          {thumbnail ? (
            <NativeImage
              src={thumbnail}
              alt=""
              fill
              sizes="100vw"
              aria-hidden="true"
              className="object-cover"
            />
          ) : null}
          <span
            aria-hidden="true"
            className="relative z-10 size-0 border-y-[10px] border-y-transparent border-l-[15px] border-l-white drop-shadow-lg"
          ></span>
        </button>
      )}
    </div>
  )
}

export default DeferredYouTubeEmbed
