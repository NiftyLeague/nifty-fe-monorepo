'use client'

import type { PropsWithChildren } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

type Web3ModalConfig = {
  wagmiAdapter: {
    wagmiConfig: Config
  }
}

export type Web3ModalRuntimeProps = PropsWithChildren<{
  config: Web3ModalConfig
  cookies?: string | null
}>

/**
 * Hydrates the wagmi connection from the request cookies. The
 * `QueryClientProvider` is supplied once by the router's SSR Query integration,
 * so this boundary only contributes the wagmi runtime.
 */
export default function Web3ModalRuntime({ children, config, cookies }: Web3ModalRuntimeProps) {
  const initialState = cookieToInitialState(config.wagmiAdapter.wagmiConfig, cookies)

  return (
    <WagmiProvider config={config.wagmiAdapter.wagmiConfig} initialState={initialState}>
      {children}
    </WagmiProvider>
  )
}
