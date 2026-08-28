'use client'

import { useEffect, useRef } from 'react'

import useMediaQuery from '@nl/ui/hooks/useMediaQuery'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

export type ParallaxDirection = 'up' | 'down' | 'left' | 'right'
export type ParallaxIntensity = 'lite' | 'normal' | 'strong' | 'extreme'

type ParallaxUpdate = () => void

const PARALLAX_CHILD_CLASS = 'parallax-child'
const TRANSITION_MULTIPLIERS: Record<ParallaxIntensity, number> = {
  lite: 0.5,
  normal: 1,
  strong: 2,
  extreme: 3,
}

const parallaxUpdates = new Set<ParallaxUpdate>()
let scheduledFrame: number | null = null
let cancelScheduledFrame: ((frame: number) => void) | null = null

const getTransitionMultiplier = (amount: ParallaxIntensity): number => {
  return TRANSITION_MULTIPLIERS[amount]
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
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  // The target does not change while a subscription is active; resolving it once
  // avoids traversing the DOM on every animation frame. A ref keeps the resolved
  // element mutable for the animation write while staying render-clean.
  const targetRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element || !options.enabled || prefersReducedMotion || !isNearViewport) return

    targetRef.current =
      (element.getElementsByClassName(PARALLAX_CHILD_CLASS)[0] as HTMLElement | undefined) ??
      element

    const handleParallax = () => {
      const target = targetRef.current
      if (!target) return
      const transform = calculateTransform(element, options.direction, options.intensity)
      if (target.style.transform !== transform) target.style.transform = transform
    }

    handleParallax()
    return subscribeToParallaxUpdates(handleParallax)
  }, [
    elementRef,
    options.enabled,
    options.direction,
    options.intensity,
    isNearViewport,
    prefersReducedMotion,
  ])
}

export default useParallax
