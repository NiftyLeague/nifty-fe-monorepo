import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

const contractReader = mock()

const interval = { clear: mock(async () => undefined), set: mock(() => 'interval-id') }

let useLocalStorage: typeof import('./useLocalStorage').default

beforeEach(async () => {
  mock.module('./useContractReader', () => ({ default: contractReader }))
  mock.module('set-interval-async/dynamic', () => ({
    clearIntervalAsync: interval.clear,
    setIntervalAsync: interval.set,
  }))
  const useLocalStorageModule = await import('./useLocalStorage')
  useLocalStorage = useLocalStorageModule.default
})

afterEach(() => {
  mock.restore()
  interval.clear.mockClear()
  interval.set.mockClear()
})

describe('useLocalStorage', () => {
  it('hydrates, persists changed values, and clears stored state', async () => {
    window.localStorage.setItem('preferences', JSON.stringify({ compact: true }))
    const { result } = renderHook(() => useLocalStorage('preferences', { compact: false }))

    expect(result.current[0]).toEqual({ compact: true })
    act(() => result.current[1]({ compact: false }))
    await waitFor(() =>
      expect(window.localStorage.getItem('preferences')).toBe('{"compact":false}')
    )

    act(() => result.current[2]())
    expect(result.current[0]).toBeUndefined()
    expect(window.localStorage.getItem('preferences')).toBeNull()
  })

  it('falls back when persisted JSON is invalid', () => {
    window.localStorage.setItem('broken', '{')
    const { result } = renderHook(() => useLocalStorage('broken', { fallback: true }))

    expect(result.current[0]).toBe('{')
  })
})

describe('useAsyncInterval', () => {
  it('runs leading and manually refreshed callbacks and installs an interval', async () => {
    const callback = mock(async () => undefined)
    const { default: useAsyncInterval } = await import('./useAsyncInterval')
    const { unmount } = renderHook(() => useAsyncInterval(callback, 100, true, 'refresh'))

    await waitFor(() => expect(callback).toHaveBeenCalledTimes(2))
    expect(interval.set).toHaveBeenCalledWith(expect.any(Function), 100)
    unmount()
  })

  it('does not install an interval when no delay is provided', async () => {
    const callback = mock(async () => undefined)
    const { default: useAsyncInterval } = await import('./useAsyncInterval')
    renderHook(() => useAsyncInterval(callback, undefined, false))

    await Promise.resolve()
    expect(callback).not.toHaveBeenCalled()
    expect(interval.set).not.toHaveBeenCalled()

    const { unmount } = renderHook(() => useAsyncInterval(callback, 100, false))
    expect(interval.set).toHaveBeenCalledWith(expect.any(Function), 100)
    expect(callback).not.toHaveBeenCalled()
    unmount()
  })

  it('cleans up the polling interval when the hook unmounts', async () => {
    const callback = mock(async () => undefined)
    const { default: useAsyncInterval } = await import('./useAsyncInterval')
    const { unmount } = renderHook(() => useAsyncInterval(callback, 100, false))

    await waitFor(() => expect(interval.set).toHaveBeenCalledWith(expect.any(Function), 100))
    unmount()

    expect(interval.clear).toHaveBeenCalledWith('interval-id')
  })

  it('does not schedule polling after unmounting during a leading read', async () => {
    let resolveCallback: () => void = () => undefined
    const callback = mock(
      () =>
        new Promise<void>((resolve) => {
          resolveCallback = resolve
        })
    )
    const { default: useAsyncInterval } = await import('./useAsyncInterval')
    const { unmount } = renderHook(() => useAsyncInterval(callback, 100, true))

    expect(callback).toHaveBeenCalledTimes(1)
    unmount()
    resolveCallback()
    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(interval.set).not.toHaveBeenCalled()
  })
})

describe('useRemovedTraits', () => {
  it('returns contract results and falls back to an empty list', async () => {
    const { default: useRemovedTraits } = await import('./useRemovedTraits')
    contractReader.mockReturnValueOnce([3, 7])
    const readContracts = {} as Parameters<typeof useRemovedTraits>[0]
    const { result, rerender } = renderHook(() => useRemovedTraits(readContracts))

    expect(result.current).toEqual([3, 7])
    contractReader.mockReturnValueOnce(undefined)
    rerender()
    expect(result.current).toEqual([])
  })
})
