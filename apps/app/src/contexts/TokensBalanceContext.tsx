'use client'

import { createContext, createEffect, type JSX } from 'solid-js'

import useArcadeBalance from '@/hooks/balances/useArcadeBalance'
import useAuth from '@/hooks/useAuth'
import useClaimableNFTL from '@/hooks/balances/useClaimableNFTL'
import useNFTLBalance from '@/hooks/balances/useNFTLBalance'
import useNFTsBalances from '@/hooks/balances/useNFTsBalances'

interface TokensBalances {
  AT: number // Arcade Token
  NFTL: { eth: number; imx: number } // NFTL cross-chain
}

export interface TokensBalanceContextValue {
  readonly loadingArcadeBal: boolean
  readonly loadingNFTLAccrued: boolean
  readonly loadingNFTLBal: boolean
  refetchArcadeBal: () => void
  refreshClaimableNFTL: () => void
  refreshNFTLBalance: () => void
  readonly tokensBalances: TokensBalances
  readonly totalAccruedNFTL: number
}

const CONTEXT_INITIAL_STATE: TokensBalanceContextValue = {
  loadingArcadeBal: false,
  loadingNFTLAccrued: false,
  loadingNFTLBal: false,
  refetchArcadeBal: () => {},
  refreshClaimableNFTL: () => {},
  refreshNFTLBalance: () => {},
  tokensBalances: { AT: 0, NFTL: { eth: 0, imx: 0 } },
  totalAccruedNFTL: 0,
}

const TokensBalanceContext = createContext<TokensBalanceContextValue>(CONTEXT_INITIAL_STATE)

export const TokensBalanceProvider = (props: { children?: JSX.Element }): JSX.Element => {
  const nfts = useNFTsBalances()
  let firstRender = true
  const auth = useAuth()

  // Load user DEGEN's NFTL claimable balance
  const claimable = useClaimableNFTL(() => nfts.degenTokenIndices)
  // Load user Ethereum & Immutable zkEVM NFTL balances
  const nftl = useNFTLBalance()
  // Load user off-chain Arcade Token (AT) balance
  const arcade = useArcadeBalance()

  // Refetch on login state change, avoiding initial render
  createEffect(() => {
    const loggedIn = auth.isLoggedIn
    if (firstRender) {
      firstRender = false
      return
    }
    if (!loggedIn) return
    claimable.refetch()
    nftl.refetch()
    arcade.refetch()
  })

  const value: TokensBalanceContextValue = {
    get loadingArcadeBal() {
      return arcade.loading
    },
    get loadingNFTLAccrued() {
      return nfts.loadingDegens || claimable.loading
    },
    get loadingNFTLBal() {
      return nftl.loading
    },
    refetchArcadeBal: arcade.refetch,
    refreshClaimableNFTL: claimable.refetch,
    refreshNFTLBalance: nftl.refetch,
    get tokensBalances() {
      return { AT: arcade.balance, NFTL: nftl.balances }
    },
    get totalAccruedNFTL() {
      return claimable.balance
    },
  }

  return <TokensBalanceContext.Provider value={value}>{props.children}</TokensBalanceContext.Provider>
}

export default TokensBalanceContext
