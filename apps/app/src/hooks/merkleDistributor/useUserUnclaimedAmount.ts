import { createEffect } from 'solid-js'
import { formatEther } from 'ethers'
import { BALANCE_MANAGER_CONTRACT } from '@/constants/contracts'
import { DEBUG } from '@/constants/index'
import useIMXContext from '@/hooks/useIMXContext'
import { useReadContract } from '@/runtime/wagmi'
import { getContractABI, getContractAddress } from '@/constants/contracts'
import { IMX_ID } from '@/constants/networks'
import useUserClaimData from './useUserClaimData'

interface UserClaimData {
  index: number
  amount: string
  proof: string[]
}

// Check if user is in the blob and has not yet claimed NFTL
function useUserHasAvailableClaim(
  userClaimData: () => UserClaimData | null | undefined
): () => boolean {
  const imx = useIMXContext()

  // `isClaimed` is a public view call: it reads through the shared query
  // cache on the IMX chain RPC and does not need the user's Passport provider.
  const isClaimedQuery = useReadContract(() => {
    // Fall back to the production IMX chain for option construction only —
    // the query stays disabled until the real chain id and claim index exist.
    const chainId = imx.imxChainId ?? IMX_ID
    const index = userClaimData()?.index
    return {
      address: getContractAddress(chainId, BALANCE_MANAGER_CONTRACT) as `0x${string}`,
      abi: getContractABI(chainId, BALANCE_MANAGER_CONTRACT),
      functionName: 'isClaimed',
      args: [BigInt(index ?? 0)],
      chainId,
      query: {
        enabled: imx.imxChainId !== undefined && index !== undefined,
        staleTime: 30_000,
      },
    }
  })

  // user is in blob and contract marks as unclaimed
  return () => Boolean(userClaimData() && isClaimedQuery.data === false)
}

// Check if user is in the blob and has not yet claimed NFTL
function useUserUnclaimedAmount() {
  const userClaimData = useUserClaimData()

  const canClaim = useUserHasAvailableClaim(() => userClaimData.claimData)

  createEffect(() => {
    if (DEBUG && !userClaimData.loading)
      console.log('claimStats:', { claimData: userClaimData.claimData, canClaim: canClaim() })
  })

  return {
    get nftlUnclaimed() {
      // Return 0 if the user already claimed or there is no claim data
      if (!canClaim() || !userClaimData.claimData) return 0
      // Convert the claim amount from wei to Ether and ensure accurate number precision
      return Number(formatEther(userClaimData.claimData.amount))
    },
    get loading() {
      return userClaimData.loading
    },
  }
}

export default useUserUnclaimedAmount
