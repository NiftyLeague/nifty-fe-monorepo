'use client'

import { useEffect, type RefObject } from 'react'

import useMediaQuery from '@nl/ui/hooks/useMediaQuery'

export interface ViewportVideoEnhancerProps {
  isNearViewport: boolean
  playOnViewport: boolean
  videoRef: RefObject<HTMLVideoElement | null>
}

export default function ViewportVideoEnhancer({
  isNearViewport,
  playOnViewport,
  videoRef,
}: ViewportVideoEnhancerProps): null {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const shouldLoad = isNearViewport
  const shouldPlay = playOnViewport && isNearViewport && !prefersReducedMotion

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.autoplay = shouldPlay
    video.preload = shouldLoad ? 'metadata' : 'none'

    if (!shouldPlay) {
      video.pause?.()
      return
    }

    const playPromise = video.play?.()
    playPromise?.catch(() => undefined)
  }, [shouldLoad, shouldPlay, videoRef])

  return null
}
