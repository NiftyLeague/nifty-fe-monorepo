import { QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, mock, spyOn } from 'bun:test'
import type { PropsWithChildren } from 'react'

import { createAppQueryClient } from '@/query/app-query'

mock.module('./useAuth', () => ({ default: () => ({ authToken: 'test-token' }) }))

const useRentalPassCount = (await import('./useRentalPassCount')).default

describe('rental pass query', () => {
  it('deduplicates the authenticated inventory read across consumers', async () => {
    const fetchMock = spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ balance: 3 }), { status: 200 })
    )
    const client = createAppQueryClient()
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(
      () => ({ first: useRentalPassCount('7'), second: useRentalPassCount('8') }),
      { wrapper }
    )

    await waitFor(() => expect(result.current.first[2]).toBe(3))
    expect(result.current.second[2]).toBe(3)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
