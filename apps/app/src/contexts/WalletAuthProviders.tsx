'use client'

import type { PropsWithChildren } from 'react'

import { AuthStatusProvider } from '@/contexts/AuthStatusContext'
import { AuthTokenProvider } from '@/contexts/AuthTokenContext'
import { LocalStorageProvider } from '@/contexts/LocalStorageContext'
import { Web3ModalProvider } from '@/contexts/Web3ModalContext'

type WalletAuthProvidersProps = PropsWithChildren<{ cookies?: string | null }>

export default function WalletAuthProviders({ children, cookies }: WalletAuthProvidersProps) {
  return (
    <LocalStorageProvider>
      <Web3ModalProvider cookies={cookies}>
        <AuthStatusProvider>
          <AuthTokenProvider>{children}</AuthTokenProvider>
        </AuthStatusProvider>
      </Web3ModalProvider>
    </LocalStorageProvider>
  )
}
