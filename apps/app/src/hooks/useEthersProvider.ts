import { createMemo, type Accessor } from 'solid-js'
import { FallbackProvider, JsonRpcProvider } from 'ethers'
import type { Chain, Client, Transport } from 'viem'
import { useClient } from '@/runtime/wagmi'

export type Provider = FallbackProvider | JsonRpcProvider
function clientToProvider(client: Client<Transport, Chain>): Provider {
  const { chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback') {
    const providers = (transport.transports as ReturnType<Transport>[]).map(
      ({ value }) => new JsonRpcProvider(value?.url, network)
    )
    if (providers.length === 1) return providers[0] as JsonRpcProvider
    return new FallbackProvider(providers)
  }
  return new JsonRpcProvider(transport.url, network)
}

/**
 * Providers are keyed to the client object's identity: wallet and chain
 * switches produce a new client (and a fresh provider), while remounts of
 * consuming components reuse the existing instance instead of rebuilding
 * the transport and dropping in-flight provider state.
 */
let cachedClient: Client<Transport, Chain> | undefined
let cachedProvider: Provider | undefined

/** Action to convert a viem Client to an ethers.js Provider. */
export default function useEthersProvider({ chainId }: { chainId?: number } = {}): Accessor<
  Provider | undefined
> {
  const client = useClient({ chainId })
  return createMemo(() => {
    const active = client() as Client<Transport, Chain> | undefined
    if (!active) {
      cachedClient = undefined
      cachedProvider = undefined
      return undefined
    }
    if (active !== cachedClient) {
      cachedClient = active
      cachedProvider = clientToProvider(active)
    }
    return cachedProvider
  })
}
