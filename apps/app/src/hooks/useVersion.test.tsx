import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, mock, spyOn } from 'bun:test'

import useVersion from './useVersion'

const userAgentDescriptor = Object.getOwnPropertyDescriptor(window.navigator, 'userAgent')

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

    const { result } = renderHook(() => useVersion())

    await waitFor(() => expect(result.current.message).toBe('Download for Windows'))
    await waitFor(() => expect(result.current.version).toBe('1.2.3-release'))
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(result.current.downloadURL).toContain('/win/1.2.3-release/')
  })
})
