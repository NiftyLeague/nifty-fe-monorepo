'use client'

import { useCallback, useEffect, useState, type ComponentType } from 'react'

export type DeferredComponentLoader<T extends object> = () => Promise<{
  default: ComponentType<T>
}>

export interface DeferredComponentState<T extends object> {
  Component: ComponentType<T> | null
  hasError: boolean
  retry: () => void
}

/**
 * Shares the cancellable lazy-component state machine used by immediate and
 * viewport-gated boundaries across the apps.
 */
export function useDeferredComponent<T extends object>(
  load: DeferredComponentLoader<T>,
  enabled = true
): DeferredComponentState<T> {
  const [Component, setComponent] = useState<ComponentType<T> | null>(null)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!enabled || Component) return

    let active = true
    setHasError(false)

    load()
      .then(({ default: nextComponent }) => {
        if (active) setComponent(() => nextComponent)
      })
      .catch(() => {
        if (active) setHasError(true)
      })

    return () => {
      active = false
    }
  }, [Component, enabled, load, retryCount])

  const retry = useCallback(() => setRetryCount((count) => count + 1), [])

  return { Component, hasError, retry }
}

export default useDeferredComponent
