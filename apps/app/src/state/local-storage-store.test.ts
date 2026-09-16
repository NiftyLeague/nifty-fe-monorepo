import { act, renderHook } from '@nl/ui/test-utils'
import { createComputed, createRoot } from 'solid-js'
import { beforeEach, describe, expect, it } from 'bun:test'

import { createLocalStorageStore, getLocalStorageStore } from '@/state/local-storage-store'
import useLocalStorage from '@/hooks/useLocalStorage'

let keyIndex = 0
const nextKey = (prefix: string) => `${prefix}-${(keyIndex += 1)}`

beforeEach(() => {
  window.localStorage.clear()
})

describe('local-storage store', () => {
  it('hydrates from existing storage and persists writes', () => {
    const key = nextKey('store')
    window.localStorage.setItem(key, JSON.stringify(['1', '2']))

    const store = createLocalStorageStore<string[]>(key, [])
    expect(store.value()).toEqual(['1', '2'])

    store.set(['1', '2', '3'])
    expect(window.localStorage.getItem(key)).toBe(JSON.stringify(['1', '2', '3']))
    expect(store.value()).toEqual(['1', '2', '3'])
  })

  it('falls back to the initial value when the key is absent', () => {
    const store = createLocalStorageStore<string>(nextKey('absent'), 'fallback')
    expect(store.value()).toBe('fallback')
    expect(window.localStorage.getItem(store.key)).toBeNull()
  })

  it('keeps safeJSONParse semantics for stored payloads', () => {
    const rawKey = nextKey('raw')
    window.localStorage.setItem(rawKey, 'not-json{')
    expect(createLocalStorageStore(rawKey, 'x').value()).toBe('not-json{')

    const nullKey = nextKey('null')
    window.localStorage.setItem(nullKey, 'null')
    expect(createLocalStorageStore<string | null>(nullKey, 'x').value()).toBeNull()
  })

  it('supports updater functions against the current value', () => {
    const key = nextKey('updater')
    window.localStorage.setItem(key, JSON.stringify({ count: 1 }))
    const store = createLocalStorageStore<{ count: number }>(key, { count: 0 })

    store.set((previous) => ({ count: (previous?.count ?? 0) + 1 }))

    expect(store.value()).toEqual({ count: 2 })
    expect(window.localStorage.getItem(key)).toBe(JSON.stringify({ count: 2 }))
  })

  it('removes the key when set to undefined and on clear', () => {
    const key = nextKey('remove')
    const store = createLocalStorageStore<string>(key, 'x')
    store.set('value')
    expect(window.localStorage.getItem(key)).toBe(JSON.stringify('value'))

    store.set(undefined)
    expect(window.localStorage.getItem(key)).toBeNull()
    expect(store.value()).toBeUndefined()

    store.set('again')
    store.clear()
    expect(window.localStorage.getItem(key)).toBeNull()
    expect(store.value()).toBeUndefined()
  })

  it('does not move the value reference for deep-equal writes', () => {
    const store = createLocalStorageStore<string[]>(nextKey('stable'), [])
    store.set(['7'])
    const reference = store.value()

    let runs = 0
    createRoot((dispose) => {
      createComputed(() => {
        runs += 1
        store.value()
      })
      store.set(['7'])
      expect(runs).toBe(1)
      dispose()
    })

    expect(store.value()).toBe(reference)
    expect(window.localStorage.getItem(store.key)).toBe(JSON.stringify(['7']))
  })

  it('reuses one store per key across call sites', () => {
    const key = nextKey('shared')
    const first = getLocalStorageStore<string[]>(key, [])
    const second = getLocalStorageStore<string[]>(key, ['ignored'])

    expect(first).toBe(second)
    first.set(['1'])
    expect(second.value()).toEqual(['1'])
  })

  it('syncs from other tabs through storage events', () => {
    const key = nextKey('cross-tab')
    const store = createLocalStorageStore<string[]>(key, [])
    store.set(['1'])

    window.localStorage.setItem(key, JSON.stringify(['1', '2']))
    window.dispatchEvent(new StorageEvent('storage', { key }))

    expect(store.value()).toEqual(['1', '2'])

    window.localStorage.removeItem(key)
    window.dispatchEvent(new StorageEvent('storage', { key }))
    expect(store.value()).toBeUndefined()
  })

  it('keeps the hook and raw subscribers on the same store', () => {
    const key = nextKey('hook')
    const { result } = renderHook(() => useLocalStorage<string[]>(key, []))

    expect(result.current[0]()).toEqual([])

    act(() => {
      getLocalStorageStore<string[]>(key, []).set(['9'])
    })

    expect(result.current[0]()).toEqual(['9'])
    expect(window.localStorage.getItem(key)).toBe(JSON.stringify(['9']))
  })
})
