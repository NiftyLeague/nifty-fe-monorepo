'use client'

import { onMount, type JSX } from 'solid-js'
import { cookieToInitialState, hydrate, type Config } from '@wagmi/core'

type Web3ModalConfig = {
  wagmiAdapter: {
    wagmiConfig: Config
  }
}

export type Web3ModalRuntimeProps = {
  children?: JSX.Element
  config: Web3ModalConfig
  cookies?: string | null
}

/**
 * Hydrates the wagmi connection from the request cookies. The
 * `QueryClientProvider` is supplied once by the router's SSR Query integration,
 * so this boundary only contributes the wagmi runtime.
 */
export default function Web3ModalRuntime(props: Web3ModalRuntimeProps) {
  onMount(() => {
    const initialState = cookieToInitialState(props.config.wagmiAdapter.wagmiConfig, props.cookies)
    hydrate(props.config.wagmiAdapter.wagmiConfig, { initialState, reconnectOnMount: true })
  })

  return <>{props.children}</>
}
