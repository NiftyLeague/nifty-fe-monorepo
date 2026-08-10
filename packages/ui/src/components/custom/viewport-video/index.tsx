'use client'

import { memo, useEffect, useRef, type VideoHTMLAttributes } from 'react'

import useMediaQuery from '@nl/ui/hooks/useMediaQuery'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

type ViewportVideoProps = Omit<VideoHTMLAttributes<HTMLVideoElement>, 'autoPlay' | 'preload'> & {
  rootMargin?: string
  src: string
}

export const ViewportVideo = memo(function ViewportVideo({
  rootMargin = '300px',
  src,
  ...props
}: ViewportVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const isNearViewport = useOnScreen(videoRef, rootMargin)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const shouldPlay = isNearViewport && !prefersReducedMotion

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (!shouldPlay) {
      video.pause?.()
      return
    }

    const playPromise = video.play?.()
    playPromise?.catch(() => undefined)
  }, [shouldPlay])

  return (
    <video
      {...props}
      ref={videoRef}
      autoPlay={shouldPlay}
      preload={shouldPlay ? 'metadata' : 'none'}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
})

export default ViewportVideo
