'use client'

import type { PropsWithChildren } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

import { createAppQueryClient } from '@/query/app-query'

type Web3ModalConfig = {
  wagmiAdapter: {
    wagmiConfig: Config
  }
}

export type Web3ModalRuntimeProps = PropsWithChildren<{
  config: Web3ModalConfig
  cookies?: string | null
}>

export default function Web3ModalRuntime({ children, config, cookies }: Web3ModalRuntimeProps) {
  const [queryClient] = useState(createAppQueryClient)
  const initialState = cookieToInitialState(config.wagmiAdapter.wagmiConfig, cookies)

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config.wagmiAdapter.wagmiConfig} initialState={initialState}>
        {children}
      </WagmiProvider>
    </QueryClientProvider>
  )
}
