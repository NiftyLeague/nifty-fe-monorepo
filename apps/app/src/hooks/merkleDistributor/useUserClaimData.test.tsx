import { QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, mock, spyOn } from 'bun:test'
import type { PropsWithChildren } from 'react'

import { createAppQueryClient, queryKeys } from '@/query/app-query'

const address = '0x0000000000000000000000000000000000000001'

mock.module('../useIMXContext', () => ({
  default: () => ({ address, imxChainId: 1 }),
}))
mock.module('wagmi', () => ({ useAccount: () => ({ address: undefined }) }))

const useUserClaimData = (await import('./useUserClaimData')).default

describe('Merkle claim query', () => {
  it('uses the shared query cache instead of module and component caches', async () => {
    const claim = { index: 7, amount: '100', proof: ['0xproof'] }
    const fetchMock = spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ claims: { [address]: claim } }), { status: 200 })
    )
    const client = createAppQueryClient()
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(
      () => ({ first: useUserClaimData(), second: useUserClaimData() }),
      { wrapper }
    )

    await waitFor(() => expect(result.current.first.claimData).toEqual(claim))
    expect(result.current.second.claimData).toEqual(claim)
    expect(client.getQueryData(queryKeys.merkleClaim(1, address))).toEqual(claim)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
