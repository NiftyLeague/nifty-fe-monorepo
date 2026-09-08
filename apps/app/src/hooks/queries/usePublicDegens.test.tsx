import { QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, spyOn } from 'bun:test'
import type { PropsWithChildren } from 'react'

import { createAppQueryClient } from '@/query/app-query'
import { usePublicDegensByIds } from './usePublicDegens'

const originalFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = originalFetch
})

const createWrapper = () => {
  const client = createAppQueryClient()
  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

describe('public DEGEN queries', () => {
  it('deduplicates concurrent consumers with the same semantic key', async () => {
    const fetchMock = spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([{ id: '7' }]), { status: 200 })
    )
    const { result } = renderHook(
      () => ({
        first: usePublicDegensByIds(['7']),
        second: usePublicDegensByIds(['7']),
      }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.first.data).toEqual([{ id: '7' }]))
    expect(result.current.second.data).toEqual([{ id: '7' }])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('exposes loading, empty, and non-retried client error states', async () => {
    const emptyFetch = spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    )
    const empty = renderHook(() => usePublicDegensByIds(['9']), {
      wrapper: createWrapper(),
    })
    expect(empty.result.current.isPending).toBe(true)
    await waitFor(() => expect(empty.result.current.data).toEqual([]))
    expect(empty.result.current.isError).toBe(false)
    empty.unmount()
    emptyFetch.mockRestore()

    const failedFetch = spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('missing', { status: 404, statusText: 'Not Found' })
    )
    const failed = renderHook(() => usePublicDegensByIds(['10']), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(failed.result.current.isError).toBe(true))
    expect(failed.result.current.data).toBeUndefined()
    expect(failedFetch).toHaveBeenCalledTimes(1)
  })

  it('aborts an orphaned request when its last observer unmounts', async () => {
    let signal: AbortSignal | undefined
    spyOn(globalThis, 'fetch').mockImplementation((_input, init) => {
      signal = init?.signal ?? undefined
      return new Promise(() => undefined)
    })
    const { unmount } = renderHook(() => usePublicDegensByIds(['8']), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(signal).toBeDefined())
    expect(signal?.aborted).toBe(false)
    unmount()
    expect(signal?.aborted).toBe(true)
  })
})
