'use client'

import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from 'react'

import { useOnScreen } from '@nl/ui/hooks/useOnScreen'
import type { ViewportVideoProps } from './index'
import type { ViewportVideoEnhancerProps } from './ViewportVideoEnhancer'
import { DEFAULT_VIEWPORT_VIDEO_ROOT_MARGIN } from './constants'

const ViewportVideoEnhancer = lazy<ComponentType<ViewportVideoEnhancerProps>>(
  () => import('./ViewportVideoEnhancer')
)

const DEFERRED_VIDEO_LOAD_DELAY_MS = 750

function scheduleDeferredLoad(callback: () => void): () => void {
  let idleCallbackId: number | undefined
  const delayId = window.setTimeout(() => {
    if ('requestIdleCallback' in window) {
      idleCallbackId = window.requestIdleCallback(callback, { timeout: 1500 })
      return
    }

    callback()
  }, DEFERRED_VIDEO_LOAD_DELAY_MS)

  return () => {
    window.clearTimeout(delayId)
    if (idleCallbackId !== undefined && 'cancelIdleCallback' in window) {
      window.cancelIdleCallback(idleCallbackId)
    }
  }
}

export default function ViewportVideoBoundary({
  deferLoad = false,
  playOnViewport = true,
  rootMargin = DEFAULT_VIEWPORT_VIDEO_ROOT_MARGIN,
  src,
  ...props
}: ViewportVideoProps): React.ReactNode {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false)
  const isNearViewport = useOnScreen(videoRef, rootMargin)
  const shouldRenderMedia = hasEnteredViewport || (isNearViewport && !deferLoad)

  useEffect(() => {
    if (!isNearViewport || hasEnteredViewport) return
    if (!deferLoad) {
      setHasEnteredViewport(true)
      return
    }

    return scheduleDeferredLoad(() => setHasEnteredViewport(true))
  }, [deferLoad, hasEnteredViewport, isNearViewport])

  return (
    <>
      <video
        {...props}
        ref={videoRef}
        preload={shouldRenderMedia && isNearViewport ? 'metadata' : 'none'}
      >
        {shouldRenderMedia ? <source src={src} type="video/mp4" /> : null}
      </video>
      {shouldRenderMedia ? (
        <Suspense fallback={null}>
          <ViewportVideoEnhancer
            isNearViewport={isNearViewport}
            playOnViewport={playOnViewport}
            videoRef={videoRef}
          />
        </Suspense>
      ) : null}
    </>
  )
}
