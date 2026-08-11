'use client'

import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

import type { PropsWithChildren } from 'react'
import {
  WalletProviderError,
  WalletProviderLoading,
} from '@/components/providers/WalletProviderFallbacks'

const queryClient = new QueryClient()

type Web3ModalProviderProps = { cookies?: string | null }
type Web3ModalConfigModule = typeof import('./Web3ModalConfig')

export function Web3ModalProvider({
  children,
  cookies,
}: PropsWithChildren<Web3ModalProviderProps>) {
  const [config, setConfig] = useState<Web3ModalConfigModule | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let active = true
    setConfig(null)
    setLoadError(false)

    import('./Web3ModalConfig')
      .then((nextConfig) => {
        if (active) setConfig(nextConfig)
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

  if (!config) {
    return <WalletProviderLoading />
  }

  const initialState = cookieToInitialState(config.wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={config.wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
