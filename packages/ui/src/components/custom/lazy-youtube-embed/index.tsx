import type { ComponentPropsWithoutRef } from 'react'

const YOUTUBE_ALLOW =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'

export type LazyYouTubeEmbedProps = Omit<
  ComponentPropsWithoutRef<'iframe'>,
  'allow' | 'allowFullScreen' | 'loading' | 'src' | 'title'
> & {
  src: string
  title: string
}

/**
 * Shared accessible YouTube embed with native browser lazy loading.
 *
 * Keeping the iframe behind one primitive prevents marketing pages from
 * eagerly opening third-party connections before a visitor reaches the video.
 */
export function LazyYouTubeEmbed({ src, title, ...props }: LazyYouTubeEmbedProps) {
  return (
    <iframe
      {...props}
      src={src}
      title={title}
      loading="lazy"
      allow={YOUTUBE_ALLOW}
      allowFullScreen
      frameBorder={0}
    />
  )
}

export default LazyYouTubeEmbed
