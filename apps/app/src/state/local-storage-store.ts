import { createSignal, untrack, type Accessor } from 'solid-js'
import type { SetStateAction } from '@/types'

import { safeJSONParse } from '@/utils/json'
import { areValuesEqual } from '@/utils/value-equality'

/**
 * One reactive owner per local-storage key, backed by a single signal. Values
 * are parsed once per raw change, so every subscriber of a key observes the
 * same stable reference and writes are the only thing that can move it. This
 * replaces the per-component useState mirrors that previously re-parsed and
 * re-compared storage on every change, and it keeps cross-tab `storage`
 * events in sync.
 */
export type LocalStorageStore<T> = {
  readonly key: string
  /** Reactive accessor for the current value. */
  readonly value: Accessor<T | undefined>
  set: (next: SetStateAction<T | undefined>) => void
  clear: () => void
  sync: () => void
}

/**
 * The initial value may be a thunk so keys whose fallback is generated
 * (UUID/nonce) resolve on the client only: workerd forbids random values at
 * module scope, and a server-generated fallback is per-request garbage that
 * nothing reads.
 */
const readStoredValue = <T>(key: string, initialValue: T | (() => T)): T | undefined => {
  if (typeof window === 'undefined') return undefined
  const resolved = typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue
  try {
    const item = window.localStorage.getItem(key)
    return item ? (safeJSONParse(item) as T) : resolved
  } catch (error) {
    console.error(error)
    return resolved
  }
}

const registry = new Map<string, LocalStorageStore<never>>()

export const createLocalStorageStore = <T>(
  key: string,
  initialValue: T | (() => T)
): LocalStorageStore<T> => {
  const [value, setValue] = createSignal<T | undefined>(readStoredValue(key, initialValue))

  const persist = (nextValue: T | undefined) => {
    if (typeof window === 'undefined') return
    try {
      if (nextValue === undefined) window.localStorage.removeItem(key)
      else window.localStorage.setItem(key, JSON.stringify(nextValue))
    } catch (error) {
      console.error(error)
    }
  }

  const store: LocalStorageStore<T> = {
    key,
    value,
    set: (next: SetStateAction<T | undefined>) => {
      // Reads are untracked so `set` stays safe to call inside effects — it
      // must not subscribe the caller's scope to the key it is writing.
      const previous = untrack(value)
      const nextValue =
        typeof next === 'function'
          ? (next as (previous: T | undefined) => T | undefined)(previous)
          : next
      // Deep-equal writes keep the previous reference so subscribers never
      // re-render for a no-op set, matching the old effect's write guard.
      if (areValuesEqual(nextValue, previous)) return
      persist(nextValue)
      setValue(() => nextValue)
    },
    clear: () => {
      persist(undefined)
      setValue(() => undefined)
    },
    sync: () => {
      if (typeof window === 'undefined') return
      try {
        const item = window.localStorage.getItem(key)
        // Cross-tab removals read as absent, not as the initial fallback.
        const nextValue = item ? (safeJSONParse(item) as T) : undefined
        if (!areValuesEqual(nextValue, untrack(value))) setValue(() => nextValue)
      } catch (error) {
        console.error(error)
      }
    },
  }
  registry.set(key, store as unknown as LocalStorageStore<never>)
  return store
}

export const getLocalStorageStore = <T>(
  key: string,
  initialValue: T | (() => T)
): LocalStorageStore<T> =>
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
