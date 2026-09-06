'use server'

import type { PropsWithChildren } from 'react'
import { headers } from 'next/headers'

import AuditFixtureMintContextWrapper from '@/contexts/AuditFixtureMintContextWrapper'
import { AuthTokenProvider } from '@/contexts/AuthTokenContext'
import { DegenOwnershipProvider } from '@/contexts/DegenOwnershipContext'
import { NetworkProvider } from '@/contexts/NetworkContext'
import { Web3ModalProvider } from '@/contexts/Web3ModalContext'

/**
 * Wallet boundary for Mint-o-Matic.
 *
 * The mint route needs wallet authentication, network access, and DEGEN
 * ownership. Keeping marketplace, Immutable, and token-balance providers out
 * of this boundary avoids loading dashboard clients on the public mint surface.
 */
export default async function WalletMintContextWrapper({ children }: PropsWithChildren) {
  const cookies = (await headers()).get('cookie')
  const auditFixtureEnabled = process.env.NEXT_PUBLIC_AUDIT_FIXTURE === 'true'

  const walletContexts = auditFixtureEnabled ? (
    <AuditFixtureMintContextWrapper>{children}</AuditFixtureMintContextWrapper>
  ) : (
    <NetworkProvider>
      <AuthTokenProvider>
        <DegenOwnershipProvider>{children}</DegenOwnershipProvider>
      </AuthTokenProvider>
    </NetworkProvider>
  )

  return <Web3ModalProvider cookies={cookies}>{walletContexts}</Web3ModalProvider>
}
