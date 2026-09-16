import { createMemo, createResource, createSignal, onCleanup } from 'solid-js'
import { createQuery } from '@tanstack/solid-query'
import {
  disconnect as coreDisconnect,
  getAccount,
  getClient,
  getConnectorClient,
  getEnsAvatar,
  getEnsName,
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
  type ReadContractParameters,
  type SignMessageParameters,
  type SwitchChainParameters,
} from '@wagmi/core'
import type { Client } from 'viem'

/**
 * Solid bindings over @wagmi/core. The wagmi `Config` is owned by
 * `contexts/Web3ModalConfig`, which is loaded lazily (it throws without a
 * project id and keeps AppKit out of the initial bundle). That module calls
 * `registerWagmiConfig` on evaluation; hooks that issue reads or mutations
 * throw until then, which never happens for components inside
 * `Web3ModalProvider`.
 *
 * Account state is a module-level singleton fed by exactly one
 * `watchAccount` subscription: every `useAccount()` caller reads the same
 * fine-grained getters instead of each owning a watcher, and reads before
 * the config registers observe the disconnected defaults.
 */

let wagmiConfig: Config | undefined

export function registerWagmiConfig(config: Config) {
  wagmiConfig = config
  setAccount(getAccount(config))
  startAccountWatcher()
}

function requireConfig(): Config {
  if (!wagmiConfig) {
    throw new Error('wagmi config not registered — Web3ModalConfig has not loaded yet')
  }
  return wagmiConfig
}

export const useWagmiConfig = requireConfig

type Source<T> = T | (() => T)
const resolve = <T>(value: Source<T>): T =>
  typeof value === 'function' ? (value as () => T)() : value

const DISCONNECTED_ACCOUNT = {
  address: undefined,
  addresses: undefined,
  chain: undefined,
  chainId: undefined,
  connector: undefined,
  isConnected: false,
  isConnecting: false,
  isDisconnected: true,
  isReconnecting: false,
  status: 'disconnected',
} as GetAccountReturnType

const [account, setAccount] = createSignal<GetAccountReturnType>(DISCONNECTED_ACCOUNT)

let stopWatchingAccount: (() => void) | undefined

type AccountListener = (next: GetAccountReturnType, prev: GetAccountReturnType) => void

const accountListeners = new Set<AccountListener>()

/**
 * Subscribe to connect/disconnect transitions. Listeners are event handlers:
 * they run once per account change with the previous snapshot, so edge
 * detection needs no latch lets or effects.
 */
export function subscribeAccountTransition(listener: AccountListener): () => void {
  accountListeners.add(listener)
  return () => accountListeners.delete(listener)
}

/** Component-scoped transition subscription (auto-disposed on cleanup). */
export function useAccountTransition(listener: AccountListener): void {
  onCleanup(subscribeAccountTransition(listener))
}

function startAccountWatcher() {
  if (stopWatchingAccount || !wagmiConfig) return
  stopWatchingAccount = watchAccount(wagmiConfig, {
    onChange: (next, prev) => {
      setAccount(() => next)
      for (const listener of accountListeners) listener(next, prev)
    },
  })
}

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

/** Shared read-only getters over the single app-wide account signal. */
const SHARED_ACCOUNT: UseAccountReturn = {
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

export function useAccount(): UseAccountReturn {
  return SHARED_ACCOUNT
}

interface QueryOptions {
  enabled?: boolean
  staleTime?: number
  refetchInterval?: number
}

/**
 * JSON-stable key fragment for read parameters. BigInt args are stringified
 * explicitly because JSON.stringify throws on them. ABIs are excluded: the
 * contract at (chainId, address) fixes the ABI, and ABIs are far too large
 * to serialize into a cache key on every reactive evaluation.
 */
const readKeyParts = (parts: {
  chainId?: number
  address?: `0x${string}`
  functionName?: string
  args?: readonly unknown[] | undefined
}): string =>
  JSON.stringify(parts, (_key, entry) =>
    typeof entry === 'bigint' ? `${entry.toString()}n` : entry
  )

export type UseReadContractParameters = ReadContractParameters & { query?: QueryOptions }

/**
 * Contract reads run through the shared TanStack Query cache (the same
 * client the router owns), so identical reads across components, provider
 * stacks, and route remounts deduplicate into one RPC and honor staleTime.
 * `isLoading` is true only for the initial fetch; background refetches keep
 * stale data visible instead of flashing loading state.
 */
export function useReadContract(params: Source<UseReadContractParameters>) {
  requireConfig()

  const query = createQuery(() => {
    const { query: options, ...rest } = resolve(params)
    const { chainId, address, functionName, args } = rest
    return {
      queryKey: ['wagmi-read', 'contract', readKeyParts({ chainId, address, functionName, args })],
      queryFn: () => readContract(requireConfig(), rest as ReadContractParameters),
      enabled: options?.enabled !== false,
      staleTime: options?.staleTime,
      refetchInterval: options?.refetchInterval,
      retry: false,
    }
  })

  return {
    get data() {
      return query.data
    },
    get error() {
      return (query.error as Error | undefined) ?? null
    },
    get isError() {
      return query.isError
    },
    get isLoading() {
      return query.isLoading
    },
    get isSuccess() {
      return query.isSuccess
    },
    refetch: () => query.refetch(),
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
  const mutation = createMutation<void, { connector?: unknown } | undefined>((params) =>
    coreDisconnect(config, params as never)
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

export function useConnectorClient(params?: Source<GetConnectorClientParameters | undefined>) {
  const config = requireConfig()
  const walletAccount = useAccount()
  const source = createMemo(() => {
    if (walletAccount.status !== 'connected' || !walletAccount.connector) return null
    return {
      ...resolve(params),
      connector: walletAccount.connector,
    } as GetConnectorClientParameters
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

/**
 * ENS reads share the contract-read cache so duplicate lookups (the same
 * name renders in header, sidebar, and dialogs) issue one RPC.
 */
const createEnsRead = <T extends { chainId?: number; address?: `0x${string}`; name?: string }>(
  read: (config: Config, params: T) => Promise<string | null>,
  cacheSuffix: string
) => {
  return (params: Source<EnsQuery<T>>) => {
    requireConfig()

    const query = createQuery(() => {
      const { query: options, ...rest } = resolve(params)
      const hasSubject = Boolean(rest.address || rest.name)
      return {
        queryKey: ['wagmi-read', cacheSuffix, readKeyParts(rest)],
        queryFn: () => read(requireConfig(), rest as T),
        enabled: options?.enabled !== false && hasSubject,
        staleTime: options?.staleTime,
        refetchInterval: options?.refetchInterval,
        retry: false,
      }
    })

    return {
      get data() {
        return query.data
      },
      get isError() {
        return query.isError
      },
      get isLoading() {
        return query.isLoading
      },
      refetch: () => query.refetch(),
    }
  }
}

export const useEnsName = createEnsRead<GetEnsNameParameters>(getEnsName, 'ens-name')

export const useEnsAvatar = createEnsRead<GetEnsAvatarParameters>(getEnsAvatar, 'ens-avatar')
