'use client'

import type { PropsWithChildren } from 'react'

import { AuthStatusProvider } from '@/contexts/AuthStatusContext'
import { AuthTokenProvider } from '@/contexts/AuthTokenContext'
import WalletStorageProviders from '@/contexts/WalletStorageProviders'

type WalletAuthProvidersProps = PropsWithChildren<{ cookies?: string | null }>

export default function WalletAuthProviders({ children, cookies }: WalletAuthProvidersProps) {
  return (
    <WalletStorageProviders cookies={cookies}>
      <AuthStatusProvider>
        <AuthTokenProvider>{children}</AuthTokenProvider>
      </AuthStatusProvider>
    </WalletStorageProviders>
  )
}
