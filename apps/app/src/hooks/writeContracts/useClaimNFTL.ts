import { createSignal, onCleanup } from 'solid-js'
import type { Hash } from 'viem'
import { readContract } from '@wagmi/core'
import { handleError } from '@/utils/transactions'
import type { NotifyError } from '@/types/notify'
import { getContractABI, getContractAddress } from '@/constants/contracts'
import { TARGET_NETWORK } from '@/constants/networks'
import { useWagmiConfig } from '@/runtime/wagmi'

import { NFTL_CONTRACT } from '@/constants/contracts'
import useNetworkContext from '@/hooks/useNetworkContext'
import useNFTsBalances from '@/hooks/balances/useNFTsBalances'
import useTokensBalances from '@/hooks/balances/useTokensBalances'

export default function useClaimNFTL(): {
  readonly balance: number
  claimCallback: () => Promise<Hash | null>
  readonly loading: boolean
} {
  const network = useNetworkContext()
  const nfts = useNFTsBalances()
  const tokens = useTokensBalances()

  const [mockAccrued, setMockAccrued] = createSignal<number | null>(null)
  const [loading, setLoading] = createSignal(false)
  let refetchTimer: ReturnType<typeof setTimeout> | undefined
  onCleanup(() => clearTimeout(refetchTimer))

  const balance = () => mockAccrued() ?? tokens.totalAccruedNFTL

  const verifyDegensWithClaimableNFTL = async () => {
    const config = useWagmiConfig()
    const address = getContractAddress(TARGET_NETWORK.chainId, NFTL_CONTRACT) as `0x${string}`
    const abi = getContractABI(TARGET_NETWORK.chainId, NFTL_CONTRACT)
    const degensWithClaimableNFTL = await Promise.all(
      nfts.degenTokenIndices.map(async (degen) => {
        const claimable = (await readContract(config, {
          address,
          abi,
          functionName: 'accumulated',
          args: [BigInt(degen)],
          chainId: TARGET_NETWORK.chainId,
        })) as bigint
        return claimable > 0n ? degen : null
      })
    )
    return degensWithClaimableNFTL.filter(Boolean)
  }

  const handleClaimNFTL = async () => {
    await verifyDegensWithClaimableNFTL()
    const txHash = await network.write({
      address: getContractAddress(TARGET_NETWORK.chainId, NFTL_CONTRACT) as `0x${string}`,
      abi: getContractABI(TARGET_NETWORK.chainId, NFTL_CONTRACT),
      functionName: 'claim',
      args: [nfts.degenTokenIndices],
    })
    if (txHash) {
      setMockAccrued(0)
      refetchTimer = setTimeout(tokens.refreshClaimableNFTL, 5000)
    }
    return txHash
  }

  const claimCallback = async () => {
    setLoading(true)
    try {
      const res = await handleClaimNFTL()
      setLoading(false)
      return res
    } catch (error) {
      handleError(error as NotifyError)
      setLoading(false)
      return null
    }
  }

  return {
    get balance() {
      return balance()
    },
    claimCallback,
    get loading() {
      return loading() || tokens.loadingNFTLAccrued
    },
  }
}
