'use client'

import type { PropsWithChildren, ReactNode } from 'react'

import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import RouteLoading from '@nl/ui/custom/route-loading'

import { WalletProviderError } from '@/components/providers/WalletProviderFallbacks'

type WalletAuthProvidersProps = PropsWithChildren<{ cookies?: string | null }>

type WalletAuthProvidersBoundaryProps = WalletAuthProvidersProps & {
  loadingFallback?: ReactNode
  errorFallback?: (retry: () => void) => ReactNode
}

const loadWalletAuthProviders = () => import('./WalletAuthProviders')

export default function WalletAuthProvidersBoundary({
  children,
  cookies,
  loadingFallback,
  errorFallback,
}: WalletAuthProvidersBoundaryProps) {
  const {
    Component: WalletAuthProviders,
    hasError,
    retry,
  } = useDeferredComponent(loadWalletAuthProviders)

  if (hasError) {
    return errorFallback ? errorFallback(retry) : <WalletProviderError onRetry={retry} />
  }

  if (!WalletAuthProviders) {
    return loadingFallback ?? <RouteLoading label="Loading wallet verification" />
  }

  return (
    <WalletAuthProviders
      cookies={cookies}
      errorFallback={errorFallback}
      loadingFallback={loadingFallback}
    >
      {children}
    </WalletAuthProviders>
  )
}
