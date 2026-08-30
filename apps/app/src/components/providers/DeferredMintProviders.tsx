'use client'

import type { PropsWithChildren } from 'react'

import DeferredComponent from '@nl/ui/custom/deferred-component'

import { WalletProviderError, WalletProviderLoading } from './WalletProviderFallbacks'

type MintProvidersProps = PropsWithChildren<{ cookies?: string | null }>

const loadMintProviders = () => import('./MintProviders')

export default function DeferredMintProviders({ children, cookies }: MintProvidersProps) {
  return (
    <DeferredComponent
      label="Wallet provider"
      load={loadMintProviders}
      loadingFallback={<WalletProviderLoading />}
      errorFallback={(onRetry) => <WalletProviderError onRetry={onRetry} />}
      props={{ cookies, children }}
    />
  )
}
