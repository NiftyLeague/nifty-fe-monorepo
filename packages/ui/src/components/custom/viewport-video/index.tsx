import { splitProps, type ComponentProps } from 'solid-js'

import ViewportVideoBoundary from './ViewportVideoBoundary'
import { DEFAULT_VIEWPORT_VIDEO_ROOT_MARGIN } from './constants'

export type ViewportVideoProps = Omit<ComponentProps<'video'>, 'autoplay' | 'preload'> & {
  /** Automatically play while the video is near the viewport. */
  playOnViewport?: boolean
  /** Defer loading a visible video until the browser has had idle time. */
  deferLoad?: boolean
  rootMargin?: string
  src: string
}

export { DEFAULT_VIEWPORT_VIDEO_ROOT_MARGIN }

export function ViewportVideo(props: ViewportVideoProps) {
  const [local, others] = splitProps(props, ['deferLoad', 'playOnViewport', 'rootMargin', 'src'])
  return (
    <ViewportVideoBoundary
      deferLoad={local.deferLoad ?? false}
      playOnViewport={local.playOnViewport ?? true}
      rootMargin={local.rootMargin ?? DEFAULT_VIEWPORT_VIDEO_ROOT_MARGIN}
      src={local.src}
      {...others}
    />
  )
}

export default ViewportVideo
