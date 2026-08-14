import { memo, type VideoHTMLAttributes } from 'react'

import ViewportVideoBoundary from './ViewportVideoBoundary'

export type ViewportVideoProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  'autoPlay' | 'preload'
> & {
  rootMargin?: string
  src: string
}

export const ViewportVideo = memo(function ViewportVideo({
  rootMargin = '0px',
  src,
  ...props
}: ViewportVideoProps) {
  return <ViewportVideoBoundary rootMargin={rootMargin} src={src} {...props} />
})

export default ViewportVideo
