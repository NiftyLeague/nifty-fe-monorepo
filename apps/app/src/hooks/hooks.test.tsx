import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

const contractReader = mock()

const interval = { clear: mock(async () => undefined), set: mock(() => 'interval-id') }

let useFetch: typeof import('./useFetch').default
let useLocalStorage: typeof import('./useLocalStorage').default

beforeEach(async () => {
  mock.module('./useContractReader', () => ({ default: contractReader }))
  mock.module('set-interval-async/dynamic', () => ({
    clearIntervalAsync: interval.clear,
    setIntervalAsync: interval.set,
  }))
  const useFetchModule = await import('./useFetch')
  const useLocalStorageModule = await import('./useLocalStorage')
  useFetch = useFetchModule.default
  useLocalStorage = useLocalStorageModule.default
})

afterEach(() => {
  mock.restore()
  interval.clear.mockClear()
  interval.set.mockClear()
})

describe('useFetch', () => {
  it('loads JSON, caches it, and supports text responses', async () => {
    const fetchMock = spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 7 }), { status: 200 })
    )
    const { result, rerender } = renderHook(
      ({ url, textOnly }) => useFetch(url, undefined, textOnly),
      {
        initialProps: { url: '/payload', textOnly: false },
      }
    )

    await waitFor(() => expect(result.current.data).toEqual({ id: 7 }))
    expect(result.current).toMatchObject({ loading: false })
    expect(fetchMock).toHaveBeenCalledWith(
      '/payload',
      expect.objectContaining({ headers: undefined, signal: expect.any(AbortSignal) })
    )

    rerender({ url: '/payload', textOnly: false })
    expect(fetchMock).toHaveBeenCalledTimes(1)

    fetchMock.mockResolvedValueOnce(new Response('plain text', { status: 200 }))
    rerender({ url: '/text', textOnly: true })
    await waitFor(() => expect(result.current.data).toBe('plain text'))

    rerender({ url: '/payload', textOnly: false })
    await waitFor(() => expect(result.current.data).toEqual({ id: 7 }))
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('resets when disabled and reports unsuccessful responses', async () => {
    const fetchMock = spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('missing', { status: 404, statusText: 'Not Found' })
    )
    const { result, rerender } = renderHook(({ enabled }) => useFetch('/missing', { enabled }), {
      initialProps: { enabled: true },
    })

    await waitFor(() => expect(result.current.error?.message).toBe('Not Found'))
    expect(fetchMock).toHaveBeenCalledTimes(1)

    rerender({ enabled: false })
    await waitFor(() =>
      expect(result.current).toMatchObject({ loading: false, error: undefined, data: undefined })
    )
  })

  it('shares in-flight and completed public catalog requests across hook instances', async () => {
    let resolveRequest: (response: Response) => void = () => undefined
    const fetchMock = spyOn(globalThis, 'fetch').mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve
      })
    )
    const options = { sharedCache: true }
    const first = renderHook(() => useFetch<{ id: number }>('/shared-catalog', options))
    const second = renderHook(() => useFetch<{ id: number }>('/shared-catalog', options))

    expect(fetchMock).toHaveBeenCalledTimes(1)

    resolveRequest(new Response(JSON.stringify({ id: 7 }), { status: 200 }))
    await waitFor(() => expect(first.result.current.data).toEqual({ id: 7 }))
    await waitFor(() => expect(second.result.current.data).toEqual({ id: 7 }))

    first.unmount()
    second.unmount()
    const cached = renderHook(() => useFetch<{ id: number }>('/shared-catalog', options))
    await waitFor(() => expect(cached.result.current.data).toEqual({ id: 7 }))
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('does not update an unmounted hook when its request resolves', async () => {
    let resolveRequest: (response: Response) => void = () => undefined
    spyOn(globalThis, 'fetch').mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve
      })
    )
    const { result, unmount } = renderHook(() => useFetch<{ id: number }>('/cancelled'))

    unmount()
    resolveRequest(new Response(JSON.stringify({ id: 8 }), { status: 200 }))
    await Promise.resolve()

    expect(result.current.data).toBeUndefined()
  })

  it('aborts an unshared request when its hook unmounts', () => {
    let requestSignal: AbortSignal | undefined
    spyOn(globalThis, 'fetch').mockImplementation((_input, init) => {
      requestSignal = (init as RequestInit | undefined)?.signal
      return new Promise(() => undefined)
    })

    const { unmount } = renderHook(() => useFetch('/cancelled-before-response'))

    expect(requestSignal?.aborted).toBe(false)
    unmount()

    expect(requestSignal?.aborted).toBe(true)
  })

  it('skips requests without a URL or when disabled', () => {
    const fetchMock = spyOn(globalThis, 'fetch')
    const { result } = renderHook(() => useFetch('/skip', { enabled: false }))

    expect(result.current).toMatchObject({
      data: undefined,
      error: undefined,
      loading: false,
      reset: undefined,
    })
    expect(fetchMock).not.toHaveBeenCalled()

    const noUrl = renderHook(() => useFetch())
    expect(noUrl.result.current.data).toBeUndefined()
    expect(fetchMock).not.toHaveBeenCalled()
  })
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
