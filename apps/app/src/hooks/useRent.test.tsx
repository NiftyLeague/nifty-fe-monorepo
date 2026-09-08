import { QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, mock, spyOn } from 'bun:test'
import type { PropsWithChildren } from 'react'

import { createAppQueryClient, getAuthQueryScope, queryKeys } from '@/query/app-query'

mock.module('./useAuth', () => ({ default: () => ({ authToken: 'test-token' }) }))

const useRent = (await import('./useRent')).default

describe('rent mutation', () => {
  it('invalidates rental inventory and affected catalogue state after success', async () => {
    spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: 'rental-1' }), { status: 200 })
    )
    const client = createAppQueryClient()
    const scope = getAuthQueryScope('test-token')
    const passKey = queryKeys.rentalPass(scope)
    const catalogueKey = queryKeys.publicDegens.byIds(['7'])
    client.setQueryData(passKey, { balance: 1 })
    client.setQueryData(catalogueKey, [{ id: '7' }])
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )
    const { result } = renderHook(() => useRent('7', 0, 100, '', true), { wrapper })

    await act(async () => {
      await result.current.rent()
    })

    expect(client.getQueryState(passKey)?.isInvalidated).toBe(true)
    expect(client.getQueryState(catalogueKey)?.isInvalidated).toBe(true)
  })
})
