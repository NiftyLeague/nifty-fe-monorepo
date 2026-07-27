import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'bun:test'
import useSetLocalStorage from './useSetLocalStorage'

describe('useSetLocalStorage', () => {
  beforeEach(() => window.localStorage.clear())

  it('persists initial and updated values', () => {
    const { result } = renderHook(() => useSetLocalStorage('theme-mode', 'dark'))
    expect(window.localStorage.getItem('theme-mode')).toBe('"dark"')

    act(() => result.current[1]('light'))
    expect(result.current[0]).toBe('light')
    expect(window.localStorage.getItem('theme-mode')).toBe('"light"')
  })

  it('does not persist falsy values', () => {
    const { result } = renderHook(() => useSetLocalStorage('empty', 0))

    expect(result.current[0]).toBe(0)
    expect(window.localStorage.getItem('empty')).toBeNull()
  })
})
