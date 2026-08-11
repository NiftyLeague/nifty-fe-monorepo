'use client'

import type { PropsWithChildren } from 'react'

import AuditFixtureWalletContextWrapper from '@/contexts/AuditFixtureWalletContextWrapper'
import TokensBalanceContext from '@/contexts/TokensBalanceContext'

const AuditFixtureContextWrapper = ({ children }: PropsWithChildren): React.ReactNode => {
  return (
    <AuditFixtureWalletContextWrapper>
      <TokensBalanceContext.Provider
        value={{
          loadingArcadeBal: false,
          loadingNFTLAccrued: false,
          loadingNFTLBal: false,
          refetchArcadeBal: () => {},
          refreshClaimableNFTL: () => {},
          refreshNFTLBalance: () => {},
          tokensBalances: { AT: 24, NFTL: { eth: 1250, imx: 875 } },
          totalAccruedNFTL: 42,
        }}
      >
        {children}
      </TokensBalanceContext.Provider>
    </AuditFixtureWalletContextWrapper>
  )
}

export default AuditFixtureContextWrapper
