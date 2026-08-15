'use client'

import type { PropsWithChildren, ReactNode } from 'react'

import { LocalStorageProvider } from '@/contexts/LocalStorageContext'
import { Web3ModalProvider } from '@/contexts/Web3ModalContext'

type WalletStorageProvidersProps = PropsWithChildren<{
  cookies?: string | null
  loadingFallback?: ReactNode
}>

/** Shared storage and wallet-runtime shell for route-specific provider stacks. */
export default function WalletStorageProviders({
  children,
  cookies,
  loadingFallback,
}: WalletStorageProvidersProps) {
  return (
    <LocalStorageProvider>
      <Web3ModalProvider cookies={cookies} loadingFallback={loadingFallback}>
        {children}
      </Web3ModalProvider>
    </LocalStorageProvider>
  )
}
