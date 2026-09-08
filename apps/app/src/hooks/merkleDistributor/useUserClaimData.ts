'use client'

import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { mainnet, sepolia } from 'viem/chains'
import { getAddress, isAddress } from 'ethers'
import { MERKLE_TREE } from '@/constants/contracts'
import { fetchApiQuery, queryKeys } from '@/query/app-query'
import useIMXContext from '../useIMXContext'

interface UserClaimData {
  index: number
  amount: string
  proof: string[]
}

type ChainId = typeof mainnet.id | typeof sepolia.id

const fetchClaim = async (account: string, signal: AbortSignal): Promise<UserClaimData | null> => {
  const data = await fetchApiQuery<{ claims: Record<string, UserClaimData> }>(MERKLE_TREE, {
    signal,
  })
  return data.claims[getAddress(account)] ?? null
}

// parse distributorContract blob and detect if user has claim data
// null means we know it does not
export default function useUserClaimData(): { claimData: UserClaimData | null; loading: boolean } {
  const { address, imxChainId } = useIMXContext()
  const { address: wagmiAddress } = useAccount()
  const account = address ?? wagmiAddress

  const normalizedAccount = account?.toLowerCase() ?? ''
  const enabled = Boolean(account && isAddress(account) && imxChainId)
  const { data, isPending } = useQuery({
    queryKey: queryKeys.merkleClaim(imxChainId as ChainId, normalizedAccount),
    queryFn: ({ signal }) => fetchClaim(account as string, signal),
    enabled,
  })

  return {
    claimData: data ?? null,
    loading: enabled && isPending,
  }
}
