'use client'

import { Show, type Component, type JSX } from 'solid-js'

import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import type { Web3ModalRuntimeProps as LoadedWeb3ModalRuntimeProps } from './Web3ModalRuntime'
import {
  WalletProviderError,
  WalletProviderLoading,
} from '@/components/providers/WalletProviderFallbacks'

type Web3ModalProviderProps = {
  children?: JSX.Element
  cookies?: string | null
  loadingFallback?: JSX.Element
  errorFallback?: (retry: () => void) => JSX.Element
}
type Web3ModalRuntimeProps = Omit<LoadedWeb3ModalRuntimeProps, 'config'>

const loadWeb3ModalRuntime = async () => {
  const [{ default: Runtime }, config] = await Promise.all([
    import('./Web3ModalRuntime'),
    import('./Web3ModalConfig'),
  ])

  return {
    default: ((props: Web3ModalRuntimeProps) => (
      <Runtime {...props} config={config} />
    )) as Component<Web3ModalRuntimeProps>,
  }
}

export function Web3ModalProvider(props: Web3ModalProviderProps) {
  const {
    Component: Runtime,
    hasError: loadError,
    retry,
  } = useDeferredComponent<Web3ModalRuntimeProps>(loadWeb3ModalRuntime)

  return (
    <Show
      when={Runtime()}
      keyed
      fallback={
        loadError() ? (
          (props.errorFallback?.(retry) ?? <WalletProviderError onRetry={retry} />)
        ) : (
          (props.loadingFallback ?? <WalletProviderLoading />)
        )
      }
    >
      {(Loaded) => <Loaded cookies={props.cookies}>{props.children}</Loaded>}
    </Show>
  )
}
