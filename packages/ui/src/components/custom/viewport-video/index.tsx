import { memo, type VideoHTMLAttributes } from 'react'

import ViewportVideoBoundary from './ViewportVideoBoundary'

export type ViewportVideoProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  'autoPlay' | 'preload'
> & {
  /** Automatically play while the video is near the viewport. */
  playOnViewport?: boolean
  rootMargin?: string
  src: string
}

export const ViewportVideo = memo(function ViewportVideo({
  playOnViewport = true,
  rootMargin = '0px',
  src,
  ...props
}: ViewportVideoProps) {
  return (
    <ViewportVideoBoundary
      playOnViewport={playOnViewport}
      rootMargin={rootMargin}
      src={src}
      {...props}
    />
  )
})

export default ViewportVideo
