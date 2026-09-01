'use client'

import { startTransition, useEffect, useRef, useState, type RefObject } from 'react'

type VisibilityCallback = (isIntersecting: boolean) => void

type UseOnScreenOptions = {
  /** Keep the element visible after its first intersection. */
  once?: boolean
  /** Skip observing until the consumer needs visibility updates. */
  enabled?: boolean
}

type SharedObserver = {
  observer: IntersectionObserver
  elements: Set<Element>
}

/**
 * Shared IntersectionObserver instances keyed by rootMargin.
 *
 * Consumers (e.g. `DegenCardInView` in the app and deferred media sections)
 * previously created one native observer per mounted component. Keeping a
 * single observer per distinct rootMargin avoids instantiating redundant
 * observers while preserving identical visibility semantics.
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

const subscribeToVisibility = (
  element: Element,
  rootMargin: string,
  callback: VisibilityCallback
): (() => void) => {
  const sharedObserver = getSharedObserver(rootMargin)
  const callbacks = callbacksByElement.get(element) ?? new Set<VisibilityCallback>()
  let subscribed = true
  callbacks.add(callback)
  callbacksByElement.set(element, callbacks)
  sharedObserver.elements.add(element)
  sharedObserver.observer.observe(element)

  return () => {
    if (!subscribed) return
    subscribed = false
    callbacks.delete(callback)
    if (callbacks.size > 0) return

    callbacksByElement.delete(element)
    sharedObserver.elements.delete(element)
    sharedObserver.observer.unobserve(element)

    if (sharedObserver.elements.size === 0) {
      sharedObserver.observer.disconnect?.()
      observersByRootMargin.delete(rootMargin)
    }
  }
}

export function useOnScreen<T extends Element = HTMLDivElement>(
  ref: RefObject<T | null>,
  rootMargin: string = '0px',
  { once = false, enabled = true }: UseOnScreenOptions = {}
): boolean {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState<boolean>(false)
  const isIntersectingRef = useRef(false)
  useEffect(() => {
    if (!enabled) {
      if (isIntersectingRef.current) {
        isIntersectingRef.current = false
        setIntersecting(false)
      }
      return
    }

    const element = ref.current
    if (!element) return

    if (typeof IntersectionObserver === 'undefined') {
      if (!isIntersectingRef.current) {
        isIntersectingRef.current = true
        setIntersecting(true)
      }
      return
    }

    let unsubscribe: () => void = () => undefined
    const handleVisibilityChange: VisibilityCallback = (visible) => {
      if (isIntersectingRef.current === visible) return

      isIntersectingRef.current = visible
      // Visibility changes can mount expensive deferred sections while the
      // user is actively scrolling. Keep the observer callback cheap and let
      // React yield to input before rendering the newly visible subtree.
      startTransition(() => setIntersecting(visible))
      if (once && visible) unsubscribe()
    }

    unsubscribe = subscribeToVisibility(element, rootMargin, handleVisibilityChange)
    return () => {
      unsubscribe()
    }
    // ref is intentionally excluded: callbacks must not re-subscribe on re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, once, rootMargin])
  return isIntersecting
}

export default useOnScreen
