import { writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { formatEther, parseEther, type Hash } from 'viem'
import { handleError } from '@/utils/transactions'
import type { NotifyError } from '@/types/notify'
import useIMXContext from '@/hooks/useIMXContext'
import { useConnectedToIMXCheck } from '@/hooks/useImxProvider'
import { BALANCE_MANAGER_CONTRACT, getContractABI, getContractAddress } from '@/constants/contracts'
import { DEBUG } from '@/constants'
import { useWagmiConfig } from '@/runtime/wagmi'
import useUserClaimData from './useUserClaimData'

export default function useClaimCallback(): {
  claimCallback: () => Promise<Hash | null>
} {
  const imx = useIMXContext()
  const config = useWagmiConfig()
  const isConnectedToIMX = useConnectedToIMXCheck()
  // get claim data for this account
  const userClaimData = useUserClaimData()

  const claimCallback = async (): Promise<Hash | null> => {
    const claimData = userClaimData.claimData
    const address = imx.address
    try {
      if (!claimData || !address || !imx.imxChainId || !isConnectedToIMX()) return null

      const distributorAddress = getContractAddress(
        imx.imxChainId,
        BALANCE_MANAGER_CONTRACT
      ) as `0x${string}`
      const nftlAmount = parseEther(formatEther(BigInt(claimData.amount))) // Convert hex string to bigint
      if (DEBUG)
        console.log('Withdrawing NFTL', [claimData.index, address, nftlAmount, claimData.proof])

      const txHash = await writeContract(config, {
        address: distributorAddress,
        abi: getContractABI(imx.imxChainId, BALANCE_MANAGER_CONTRACT),
        functionName: 'claim',
        args: [BigInt(claimData.index), address, nftlAmount, claimData.proof],
        chainId: imx.imxChainId,
      })
      await waitForTransactionReceipt(config, { hash: txHash, confirmations: 1 })

      return txHash
    } catch (error) {
      handleError(error as NotifyError)
      return null
    }
  }

  return { claimCallback }
}
