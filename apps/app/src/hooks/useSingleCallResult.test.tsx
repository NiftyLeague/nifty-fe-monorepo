import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

import type { Contracts } from '@/types/web3'

import useSingleCallResult from './useSingleCallResult'

describe('useSingleCallResult', () => {
  it('does not repeat a contract read when the result updates', async () => {
    const isClaimed = mock(async () => ({ claimed: false }))
    const contracts = {
      BalanceManagerDistributor: { isClaimed },
    } as unknown as Contracts
    const args = [7]

    const { result } = renderHook(() =>
      useSingleCallResult(contracts, 'BalanceManagerDistributor', 'isClaimed', args, null, false)
    )

    await waitFor(() => expect(result.current).toEqual({ claimed: false }))
    expect(isClaimed).toHaveBeenCalledTimes(1)
  })
})
