'use client'

import type { PropsWithChildren, ReactNode } from 'react'

import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'

import {
  WalletProviderError,
  WalletProviderLoading,
} from '@/components/providers/WalletProviderFallbacks'

type Web3ModalProviderProps = {
  cookies?: string | null
  loadingFallback?: ReactNode
}
type Web3ModalRuntimeProps = PropsWithChildren<{ cookies?: string | null }>

const loadWeb3ModalRuntime = () => import('./Web3ModalRuntime')

export function Web3ModalProvider({
  children,
  cookies,
  loadingFallback,
}: PropsWithChildren<Web3ModalProviderProps>) {
  const {
    Component: Runtime,
    hasError: loadError,
    retry,
  } = useDeferredComponent<Web3ModalRuntimeProps>(loadWeb3ModalRuntime)

  if (loadError) {
    return <WalletProviderError onRetry={retry} />
  }

  if (!Runtime) {
    return loadingFallback ?? <WalletProviderLoading />
  }

  return <Runtime cookies={cookies}>{children}</Runtime>
}
