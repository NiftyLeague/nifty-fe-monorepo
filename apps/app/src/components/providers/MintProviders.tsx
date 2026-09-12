'use client'

import type { PropsWithChildren } from 'react'

import AuditFixtureMintContextWrapper from '@/contexts/AuditFixtureMintContextWrapper'
import { AuthStatusProvider } from '@/contexts/AuthStatusContext'
import { AuthTokenProvider } from '@/contexts/AuthTokenContext'
import { DegenOwnershipProvider } from '@/contexts/DegenOwnershipContext'
import WalletStorageProviders from '@/contexts/WalletStorageProviders'
import { AUDIT_FIXTURE } from '@/runtime/env'

type MintProvidersProps = PropsWithChildren<{ cookies?: string | null }>

export default function MintProviders({ children, cookies }: MintProvidersProps) {
  const auditFixtureEnabled = AUDIT_FIXTURE

  const walletContexts = auditFixtureEnabled ? (
    <AuditFixtureMintContextWrapper>{children}</AuditFixtureMintContextWrapper>
  ) : (
    <AuthStatusProvider>
      <AuthTokenProvider>
        <DegenOwnershipProvider>{children}</DegenOwnershipProvider>
      </AuthTokenProvider>
    </AuthStatusProvider>
  )

  return <WalletStorageProviders cookies={cookies}>{walletContexts}</WalletStorageProviders>
}
