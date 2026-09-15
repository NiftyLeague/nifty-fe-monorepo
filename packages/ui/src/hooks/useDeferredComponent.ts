import { createEffect, createSignal, onCleanup, type Accessor, type Component } from 'solid-js'

export type DeferredComponentLoader<T extends object> = () => Promise<{ default: Component<T> }>

export interface DeferredComponentState<T extends object> {
  Component: Accessor<Component<T> | null>
  hasError: Accessor<boolean>
  retry: () => void
}

const componentLoadCache = new WeakMap<object, Promise<unknown>>()

function getComponentLoad<T extends object>(load: DeferredComponentLoader<T>) {
  const cachedLoad = componentLoadCache.get(load)
  if (cachedLoad) return cachedLoad as Promise<{ default: Component<T> }>

  const nextLoad = Promise.resolve().then(load)
  componentLoadCache.set(load, nextLoad)
  return nextLoad
}

/**
 * Shares the cancellable lazy-component state machine used by immediate and
 * viewport-gated boundaries across the apps.
 */
export function useDeferredComponent<T extends object>(
  load: DeferredComponentLoader<T>,
  enabled: Accessor<boolean> | boolean = true
): DeferredComponentState<T> {
  const [Component, setComponent] = createSignal<Component<T> | null>(null)
  const [hasError, setHasError] = createSignal(false)
  const [retryCount, setRetryCount] = createSignal(0)

  const isEnabled = () => (typeof enabled === 'function' ? enabled() : enabled)

  createEffect(() => {
    if (!isEnabled() || Component() || retryCount() < 0) return

    let active = true
    setHasError(false)

    const pendingLoad = getComponentLoad(load)

    pendingLoad
      .then(({ default: nextComponent }) => {
        if (active) setComponent(() => nextComponent)
      })
      .catch(() => {
        if (componentLoadCache.get(load) === pendingLoad) componentLoadCache.delete(load)
        if (active) setHasError(true)
      })

    onCleanup(() => {
      active = false
    })
  })

  const retry = () => setRetryCount((count) => count + 1)

  return { Component, hasError, retry }
}

export default useDeferredComponent
