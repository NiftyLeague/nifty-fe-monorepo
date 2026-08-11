'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

import type { PropsWithChildren } from 'react'
import { Button } from '@nl/ui/base/button'
import { Skeleton } from '@nl/ui/base/skeleton'

const queryClient = new QueryClient()

type Web3ModalProviderProps = { cookies?: string | null }
type Web3ModalConfigModule = typeof import('./Web3ModalConfig')

function WalletProviderLoading(): ReactNode {
  return (
    <div
      className="flex min-h-screen flex-col gap-6 bg-background p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Skeleton className="h-14 w-full rounded-lg" />
      <div className="flex min-h-0 flex-1 gap-6">
        <Skeleton className="hidden w-64 rounded-lg lg:block" />
        <Skeleton className="min-h-[24rem] flex-1 rounded-lg" />
      </div>
      <span className="sr-only">Loading wallet provider</span>
    </div>
  )
}

function WalletProviderError({ onRetry }: { onRetry: () => void }): ReactNode {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background p-6 text-center"
      role="alert"
    >
      <p>Wallet provider could not be loaded.</p>
      <Button type="button" variant="outline" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}

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
