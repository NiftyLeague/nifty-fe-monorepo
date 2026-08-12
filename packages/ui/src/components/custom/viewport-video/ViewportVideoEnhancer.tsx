'use client'

import { useEffect, type RefObject } from 'react'

import useMediaQuery from '@nl/ui/hooks/useMediaQuery'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

interface ViewportVideoEnhancerProps {
  rootMargin: string
  videoRef: RefObject<HTMLVideoElement | null>
}

export default function ViewportVideoEnhancer({
  rootMargin,
  videoRef,
}: ViewportVideoEnhancerProps): null {
  const isNearViewport = useOnScreen(videoRef, rootMargin)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const shouldPlay = isNearViewport && !prefersReducedMotion

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.autoplay = shouldPlay
    video.preload = shouldPlay ? 'metadata' : 'none'

    if (!shouldPlay) {
      video.pause?.()
      return
    }

    const playPromise = video.play?.()
    playPromise?.catch(() => undefined)
  }, [shouldPlay, videoRef])

  return null
}
