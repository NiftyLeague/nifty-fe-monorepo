'use client'

import { usePathname } from 'next/navigation'
import type { PropsWithChildren } from 'react'
import { immutableZkEvmTestnet } from 'viem/chains'

import {
  AUDIT_FIXTURE_ADDRESS,
  AUDIT_FIXTURE_CHARACTERS,
  AUDIT_FIXTURE_TOKEN,
} from '@/audit/fixture'
import { COMICS, ITEMS } from '@/constants/marketplace'
import AuthTokenContext from '@/contexts/AuthTokenContext'
import IMXContext from '@/contexts/IMXContext'
import NetworkContext from '@/contexts/NetworkContext'
import NFTsBalanceContext from '@/contexts/NFTsBalanceContext'
import TokensBalanceContext from '@/contexts/TokensBalanceContext'
import type { Contracts } from '@/types/web3'

const auditComics = COMICS.map((comic, index) => ({ ...comic, balance: index === 0 ? 1 : 0 }))
const auditItems = ITEMS.map((item, index) => ({ ...item, balance: index === 0 ? 1 : 0 }))

const AuditFixtureContextWrapper = ({ children }: PropsWithChildren): React.ReactNode => {
  const pathname = usePathname()
  const isProtectedSurface = pathname?.startsWith('/dashboard') ?? false

  return (
    <AuthTokenContext.Provider
      value={{
        authToken: isProtectedSurface ? AUDIT_FIXTURE_TOKEN : undefined,
        handleConnectWallet: async () => {},
        isConnected: false,
        isLoggedIn: isProtectedSurface,
      }}
    >
      <IMXContext.Provider
        value={{
          address: AUDIT_FIXTURE_ADDRESS,
          imxChainId: immutableZkEvmTestnet.id,
          imxContracts: {} as Contracts,
          imxSigner: undefined,
          passportProvider: undefined,
        }}
      >
        <NetworkContext.Provider
          value={{
            address: AUDIT_FIXTURE_ADDRESS,
            isConnected: false,
            publicProvider: undefined,
            readContracts: {} as Contracts,
            signer: undefined,
            tx: async () => null,
            writeContracts: {} as Contracts,
          }}
        >
          <NFTsBalanceContext.Provider
            value={{
              comicsBalances: auditComics,
              degenCount: AUDIT_FIXTURE_CHARACTERS.length,
              degensBalances: AUDIT_FIXTURE_CHARACTERS,
              degenTokenIndices: AUDIT_FIXTURE_CHARACTERS.map((degen) => Number(degen.tokenId)),
              isDegenOwner: true,
              itemsBalances: auditItems,
              loadingComics: false,
              loadingDegens: false,
              loadingItems: false,
              refreshComicsBalances: () => {},
              refreshDegenBalances: () => {},
              refreshItemsBalances: () => {},
            }}
          >
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
          </NFTsBalanceContext.Provider>
        </NetworkContext.Provider>
      </IMXContext.Provider>
    </AuthTokenContext.Provider>
  )
}

export default AuditFixtureContextWrapper
