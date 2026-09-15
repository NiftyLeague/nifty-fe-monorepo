import { createEffect } from 'solid-js'

import useMediaQuery from '@nl/ui/hooks/useMediaQuery'

export interface ViewportVideoEnhancerProps {
  isNearViewport: boolean
  playOnViewport: boolean
  videoRef: () => HTMLVideoElement | undefined
}

export default function ViewportVideoEnhancer(props: ViewportVideoEnhancerProps): null {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const shouldLoad = () => props.isNearViewport
  const shouldPlay = () => props.playOnViewport && props.isNearViewport && !prefersReducedMotion()

  createEffect(() => {
    const video = props.videoRef()
    if (!video) return

    video.autoplay = shouldPlay()
    video.preload = shouldLoad() ? 'metadata' : 'none'

    if (!shouldPlay()) {
      video.pause?.()
      return
    }

    const playPromise = video.play?.()
    playPromise?.catch(() => undefined)
  })

  return null
}
