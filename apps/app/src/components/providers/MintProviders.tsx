'use client'

import type { PropsWithChildren } from 'react'

import AuditFixtureMintContextWrapper from '@/contexts/AuditFixtureMintContextWrapper'
import { AuthStatusProvider } from '@/contexts/AuthStatusContext'
import { AuthTokenProvider } from '@/contexts/AuthTokenContext'
import { DegenOwnershipProvider } from '@/contexts/DegenOwnershipContext'
import { LocalStorageProvider } from '@/contexts/LocalStorageContext'
import { Web3ModalProvider } from '@/contexts/Web3ModalContext'

type MintProvidersProps = PropsWithChildren<{ cookies?: string | null }>

export default function MintProviders({ children, cookies }: MintProvidersProps) {
  const auditFixtureEnabled = process.env.NEXT_PUBLIC_AUDIT_FIXTURE === 'true'

  const walletContexts = auditFixtureEnabled ? (
    <AuditFixtureMintContextWrapper>{children}</AuditFixtureMintContextWrapper>
  ) : (
    <AuthStatusProvider>
      <AuthTokenProvider>
        <DegenOwnershipProvider>{children}</DegenOwnershipProvider>
      </AuthTokenProvider>
    </AuthStatusProvider>
  )

  return (
    <LocalStorageProvider>
      <Web3ModalProvider cookies={cookies}>{walletContexts}</Web3ModalProvider>
    </LocalStorageProvider>
  )
}
