'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

import type { PropsWithChildren } from 'react'

import { wagmiAdapter } from './Web3ModalConfig'

const queryClient = new QueryClient()

type Web3ModalProviderProps = { cookies?: string | null }

export function Web3ModalProvider({
  children,
  cookies,
}: PropsWithChildren<Web3ModalProviderProps>) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
