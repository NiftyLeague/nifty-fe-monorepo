import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, mock, spyOn } from 'bun:test'
import { QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'

import { createAppQueryClient } from '@/query/app-query'
import useVersion from './useVersion'

const userAgentDescriptor = Object.getOwnPropertyDescriptor(window.navigator, 'userAgent')

const createWrapper = () => {
  const client = createAppQueryClient()
  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

afterEach(() => {
  mock.restore()
  if (userAgentDescriptor) {
    Object.defineProperty(window.navigator, 'userAgent', userAgentDescriptor)
  }
})

describe('useVersion', () => {
  it('hydrates with a stable label before resolving the browser platform', async () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    })
    const fetchMock = spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('1.2.3-release', { status: 200 })
    )

    const { result } = renderHook(() => useVersion(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.message).toBe('Download for Windows'))
    await waitFor(() => expect(result.current.version).toBe('1.2.3-release'))
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(result.current.downloadURL).toContain('/win/1.2.3-release/')
  })

  it('does not fetch an installer version for unsupported macOS downloads', async () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      get: () => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    })
    const fetchMock = spyOn(globalThis, 'fetch')

    const { result } = renderHook(() => useVersion(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.message).toBe('Download for Mac OS not available'))
    expect(fetchMock).not.toHaveBeenCalled()
    expect(result.current.version).toBe('')
  })

  it('does not fetch an installer version for unsupported Linux downloads', async () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      get: () => 'Mozilla/5.0 (X11; Linux x86_64)',
    })
    const fetchMock = spyOn(globalThis, 'fetch')

    const { result } = renderHook(() => useVersion(), { wrapper: createWrapper() })

    await waitFor(() =>
      expect(result.current.message).toBe('Linux support is not available at this time')
    )
    expect(fetchMock).not.toHaveBeenCalled()
    expect(result.current.version).toBe('')
  })

  it('deduplicates the Windows version request across consumers', async () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    })
    const fetchMock = spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('1.2.3-release', { status: 200 })
    )

    const { result } = renderHook(() => ({ first: useVersion(), second: useVersion() }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.first.version).toBe('1.2.3-release'))
    expect(result.current.second.version).toBe('1.2.3-release')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
