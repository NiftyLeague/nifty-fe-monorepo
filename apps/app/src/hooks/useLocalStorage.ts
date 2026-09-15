'use client'

import type { Accessor } from 'solid-js'

import { getLocalStorageStore } from '@/state/local-storage-store'
import { useStore } from '@/state/use-store'

// ==============================|| Local Storage Hook ||============================== //

/**
 * Reads and writes one named local-storage key through the shared per-key
 * store, so every consumer of a key observes the same value and re-renders
 * only when that key changes.
 */
export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): [
  Accessor<T | undefined>,
  (v: T | undefined | ((prev: T | undefined) => T | undefined)) => void,
  () => void,
] {
  const store = getLocalStorageStore(key, initialValue)
  const storedValue = useStore(store, (state) => state.value)

  const setStoredValue = (next: T | undefined | ((prev: T | undefined) => T | undefined)) => {
    store.set(next)
  }

  const clearStoredValue = () => {
    store.clear()
  }

  return [storedValue, setStoredValue, clearStoredValue]
}
