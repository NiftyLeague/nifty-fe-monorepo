'use client'

import type { ComponentType, PropsWithChildren } from 'react'

import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'

import { WalletProviderError, WalletProviderLoading } from './WalletProviderFallbacks'

type MintProvidersProps = PropsWithChildren<{ cookies?: string | null }>
type MintProviders = ComponentType<MintProvidersProps>

const loadMintProviders = () => import('./MintProviders')

export default function DeferredMintProviders({ children, cookies }: MintProvidersProps) {
  const {
    Component: Providers,
    hasError: loadError,
    retry,
  } = useDeferredComponent<MintProvidersProps>(loadMintProviders)

  if (loadError) {
    return <WalletProviderError onRetry={retry} />
  }

  if (!Providers) return <WalletProviderLoading />

  return <Providers cookies={cookies}>{children}</Providers>
}
