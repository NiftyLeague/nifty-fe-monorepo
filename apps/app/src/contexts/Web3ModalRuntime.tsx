'use client'

import type { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

export type Web3ModalConfig = {
  wagmiAdapter: {
    wagmiConfig: Config
  }
}

export type Web3ModalRuntimeProps = PropsWithChildren<{
  config: Web3ModalConfig
  cookies?: string | null
}>

const queryClient = new QueryClient()

export default function Web3ModalRuntime({ children, config, cookies }: Web3ModalRuntimeProps) {
  const initialState = cookieToInitialState(config.wagmiAdapter.wagmiConfig, cookies)

  return (
    <WagmiProvider config={config.wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
