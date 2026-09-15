'use client'

import { useCallback, type Dispatch, type SetStateAction } from 'react'
import { useStore } from 'zustand'

import { getLocalStorageStore } from '@/state/local-storage-store'

// ==============================|| Local Storage Hook ||============================== //

/**
 * Reads and writes one named local-storage key through the shared per-key
 * store, so every consumer of a key observes the same value and re-renders
 * only when that key changes.
 */
export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, () => void] {
  const store = getLocalStorageStore(key, initialValue)
  const storedValue = useStore(store, (state) => state.value)

  const setStoredValue = useCallback<Dispatch<SetStateAction<T | undefined>>>(
    (next) => {
      store.set(next)
    },
    [store]
  )

  const clearStoredValue = useCallback(() => {
    store.clear()
  }, [store])

  return [storedValue, setStoredValue, clearStoredValue]
}
