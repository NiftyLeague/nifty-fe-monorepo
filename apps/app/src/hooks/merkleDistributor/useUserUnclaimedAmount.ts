import { createEffect } from 'solid-js'
import { formatEther } from 'ethers'
import { BALANCE_MANAGER_CONTRACT } from '@/constants/contracts'
import { DEBUG } from '@/constants/index'
import useIMXContext from '@/hooks/useIMXContext'
import useSingleCallResult from '@/hooks/useSingleCallResult'
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

  const isClaimedResult = useSingleCallResult(
    () => imx.imxContracts,
    BALANCE_MANAGER_CONTRACT,
    'isClaimed',
    () => [userClaimData()?.index],
    null,
    () => !userClaimData() || userClaimData()?.index === undefined
  )

  // user is in blob and contract marks as unclaimed
  return () => Boolean(userClaimData() && isClaimedResult() === false)
}

export type ClaimResult = { nftlUnclaimed: number; loading: boolean }

export default function useUserUnclaimedAmount(): ClaimResult {
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
