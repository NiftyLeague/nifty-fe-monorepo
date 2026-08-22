import { memo, type VideoHTMLAttributes } from 'react'

import ViewportVideoBoundary from './ViewportVideoBoundary'
import { DEFAULT_VIEWPORT_VIDEO_ROOT_MARGIN } from './constants'

export type ViewportVideoProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  'autoPlay' | 'preload'
> & {
  /** Automatically play while the video is near the viewport. */
  playOnViewport?: boolean
  /** Defer loading a visible video until the browser has had idle time. */
  deferLoad?: boolean
  rootMargin?: string
  src: string
}

export { DEFAULT_VIEWPORT_VIDEO_ROOT_MARGIN }

export const ViewportVideo = memo(function ViewportVideo({
  deferLoad = false,
  playOnViewport = true,
  rootMargin = DEFAULT_VIEWPORT_VIDEO_ROOT_MARGIN,
  src,
  ...props
}: ViewportVideoProps) {
  return (
    <ViewportVideoBoundary
      deferLoad={deferLoad}
      playOnViewport={playOnViewport}
      rootMargin={rootMargin}
      src={src}
      {...props}
    />
  )
})

export default ViewportVideo
