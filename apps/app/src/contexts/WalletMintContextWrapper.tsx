'use server'

import type { PropsWithChildren } from 'react'
import { headers } from 'next/headers'

import AuditFixtureMintContextWrapper from '@/contexts/AuditFixtureMintContextWrapper'
import { AuthTokenProvider } from '@/contexts/AuthTokenContext'
import { DegenOwnershipProvider } from '@/contexts/DegenOwnershipContext'
import { LocalStorageProvider } from '@/contexts/LocalStorageContext'
import { Web3ModalProvider } from '@/contexts/Web3ModalContext'

/**
 * Wallet boundary for Mint-o-Matic.
 *
 * The mint route needs wallet authentication and DEGEN ownership before the
 * canvas is available. The network and contract provider is loaded by the
 * canvas boundary only after this gate succeeds.
 */
export default async function WalletMintContextWrapper({ children }: PropsWithChildren) {
  const cookies = (await headers()).get('cookie')
  const auditFixtureEnabled = process.env.NEXT_PUBLIC_AUDIT_FIXTURE === 'true'

  const walletContexts = auditFixtureEnabled ? (
    <AuditFixtureMintContextWrapper>{children}</AuditFixtureMintContextWrapper>
  ) : (
    <AuthTokenProvider>
      <DegenOwnershipProvider>{children}</DegenOwnershipProvider>
    </AuthTokenProvider>
  )

  return (
    <LocalStorageProvider>
      <Web3ModalProvider cookies={cookies}>{walletContexts}</Web3ModalProvider>
    </LocalStorageProvider>
  )
}
