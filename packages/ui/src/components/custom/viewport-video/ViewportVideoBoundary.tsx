'use client'

import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from 'react'

import { useOnScreen } from '@nl/ui/hooks/useOnScreen'
import type { ViewportVideoProps } from './index'
import type { ViewportVideoEnhancerProps } from './ViewportVideoEnhancer'

const ViewportVideoEnhancer = lazy<ComponentType<ViewportVideoEnhancerProps>>(
  () => import('./ViewportVideoEnhancer')
)

export default function ViewportVideoBoundary({
  playOnViewport = true,
  rootMargin = '0px',
  src,
  ...props
}: ViewportVideoProps): React.ReactNode {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false)
  const isNearViewport = useOnScreen(videoRef, rootMargin)

  useEffect(() => {
    if (isNearViewport) setHasEnteredViewport(true)
  }, [isNearViewport])

  return (
    <>
      <video {...props} ref={videoRef} preload={isNearViewport ? 'metadata' : 'none'}>
        <source src={src} type="video/mp4" />
      </video>
      {hasEnteredViewport || isNearViewport ? (
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
