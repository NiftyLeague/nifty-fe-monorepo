'use client'

import { Show, type JSX, type ParentProps } from 'solid-js'

import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import RouteLoading from '@nl/ui/custom/route-loading'

import { WalletProviderError } from '@/components/providers/WalletProviderFallbacks'

type WalletAuthProvidersProps = ParentProps<{ cookies?: string | null }>

type WalletAuthProvidersBoundaryProps = WalletAuthProvidersProps & {
  enabled?: boolean
  loadingFallback?: JSX.Element
  errorFallback?: (retry: () => void) => JSX.Element
}

const loadWalletAuthProviders = () => import('./WalletAuthProviders')

export default function WalletAuthProvidersBoundary(props: WalletAuthProvidersBoundaryProps) {
  const {
    Component: WalletAuthProviders,
    hasError,
    retry,
  } = useDeferredComponent(loadWalletAuthProviders, () => props.enabled ?? true)

  const fallback = () =>
    props.loadingFallback ?? <RouteLoading label="Loading wallet verification" />

  return (
    <Show
      when={(props.enabled ?? true) && !hasError() && WalletAuthProviders()}
      keyed
      fallback={
        hasError()
          ? (props.errorFallback?.(retry) ?? <WalletProviderError onRetry={retry} />)
          : fallback()
      }
    >
      {(Providers) => (
        <Providers
          cookies={props.cookies}
          errorFallback={props.errorFallback}
          loadingFallback={props.loadingFallback}
        >
          {props.children}
        </Providers>
      )}
    </Show>
  )
}
