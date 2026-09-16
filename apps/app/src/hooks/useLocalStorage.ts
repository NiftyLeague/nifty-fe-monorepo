import type { Accessor } from 'solid-js'

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
): [
  Accessor<T | undefined>,
  (v: T | undefined | ((prev: T | undefined) => T | undefined)) => void,
  () => void,
] {
  const store = getLocalStorageStore(key, initialValue)
  return [store.value, store.set, store.clear]
}
