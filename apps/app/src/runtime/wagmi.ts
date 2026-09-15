import { createEffect, createMemo, createResource, createSignal, onCleanup } from 'solid-js'
import {
  disconnect as coreDisconnect,
  getAccount,
  getClient,
  getConnectorClient,
  getEnsAvatar,
  getEnsName,
  getWalletClient,
  readContract,
  signMessage as coreSignMessage,
  switchChain as coreSwitchChain,
  watchAccount,
  watchClient,
  type Config,
  type GetAccountReturnType,
  type GetConnectorClientParameters,
  type GetEnsAvatarParameters,
  type GetEnsNameParameters,
  type GetWalletClientParameters,
  type GetWalletClientReturnType,
  type ReadContractParameters,
  type SignMessageParameters,
  type SwitchChainParameters,
} from '@wagmi/core'
import type { Client } from 'viem'

/**
 * Solid bindings over @wagmi/core. The wagmi `Config` is owned by
 * `contexts/Web3ModalConfig`, which is loaded lazily (it throws without a
 * project id and keeps AppKit out of the initial bundle). That module calls
 * `registerWagmiConfig` on evaluation; every hook below requires a registered
 * config, which is guaranteed for components inside `Web3ModalProvider`.
 */

let wagmiConfig: Config | undefined

export function registerWagmiConfig(config: Config) {
  wagmiConfig = config
}

function requireConfig(): Config {
  if (!wagmiConfig) {
    throw new Error('wagmi config not registered — Web3ModalConfig has not loaded yet')
  }
  return wagmiConfig
}

export const getWagmiConfig = requireConfig
export const useWagmiConfig = requireConfig

type Source<T> = T | (() => T)
const resolve = <T>(value: Source<T>): T =>
  typeof value === 'function' ? (value as () => T)() : value

export interface UseAccountReturn {
  readonly address: GetAccountReturnType['address']
  readonly addresses: GetAccountReturnType['addresses']
  readonly chain: GetAccountReturnType['chain']
  readonly chainId: GetAccountReturnType['chainId']
  readonly connector: GetAccountReturnType['connector']
  readonly isConnected: boolean
  readonly isConnecting: boolean
  readonly isDisconnected: boolean
  readonly isReconnecting: boolean
  readonly status: GetAccountReturnType['status']
}

export function useAccount(): UseAccountReturn {
  const config = requireConfig()
  const [account, setAccount] = createSignal<GetAccountReturnType>(getAccount(config))
  onCleanup(
    watchAccount(config, {
      onChange: (next) => setAccount(() => next),
    })
  )
  return {
    get address() {
      return account().address
    },
    get addresses() {
      return account().addresses
    },
    get chain() {
      return account().chain
    },
    get chainId() {
      return account().chainId
    },
    get connector() {
      return account().connector
    },
    get isConnected() {
      return account().isConnected
    },
    get isConnecting() {
      return account().isConnecting
    },
    get isDisconnected() {
      return account().isDisconnected
    },
    get isReconnecting() {
      return account().isReconnecting
    },
    get status() {
      return account().status
    },
  }
}

interface QueryOptions {
  enabled?: boolean
  /** Accepted for parity with the wagmi API; resources have no shared cache. */
  staleTime?: number
  refetchInterval?: number
}

export type UseReadContractParameters = ReadContractParameters & { query?: QueryOptions }

export function useReadContract(params: Source<UseReadContractParameters>) {
  const config = requireConfig()
  const source = createMemo(() => {
    const { query, ...rest } = resolve(params)
    return query?.enabled === false ? null : rest
  })
  const [data, { refetch }] = createResource(source, (p) =>
    readContract(config, p as ReadContractParameters)
  )

  createEffect(() => {
    const interval = resolve(params).query?.refetchInterval
    if (!interval) return
    const id = setInterval(() => void refetch(), interval)
    onCleanup(() => clearInterval(id))
  })

  return {
    get data() {
      return data()
    },
    get error() {
      return (data.error as Error | undefined) ?? null
    },
    get isError() {
      return data.state === 'errored'
    },
    get isLoading() {
      return data.loading
    },
    get isSuccess() {
      return data.state === 'ready'
    },
    refetch,
  }
}

interface MutationState<TResult> {
  data: TResult | undefined
  error: Error | null
  isError: boolean
  isPending: boolean
  isSuccess: boolean
}

interface MutationCallbacks<TResult, TVariables> {
  onError?: (error: Error, variables: TVariables) => void
  onSuccess?: (data: TResult, variables: TVariables) => void
}

