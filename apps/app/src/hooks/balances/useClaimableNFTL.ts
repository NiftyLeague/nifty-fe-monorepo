'use client'

import { formatEther } from 'ethers'
import { useReadContract } from '@/runtime/wagmi'
import type { Abi } from 'viem'
import { TARGET_NETWORK } from '@/constants/networks'
import { getDeployedContract, NFTL_CONTRACT as NFTL_CONTRACT_NAME } from '@/constants/contracts'
import useAuth from '@/hooks/useAuth'
import { isAuditFixtureEnabled } from '@/audit/fixture'

/*
  ~ What it does? ~

  Gets unlclaimed NFTL balance for a provided list of DEGEN token indices

  ~ How can I use? ~

  const { balance, error, loading, refetch } = useClaimableNFTL([1, 2, 3, 4, 5]);
*/

const NFTL_CONTRACT = getDeployedContract(TARGET_NETWORK.chainId, NFTL_CONTRACT_NAME)

interface NFTLClaimableState {
  readonly balance: number
  readonly error: Error | null
  readonly loading: boolean
  refetch: () => void
}

export default function useClaimableNFTL(
  degenTokenIndices: number[] | (() => number[])
): NFTLClaimableState {
  const auth = useAuth()
  const indices = () =>
    typeof degenTokenIndices === 'function' ? degenTokenIndices() : degenTokenIndices

  const contract = useReadContract(() => ({
    address: NFTL_CONTRACT?.address as `0x${string}`,
    abi: NFTL_CONTRACT?.abi as Abi,
    chainId: TARGET_NETWORK.chainId,
    functionName: 'accumulatedMultiCheck',
    args: [indices()],
    query: {
      staleTime: 10_000,
      enabled: indices().length > 0 && auth.isLoggedIn && !isAuditFixtureEnabled,
    },
  }))

  return {
    get balance() {
      if (isAuditFixtureEnabled) return 12
      const data = contract.data as bigint | undefined
      return data === undefined ? 0 : parseFloat(formatEther(data))
    },
    get error() {
      return contract.error
    },
    get loading() {
      return contract.isLoading
    },
    refetch: () => void contract.refetch(),
  }
}
