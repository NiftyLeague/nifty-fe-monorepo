'use client'

import { useEffect, useRef, useState } from 'react'

import type { ViewportVideoProps } from './index'

type ViewportVideoEnhancerComponent = typeof import('./ViewportVideoEnhancer').default

const loadViewportVideoEnhancer = () => import('./ViewportVideoEnhancer')

export default function ViewportVideoBoundary({
  playOnViewport = true,
  rootMargin = '0px',
  src,
  ...props
}: ViewportVideoProps): React.ReactNode {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ViewportVideoEnhancer, setViewportVideoEnhancer] =
    useState<ViewportVideoEnhancerComponent | null>(null)

  useEffect(() => {
    let active = true

    void loadViewportVideoEnhancer()
      .then(({ default: Enhancer }) => {
        if (active) setViewportVideoEnhancer(() => Enhancer)
      })
      .catch(() => undefined)

    return () => {
      active = false
    }
  }, [])

  return (
    <>
      <video {...props} ref={videoRef} preload="none">
        <source src={src} type="video/mp4" />
      </video>
      {ViewportVideoEnhancer ? (
        <ViewportVideoEnhancer
          playOnViewport={playOnViewport}
          rootMargin={rootMargin}
          videoRef={videoRef}
        />
      ) : null}
    </>
  )
}
