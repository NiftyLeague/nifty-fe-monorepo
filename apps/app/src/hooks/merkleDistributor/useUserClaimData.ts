import { useQuery } from '@tanstack/solid-query'
import { useAccount } from '@/runtime/wagmi'
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
export default function useUserClaimData(): {
  readonly claimData: UserClaimData | null
  readonly loading: boolean
} {
  const imx = useIMXContext()
  const wagmiAccount = useAccount()
  const account = () => imx.address ?? wagmiAccount.address

  const enabled = () => Boolean(account() && isAddress(account() as string) && imx.imxChainId)
  const query = useQuery(() => ({
    queryKey: queryKeys.merkleClaim(imx.imxChainId as ChainId, account()?.toLowerCase() ?? ''),
    queryFn: ({ signal }) => fetchClaim(account() as string, signal),
    enabled: enabled(),
  }))

  return {
    get claimData() {
      return query.data ?? null
    },
    get loading() {
      return enabled() && query.isPending
    },
  }
}
