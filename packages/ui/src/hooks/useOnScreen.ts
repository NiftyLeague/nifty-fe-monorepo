'use client'

import { RefObject, useState, useEffect } from 'react'

type VisibilityCallback = (isIntersecting: boolean) => void

type SharedObserver = {
  observer: IntersectionObserver
  elements: Set<Element>
}

/**
 * Shared IntersectionObserver instances keyed by rootMargin.
 *
 * Consumers (e.g. every `AnimatedWrapper` on the landing page and every
 * `DegenCardInView` in the app) previously created one native observer per
 * mounted component. Keeping a single observer per distinct rootMargin avoids
 * instantiating dozens of observers on pages that render many animated
 * wrappers while preserving identical visibility semantics.
 */
const observersByRootMargin = new Map<string, SharedObserver>()
const callbacksByElement = new Map<Element, Set<VisibilityCallback>>()

const getSharedObserver = (rootMargin: string): SharedObserver => {
  let sharedObserver = observersByRootMargin.get(rootMargin)
  if (!sharedObserver) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          callbacksByElement.get(entry.target)?.forEach((callback) => {
            callback(entry.isIntersecting)
          })
        }
      },
      { rootMargin }
    )
    sharedObserver = { observer, elements: new Set() }
    observersByRootMargin.set(rootMargin, sharedObserver)
  }
  return sharedObserver
}

export function useOnScreen<T extends Element = HTMLDivElement>(
  ref: RefObject<T | null>,
  rootMargin: string = '0px'
): boolean {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState<boolean>(false)
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const sharedObserver = getSharedObserver(rootMargin)
    const callbacks = callbacksByElement.get(element) ?? new Set<VisibilityCallback>()
    callbacks.add(setIntersecting)
    callbacksByElement.set(element, callbacks)
    sharedObserver.elements.add(element)
    sharedObserver.observer.observe(element)
    return () => {
      callbacks.delete(setIntersecting)
      if (callbacks.size === 0) {
        callbacksByElement.delete(element)
        sharedObserver.elements.delete(element)
        sharedObserver.observer.unobserve(element)
      }
      if (sharedObserver.elements.size === 0) {
        sharedObserver.observer.disconnect?.()
        observersByRootMargin.delete(rootMargin)
      }
    }
    // ref is intentionally excluded: callbacks must not re-subscribe on re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootMargin])
  return isIntersecting
}

export default useOnScreen
