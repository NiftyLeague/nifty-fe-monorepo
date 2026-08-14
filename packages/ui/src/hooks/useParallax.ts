'use client'

import { useEffect } from 'react'

import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

export type ParallaxDirection = 'up' | 'down' | 'left' | 'right'
export type ParallaxIntensity = 'lite' | 'normal' | 'strong' | 'extreme'

type ParallaxUpdate = () => void

const parallaxUpdates = new Set<ParallaxUpdate>()
let scheduledFrame: number | null = null
let cancelScheduledFrame: ((frame: number) => void) | null = null

// Function to apply the transform to the element or its child
const applyTransform = <T extends HTMLElement>(
  element: T,
  childClass: string,
  transform: string
): void => {
  const child = element.getElementsByClassName(childClass)[0] as HTMLElement | undefined
  if (child) {
    child.style.transform = transform
  } else {
    element.style.transform = transform
  }
}

const getTransitionMultiplier = (amount: ParallaxIntensity): number => {
  const multipliers = { lite: 0.5, normal: 1, strong: 2, extreme: 3 }
  return multipliers[amount] || multipliers.normal
}

// Calculates the transform based on user provided direction & transition amount
const calculateTransform = <T extends HTMLElement>(
  element: T,
  direction: ParallaxDirection,
  intensity: ParallaxIntensity
): string => {
  const rect = element.getBoundingClientRect()

  if (direction === 'down' || direction === 'up') {
    const translationY = (rect.top * 100) / window.innerHeight
    const directionValue = direction === 'down' ? -1 : 1
    const multiplier = getTransitionMultiplier(intensity)
    return `translateY(${translationY * directionValue * multiplier}px)`
  }

  // Horizontal parallax (left/right)
  const translationX = (rect.top * 100) / window.innerHeight
  const directionValue = direction === 'right' ? -1 : 1
  const multiplier = getTransitionMultiplier(intensity)
  return `translateX(${translationX * directionValue * multiplier}px)`
}

const flushParallaxUpdates = (): void => {
  scheduledFrame = null
  cancelScheduledFrame = null
  parallaxUpdates.forEach((update) => update())
}

const scheduleParallaxUpdates = (): void => {
  if (scheduledFrame !== null) return

  if (typeof window.requestAnimationFrame === 'function') {
    scheduledFrame = window.requestAnimationFrame(flushParallaxUpdates)
    cancelScheduledFrame = window.cancelAnimationFrame
    return
  }

  scheduledFrame = window.setTimeout(flushParallaxUpdates, 0)
  cancelScheduledFrame = window.clearTimeout
}

const handleParallaxScroll = (): void => {
  scheduleParallaxUpdates()
}

const subscribeToParallaxUpdates = (update: ParallaxUpdate): (() => void) => {
  if (parallaxUpdates.size === 0) {
    window.addEventListener('scroll', handleParallaxScroll, { passive: true })
  }

  parallaxUpdates.add(update)

  return () => {
    parallaxUpdates.delete(update)

    if (parallaxUpdates.size > 0) return

    window.removeEventListener('scroll', handleParallaxScroll)
    if (scheduledFrame !== null) {
      cancelScheduledFrame?.(scheduledFrame)
      scheduledFrame = null
      cancelScheduledFrame = null
    }
  }
}

interface UseParallaxOptions {
  enabled: boolean
  direction: ParallaxDirection
  intensity: ParallaxIntensity
}

const PARALLAX_ROOT_MARGIN = '200px'

export function useParallax<T extends HTMLElement = HTMLDivElement>(
  elementRef: React.RefObject<T | null>,
  options: UseParallaxOptions
) {
  const isNearViewport = useOnScreen(elementRef, PARALLAX_ROOT_MARGIN)

  useEffect(() => {
    if (!elementRef.current || !options.enabled || !isNearViewport) return

    const handleParallax = () => {
      const element = elementRef.current
      if (!element) return

      const transform = calculateTransform(element, options.direction, options.intensity)
      applyTransform(element, 'parallax-child', transform)
    }

    handleParallax()
    return subscribeToParallaxUpdates(handleParallax)
  }, [elementRef, options.enabled, options.direction, options.intensity, isNearViewport])
}

export default useParallax
