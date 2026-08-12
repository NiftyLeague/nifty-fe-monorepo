'use client'

import { useRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react'
import { useParallax } from '@nl/ui/hooks/useParallax'
import type { ParallaxDirection, ParallaxIntensity } from '@nl/ui/hooks/useParallax'

export interface ParallaxWrapperProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  parallaxDirection?: ParallaxDirection
  parallaxIntensity?: ParallaxIntensity
  component?: ElementType
}

export function ParallaxWrapper({
  children,
  parallaxDirection = 'left',
  parallaxIntensity = 'normal',
  component: Wrapper = 'div',
  ...props
}: ParallaxWrapperProps) {
  const ref = useRef<HTMLElement>(null)

  useParallax(ref, {
    enabled: true,
    direction: parallaxDirection,
    intensity: parallaxIntensity,
  })

  return (
    <Wrapper ref={ref} {...props}>
      {children}
    </Wrapper>
  )
}

export default ParallaxWrapper
