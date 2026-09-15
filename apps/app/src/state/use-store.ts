import { createSignal, onCleanup, type Accessor } from 'solid-js'
import type { StoreApi } from 'zustand/vanilla'

/**
 * Solid equivalent of zustand's React `useStore`: subscribes to a vanilla
 * store and returns the selected slice as an accessor.
 */
export function useStore<S, U>(store: StoreApi<S>, selector: (state: S) => U): Accessor<U> {
  const [value, setValue] = createSignal<U>(selector(store.getState()))
  onCleanup(store.subscribe((state) => setValue(() => selector(state))))
  return value
}
