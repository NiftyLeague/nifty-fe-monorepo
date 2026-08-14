'use client'

import dynamic from 'next/dynamic'
import { useRef } from 'react'

import type { ViewportVideoProps } from './index'

const ViewportVideoEnhancer = dynamic(() => import('./ViewportVideoEnhancer'), { ssr: false })

export default function ViewportVideoBoundary({
  rootMargin = '0px',
  src,
  ...props
}: ViewportVideoProps): React.ReactNode {
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <>
      <video {...props} ref={videoRef} preload="none">
        <source src={src} type="video/mp4" />
      </video>
      <ViewportVideoEnhancer rootMargin={rootMargin} videoRef={videoRef} />
    </>
  )
}
