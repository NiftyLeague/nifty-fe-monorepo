import { formatEther, parseEther, type TransactionResponse } from 'ethers'
import { handleError } from '@/utils/transactions'
import type { NotifyError } from '@/types/notify'
import useIMXContext from '@/hooks/useIMXContext'
import { useConnectedToIMXCheck } from '@/hooks/useImxProvider'
import { BALANCE_MANAGER_CONTRACT } from '@/constants/contracts'
import { DEBUG } from '@/constants'
import useUserClaimData from './useUserClaimData'

export default function useClaimCallback(): {
  claimCallback: () => Promise<TransactionResponse | null>
} {
  const imx = useIMXContext()
  const isConnectedToIMX = useConnectedToIMXCheck()
  // get claim data for this account
  const userClaimData = useUserClaimData()

  const claimCallback = async () => {
    const claimData = userClaimData.claimData
    const imxSigner = imx.imxSigner
    const distributorContract = imx.imxContracts?.[BALANCE_MANAGER_CONTRACT]
    try {
      if (!claimData || !imxSigner?.address || !distributorContract || !isConnectedToIMX())
        return null

      const contractWithSigner = distributorContract.connect(imxSigner)

      const nftlAmount = parseEther(formatEther(claimData.amount)) // Convert hex string to bigint
      if (DEBUG)
        console.log('Withdrawing NFTL', [
          claimData.index,
          imxSigner.address,
          nftlAmount,
          claimData.proof,
        ])
      const txRes = await contractWithSigner.claim(
        claimData.index,
        imxSigner.address,
        nftlAmount,
        claimData.proof
      )

      return txRes ? txRes : null
    } catch (error) {
      handleError(error as NotifyError)
      return null
    }
  }

  return { claimCallback }
}
