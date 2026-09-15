'use client'

import { createSignal } from 'solid-js'
import type { TransactionResponse } from 'ethers'
import type { MetamaskError } from '@/types/notify'
import { handleError } from '@/utils/bnc-notify'

import { NFTL_CONTRACT } from '@/constants/contracts'
import { DEBUG } from '@/constants/index'
import useNetworkContext from '@/hooks/useNetworkContext'
import useNFTsBalances from '@/hooks/balances/useNFTsBalances'
import useTokensBalances from '@/hooks/balances/useTokensBalances'

export default function useClaimNFTL(): {
  readonly balance: number
  claimCallback: () => Promise<TransactionResponse | null>
  readonly loading: boolean
} {
  const network = useNetworkContext()
  const nfts = useNFTsBalances()
  const tokens = useTokensBalances()

  const [mockAccrued, setMockAccrued] = createSignal<number | null>(null)
  const [loading, setLoading] = createSignal(false)

  const balance = () => mockAccrued() ?? tokens.totalAccruedNFTL

  const verifyDegensWithClaimableNFTL = async () => {
    const nftl = network.writeContracts[NFTL_CONTRACT]
    const degensWithClaimableNFTL = await Promise.all(
      nfts.degenTokenIndices.map(async (degen) => {
        const claimable = await nftl.accumulated(degen)
        return claimable > 0n ? degen : null
      })
    )
    return degensWithClaimableNFTL.filter(Boolean)
  }

  const handleClaimNFTL = async () => {
    const degensWithClaimableNFTL = await verifyDegensWithClaimableNFTL()
    if (DEBUG) console.log('claim', degensWithClaimableNFTL, tokens.totalAccruedNFTL)
    const nftl = network.writeContracts[NFTL_CONTRACT]
    const txRes = await network.tx(nftl.claim(nfts.degenTokenIndices))
    if (txRes) {
      setMockAccrued(0)
      setTimeout(tokens.refreshClaimableNFTL, 5000)
    }
    return txRes
  }

  const claimCallback = async () => {
    setLoading(true)
    try {
      const res = await handleClaimNFTL()
      setLoading(false)
      return res
    } catch (error) {
      handleError(error as MetamaskError)
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
