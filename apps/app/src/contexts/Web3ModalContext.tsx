'use client'

import type { PropsWithChildren, ReactNode } from 'react'

import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import type { Web3ModalRuntimeProps as LoadedWeb3ModalRuntimeProps } from './Web3ModalRuntime'

import {
  WalletProviderError,
  WalletProviderLoading,
} from '@/components/providers/WalletProviderFallbacks'

type Web3ModalProviderProps = {
  cookies?: string | null
  loadingFallback?: ReactNode
  errorFallback?: (retry: () => void) => ReactNode
}
type Web3ModalRuntimeProps = Omit<LoadedWeb3ModalRuntimeProps, 'config'>

const loadWeb3ModalRuntime = async () => {
  const [{ default: Runtime }, config] = await Promise.all([
    import('./Web3ModalRuntime'),
    import('./Web3ModalConfig'),
  ])

  return {
    default: (props: Web3ModalRuntimeProps) => <Runtime {...props} config={config} />,
  }
}

export function Web3ModalProvider({
  children,
  cookies,
  loadingFallback,
  errorFallback,
}: PropsWithChildren<Web3ModalProviderProps>) {
  const {
    Component: Runtime,
    hasError: loadError,
    retry,
  } = useDeferredComponent<Web3ModalRuntimeProps>(loadWeb3ModalRuntime)

  if (loadError) {
    return errorFallback ? errorFallback(retry) : <WalletProviderError onRetry={retry} />
  }

  if (!Runtime) {
    return loadingFallback ?? <WalletProviderLoading />
  }

  return <Runtime cookies={cookies}>{children}</Runtime>
}
