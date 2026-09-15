import { createStore, type StoreApi } from 'zustand/vanilla'
import type { SetStateAction } from 'react'

import { safeJSONParse } from '@/utils/json'
import { areValuesEqual } from '@/utils/value-equality'

/**
 * One reactive owner per local-storage key. Values are parsed once per raw
 * change, so every subscriber of a key observes the same stable reference and
 * writes are the only thing that can move it. This replaces the per-component
 * useState mirrors that previously re-parsed and re-compared storage on every
 * change, and it keeps cross-tab `storage` events in sync.
 */
type LocalStorageStore<T> = StoreApi<{ value: T | undefined }> & {
  readonly key: string
  set: (next: SetStateAction<T | undefined>) => void
  clear: () => void
  sync: () => void
}

const readStoredValue = <T>(key: string, initialValue: T): T | undefined => {
  if (typeof window === 'undefined') return initialValue
  try {
    const item = window.localStorage.getItem(key)
    return item ? (safeJSONParse(item) as T) : initialValue
  } catch (error) {
    console.error(error)
    return initialValue
  }
}

const registry = new Map<string, LocalStorageStore<never>>()

export const createLocalStorageStore = <T>(key: string, initialValue: T): LocalStorageStore<T> => {
  const store = createStore<{ value: T | undefined }>()(() => ({
    value: readStoredValue(key, initialValue),
  }))

  const persist = (value: T | undefined) => {
    if (typeof window === 'undefined') return
    try {
      if (value === undefined) window.localStorage.removeItem(key)
      else window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }

  const localStorageStore: LocalStorageStore<T> = Object.assign(store, {
    key,
    set: (next: SetStateAction<T | undefined>) => {
      const previous = store.getState().value
      const value =
        typeof next === 'function'
          ? (next as (previous: T | undefined) => T | undefined)(previous)
          : next
      // Deep-equal writes keep the previous reference so subscribers never
      // re-render for a no-op set, matching the old effect's write guard.
      if (areValuesEqual(value, previous)) return
      persist(value)
      store.setState({ value })
    },
    clear: () => {
      persist(undefined)
      store.setState({ value: undefined })
    },
    sync: () => {
      if (typeof window === 'undefined') return
      try {
        const item = window.localStorage.getItem(key)
        // Cross-tab removals read as absent, not as the initial fallback.
        const value = item ? (safeJSONParse(item) as T) : undefined
        if (!areValuesEqual(value, store.getState().value)) store.setState({ value })
      } catch (error) {
        console.error(error)
      }
    },
  })
  registry.set(key, localStorageStore as unknown as LocalStorageStore<never>)
  return localStorageStore
}

export const getLocalStorageStore = <T>(key: string, initialValue: T): LocalStorageStore<T> =>
  (registry.get(key) as LocalStorageStore<T> | undefined) ??
  createLocalStorageStore(key, initialValue)

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.storageArea && event.storageArea !== window.localStorage) return
    if (event.key === null) {
      for (const store of registry.values()) store.sync()
      return
    }
    registry.get(event.key)?.sync()
  })
}
