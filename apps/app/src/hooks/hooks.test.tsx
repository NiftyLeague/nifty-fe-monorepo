import { act, renderHook, waitFor } from '@nl/ui/test-utils'
import { describe, expect, it } from 'bun:test'

import useLocalStorage from './useLocalStorage'

describe('useLocalStorage', () => {
  it('hydrates, persists changed values, and clears stored state', async () => {
    window.localStorage.setItem('preferences', JSON.stringify({ compact: true }))
    const { result } = renderHook(() => useLocalStorage('preferences', { compact: false }))

    expect(result.current[0]()).toEqual({ compact: true })
    act(() => result.current[1]({ compact: false }))
    await waitFor(() =>
      expect(window.localStorage.getItem('preferences')).toBe('{"compact":false}')
    )

    act(() => result.current[2]())
    expect(result.current[0]()).toBeUndefined()
    expect(window.localStorage.getItem('preferences')).toBeNull()
  })

  it('falls back when persisted JSON is invalid', () => {
    window.localStorage.setItem('broken', '{')
    const { result } = renderHook(() => useLocalStorage('broken', { fallback: true }))

    expect(result.current[0]()).toBe('{')
  })
})
