import { splitProps, type ComponentProps } from 'solid-js'

const YOUTUBE_ALLOW =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'

export type LazyYouTubeEmbedProps = Omit<
  ComponentProps<'iframe'>,
  'allow' | 'allowfullscreen' | 'loading' | 'src' | 'title'
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
export function LazyYouTubeEmbed(props: LazyYouTubeEmbedProps) {
  const [local, others] = splitProps(props, ['src', 'title'])
  return (
    <iframe
      {...others}
      src={local.src}
      title={local.title}
      loading="lazy"
      allow={YOUTUBE_ALLOW}
      allowfullscreen
      frameborder={0}
    />
  )
}

export default LazyYouTubeEmbed
