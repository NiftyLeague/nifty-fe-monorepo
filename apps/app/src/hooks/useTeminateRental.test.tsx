import { QueryClientProvider } from '@tanstack/solid-query'
import { act, renderHook } from '@nl/ui/test-utils'
import { describe, expect, it, mock, spyOn } from 'bun:test'

import { createAppQueryClient, getAuthQueryScope, queryKeys } from '@/query/app-query'
import type { JSX } from 'solid-js'

mock.module('./useAuth', () => ({ default: () => ({ authToken: 'test-token' }) }))

const useTeminateRental = (await import('./useTeminateRental')).default

describe('terminate rental mutation', () => {
  it('invalidates every rental list after success', async () => {
    spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: 'rental-1' }), { status: 200 })
    )
    const client = createAppQueryClient()
    const rentalsKey = queryKeys.rentals(getAuthQueryScope('test-token'), 'all')
    client.setQueryData(rentalsKey, [{ id: 'rental-1' }])
    const wrapper = ({ children }: { children?: JSX.Element }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )
    const { result } = renderHook(() => useTeminateRental(), { wrapper })

    await act(async () => {
      await result.current('rental-1')
    })

    expect(client.getQueryState(rentalsKey)?.isInvalidated).toBe(true)
  })
})

mock.module('./useAuth', () => ({ default: () => ({ authToken: 'test-token' }) }))
