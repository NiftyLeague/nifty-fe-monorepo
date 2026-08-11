'use client'

import { usePathname } from 'next/navigation'
import type { PropsWithChildren } from 'react'

import {
  AUDIT_FIXTURE_ADDRESS,
  AUDIT_FIXTURE_CHARACTERS,
  AUDIT_FIXTURE_TOKEN,
} from '@/audit/fixture'
import AuthTokenContext from '@/contexts/AuthTokenContext'
import DegenOwnershipContext from '@/contexts/DegenOwnershipContext'
import NetworkContext from '@/contexts/NetworkContext'
import type { Contracts } from '@/types/web3'

/** Audit fixture boundary for the mint route's auth, network, and ownership needs. */
export default function AuditFixtureMintContextWrapper({
  children,
}: PropsWithChildren): React.ReactNode {
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
        <DegenOwnershipContext.Provider
          value={{
            degenCount: AUDIT_FIXTURE_CHARACTERS.length,
            degensBalances: AUDIT_FIXTURE_CHARACTERS,
            degenTokenIndices: AUDIT_FIXTURE_CHARACTERS.map((degen) => Number(degen.tokenId)),
            isDegenOwner: true,
            loadingDegens: false,
            refreshDegenBalances: () => {},
          }}
        >
          {children}
        </DegenOwnershipContext.Provider>
      </NetworkContext.Provider>
    </AuthTokenContext.Provider>
  )
}
