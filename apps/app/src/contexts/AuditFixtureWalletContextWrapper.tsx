import { usePathname } from '@/runtime/navigation'
import type { ParentProps } from 'solid-js'
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
import type { Contracts } from '@/types/web3'
import type { JSX } from 'solid-js'

const auditComics = COMICS.map((comic, index) => ({ ...comic, balance: index === 0 ? 1 : 0 }))
const auditItems = ITEMS.map((item, index) => ({ ...item, balance: index === 0 ? 1 : 0 }))

export default function AuditFixtureWalletContextWrapper(props: ParentProps): JSX.Element {
  const pathname = usePathname()
  const isProtectedSurface = () => pathname()?.startsWith('/dashboard') ?? false

  return (
    <AuthTokenContext.Provider
      value={{
        get authToken() {
          return isProtectedSurface() ? AUDIT_FIXTURE_TOKEN : undefined
        },
        handleConnectWallet: async () => {},
        isConnected: false,
        get isLoggedIn() {
          return isProtectedSurface()
        },
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
            write: async () => null,
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
            {props.children}
          </NFTsBalanceContext.Provider>
        </NetworkContext.Provider>
      </IMXContext.Provider>
    </AuthTokenContext.Provider>
  )
}
