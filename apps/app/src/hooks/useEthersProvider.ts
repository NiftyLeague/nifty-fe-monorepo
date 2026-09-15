'use client'

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

/** Action to convert a viem Client to an ethers.js Provider. */
export default function useEthersProvider({ chainId }: { chainId?: number } = {}): Accessor<
  Provider | undefined
> {
  const client = useClient({ chainId })
  return createMemo(() => {
    const active = client()
    return active ? clientToProvider(active as Client<Transport, Chain>) : undefined
  })
}
