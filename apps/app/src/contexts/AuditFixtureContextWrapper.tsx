'use client'

import type { ParentProps } from 'solid-js'

import AuditFixtureWalletContextWrapper from '@/contexts/AuditFixtureWalletContextWrapper'
import TokensBalanceContext from '@/contexts/TokensBalanceContext'

const AuditFixtureContextWrapper = (props: ParentProps): JSX.Element => {
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
        {props.children}
      </TokensBalanceContext.Provider>
    </AuditFixtureWalletContextWrapper>
  )
}

export default AuditFixtureContextWrapper
