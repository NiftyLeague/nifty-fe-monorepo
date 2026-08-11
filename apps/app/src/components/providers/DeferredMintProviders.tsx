'use client'

import { useEffect, useState, type ComponentType, type PropsWithChildren } from 'react'

import { WalletProviderError, WalletProviderLoading } from './WalletProviderFallbacks'

type MintProvidersProps = PropsWithChildren<{ cookies?: string | null }>
type MintProviders = ComponentType<MintProvidersProps>

const loadMintProviders = () => import('./MintProviders')

export default function DeferredMintProviders({ children, cookies }: MintProvidersProps) {
  const [Providers, setProviders] = useState<MintProviders | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let active = true
    setProviders(null)
    setLoadError(false)

    loadMintProviders()
      .then(({ default: nextProviders }) => {
        if (active) setProviders(() => nextProviders)
      })
      .catch(() => {
        if (active) setLoadError(true)
      })

    return () => {
      active = false
    }
  }, [retryCount])

  if (loadError) {
    return <WalletProviderError onRetry={() => setRetryCount((count) => count + 1)} />
  }

  if (!Providers) return <WalletProviderLoading />

  return <Providers cookies={cookies}>{children}</Providers>
}
