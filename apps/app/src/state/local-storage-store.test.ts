import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, spyOn } from 'bun:test'

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
    expect(store.getState().value).toEqual(['1', '2'])

    store.set(['1', '2', '3'])
    expect(window.localStorage.getItem(key)).toBe(JSON.stringify(['1', '2', '3']))
    expect(store.getState().value).toEqual(['1', '2', '3'])
  })

  it('falls back to the initial value when the key is absent', () => {
    const store = createLocalStorageStore<string>(nextKey('absent'), 'fallback')
    expect(store.getState().value).toBe('fallback')
    expect(window.localStorage.getItem(store.key)).toBeNull()
  })

  it('keeps safeJSONParse semantics for stored payloads', () => {
    const rawKey = nextKey('raw')
    window.localStorage.setItem(rawKey, 'not-json{')
    expect(createLocalStorageStore(rawKey, 'x').getState().value).toBe('not-json{')

    const nullKey = nextKey('null')
    window.localStorage.setItem(nullKey, 'null')
    expect(createLocalStorageStore<string | null>(nullKey, 'x').getState().value).toBeNull()
  })

  it('supports updater functions against the current value', () => {
    const key = nextKey('updater')
    window.localStorage.setItem(key, JSON.stringify({ count: 1 }))
    const store = createLocalStorageStore<{ count: number }>(key, { count: 0 })

    store.set((previous) => ({ count: (previous?.count ?? 0) + 1 }))

    expect(store.getState().value).toEqual({ count: 2 })
    expect(window.localStorage.getItem(key)).toBe(JSON.stringify({ count: 2 }))
  })

  it('removes the key when set to undefined and on clear', () => {
    const key = nextKey('remove')
    const store = createLocalStorageStore<string>(key, 'x')
    store.set('value')
    expect(window.localStorage.getItem(key)).toBe(JSON.stringify('value'))

    store.set(undefined)
    expect(window.localStorage.getItem(key)).toBeNull()
    expect(store.getState().value).toBeUndefined()

    store.set('again')
    store.clear()
    expect(window.localStorage.getItem(key)).toBeNull()
    expect(store.getState().value).toBeUndefined()
  })

  it('does not move the value reference for deep-equal writes', () => {
    const store = createLocalStorageStore<string[]>(nextKey('stable'), [])
    store.set(['7'])
    const reference = store.getState().value

    const listener = spyOn({ listener: () => {} }, 'listener')
    const unsubscribe = store.subscribe(listener)
    store.set(['7'])
    unsubscribe()

    expect(listener).not.toHaveBeenCalled()
    expect(store.getState().value).toBe(reference)
    expect(window.localStorage.getItem(store.key)).toBe(JSON.stringify(['7']))
  })

  it('reuses one store per key across call sites', () => {
    const key = nextKey('shared')
    const first = getLocalStorageStore<string[]>(key, [])
    const second = getLocalStorageStore<string[]>(key, ['ignored'])

    expect(first).toBe(second)
    first.set(['1'])
    expect(second.getState().value).toEqual(['1'])
  })

  it('syncs from other tabs through storage events', () => {
    const key = nextKey('cross-tab')
    const store = createLocalStorageStore<string[]>(key, [])
    store.set(['1'])

    window.localStorage.setItem(key, JSON.stringify(['1', '2']))
    window.dispatchEvent(new StorageEvent('storage', { key }))

    expect(store.getState().value).toEqual(['1', '2'])

    window.localStorage.removeItem(key)
    window.dispatchEvent(new StorageEvent('storage', { key }))
    expect(store.getState().value).toBeUndefined()
  })

  it('keeps the hook and raw subscribers on the same store', () => {
    const key = nextKey('hook')
    const { result } = renderHook(() => useLocalStorage<string[]>(key, []))

    expect(result.current[0]).toEqual([])

    act(() => {
      getLocalStorageStore<string[]>(key, []).set(['9'])
    })

    expect(result.current[0]).toEqual(['9'])
    expect(window.localStorage.getItem(key)).toBe(JSON.stringify(['9']))
  })
})
