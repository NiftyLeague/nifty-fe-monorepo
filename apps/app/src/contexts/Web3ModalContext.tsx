'use client'

import {
  useEffect,
  useState,
  type ComponentType,
  type PropsWithChildren,
  type ReactNode,
} from 'react'

import {
  WalletProviderError,
  WalletProviderLoading,
} from '@/components/providers/WalletProviderFallbacks'

type Web3ModalProviderProps = {
  cookies?: string | null
  loadingFallback?: ReactNode
}
type Web3ModalRuntimeComponent = ComponentType<PropsWithChildren<Web3ModalProviderProps>>

const loadWeb3ModalRuntime = () => import('./Web3ModalRuntime')

export function Web3ModalProvider({
  children,
  cookies,
  loadingFallback,
}: PropsWithChildren<Web3ModalProviderProps>) {
  const [Runtime, setRuntime] = useState<Web3ModalRuntimeComponent | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let active = true
    setRuntime(null)
    setLoadError(false)

    loadWeb3ModalRuntime()
      .then(({ default: nextRuntime }) => {
        if (active) setRuntime(() => nextRuntime)
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

  if (!Runtime) {
    return loadingFallback ?? <WalletProviderLoading />
  }

  return <Runtime cookies={cookies}>{children}</Runtime>
}
