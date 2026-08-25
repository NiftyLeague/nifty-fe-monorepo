'use client'

import type { PropsWithChildren, ReactNode } from 'react'

import { AuthStatusProvider } from '@/contexts/AuthStatusContext'
import { AuthTokenProvider } from '@/contexts/AuthTokenContext'
import WalletStorageProviders from '@/contexts/WalletStorageProviders'

type WalletAuthProvidersProps = PropsWithChildren<{
  cookies?: string | null
  loadingFallback?: ReactNode
  errorFallback?: (retry: () => void) => ReactNode
}>

export default function WalletAuthProviders({
  children,
  cookies,
  loadingFallback,
  errorFallback,
}: WalletAuthProvidersProps) {
  return (
    <WalletStorageProviders
      cookies={cookies}
      errorFallback={errorFallback}
      loadingFallback={loadingFallback}
    >
      <AuthStatusProvider>
        <AuthTokenProvider>{children}</AuthTokenProvider>
      </AuthStatusProvider>
    </WalletStorageProviders>
  )
}