function createMutation<TResult, TVariables>(
  mutate: (variables: TVariables) => Promise<TResult>,
  callbacks?: MutationCallbacks<TResult, TVariables>
): MutationState<TResult> & {
  mutateAsync: (variables: TVariables) => Promise<TResult>
  mutate: (variables: TVariables) => void
} {
  const [data, setData] = createSignal<TResult>()
  const [error, setError] = createSignal<Error | null>(null)
  const [status, setStatus] = createSignal<'idle' | 'pending' | 'error' | 'success'>('idle')

  const mutateAsync = async (variables: TVariables) => {
    setStatus('pending')
    setError(null)
    try {
      const result = await mutate(variables)
      setData(() => result)
      setStatus('success')
      callbacks?.onSuccess?.(result, variables)
      return result
    } catch (cause) {
      const failure = cause instanceof Error ? cause : new Error(String(cause))
      setError(() => failure)
      setStatus('error')
      callbacks?.onError?.(failure, variables)
      throw failure
    }
  }

  return {
    get data() {
      return data()
    },
    get error() {
      return error()
    },
    get isError() {
      return status() === 'error'
    },
    get isPending() {
      return status() === 'pending'
    },
    get isSuccess() {
      return status() === 'success'
    },
    mutateAsync,
    mutate: (variables: TVariables) => {
      void mutateAsync(variables).catch(() => {})
    },
  }
}

export function useSwitchChain() {
  const config = requireConfig()
  const mutation = createMutation(
    (params: SwitchChainParameters) => coreSwitchChain(config, params),
    undefined
  )
  return {
    chains: config.chains,
    get error() {
      return mutation.error
    },
    get isPending() {
      return mutation.isPending
    },
    switchChain: mutation.mutate,
    switchChainAsync: mutation.mutateAsync,
  }
}

export function useDisconnect() {
  const config = requireConfig()
  const mutation = createMutation<void, { connector?: unknown } | undefined>(
    (params) => coreDisconnect(config, params as never)
  )
  return {
    get isPending() {
      return mutation.isPending
    },
    disconnect: mutation.mutate,
    disconnectAsync: mutation.mutateAsync,
  }
}

export function useSignMessage(options?: {
  mutation?: MutationCallbacks<`0x${string}`, SignMessageParameters>
}) {
  const config = requireConfig()
  const mutation = createMutation(
    (params: SignMessageParameters) => coreSignMessage(config, params),
    options?.mutation
  )
  return {
    get data() {
      return mutation.data
    },
    get error() {
      return mutation.error
    },
    get isError() {
      return mutation.isError
    },
    get isPending() {
      return mutation.isPending
    },
    get isSuccess() {
      return mutation.isSuccess
    },
    signMessage: mutation.mutate,
    signMessageAsync: mutation.mutateAsync,
  }
}

export function useConnectorClient(
  params?: Source<GetConnectorClientParameters | undefined>
) {
  const config = requireConfig()
  const account = useAccount()
  const source = createMemo(() => {
    if (account.status !== 'connected' || !account.connector) return null
    return { ...resolve(params), connector: account.connector } as GetConnectorClientParameters
  })
  const [data, { refetch }] = createResource(source, (p) => getConnectorClient(config, p))
  return {
    get data() {
      return data()
    },
    get error() {
      return (data.error as Error | undefined) ?? null
    },
    get isLoading() {
      return data.loading
    },
    refetch,
  }
}

export function useWalletClient(params?: Source<GetWalletClientParameters | undefined>): {
  readonly data: GetWalletClientReturnType | undefined
  readonly error: Error | null
  readonly isLoading: boolean
  refetch: () => void
} {
  const config = requireConfig()
  const account = useAccount()
  const source = createMemo(() => {
    if (!account.isConnected) return null
    return (resolve(params) ?? {}) as GetWalletClientParameters
  })
  const [data, { refetch }] = createResource(source, (p) => getWalletClient(config, p))
  return {
    get data() {
      return data()
    },
    get error() {
      return (data.error as Error | undefined) ?? null
    },
    get isLoading() {
      return data.loading
    },
    refetch,
  }
}

export function useClient(params?: { chainId?: number }) {
  const config = requireConfig()
  const [client, setClient] = createSignal<Client | undefined>(
    getClient(config, params) as Client | undefined
  )
  onCleanup(
    watchClient(config, {
      onChange: () => setClient(() => getClient(config, params) as Client | undefined),
    })
  )
  return client
}

type EnsQuery<T> = T & { query?: QueryOptions }

export function useEnsName(params: Source<EnsQuery<GetEnsNameParameters>>) {
  const config = requireConfig()
  const source = createMemo(() => {
    const { query, ...rest } = resolve(params)
    return query?.enabled === false || !rest.address ? null : rest
  })
  const [data, { refetch }] = createResource(source, (p) => getEnsName(config, p))
  return {
    get data() {
      return data()
    },
    get isError() {
      return data.state === 'errored'
    },
    get isLoading() {
      return data.loading
    },
    refetch,
  }
}

export function useEnsAvatar(params: Source<EnsQuery<GetEnsAvatarParameters>>) {
  const config = requireConfig()
  const source = createMemo(() => {
    const { query, ...rest } = resolve(params)
    return query?.enabled === false || !rest.name ? null : rest
  })
  const [data, { refetch }] = createResource(source, (p) => getEnsAvatar(config, p))
  return {
    get data() {
      return data()
    },
    get isError() {
      return data.state === 'errored'
    },
    get isLoading() {
      return data.loading
    },
    refetch,
  }
}
