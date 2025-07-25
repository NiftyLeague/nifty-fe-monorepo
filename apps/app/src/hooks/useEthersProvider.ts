'use client';

import { useMemo } from 'react';
import { FallbackProvider, JsonRpcProvider } from 'ethers6';
import type { Chain, Client, Transport } from 'viem';
import { type Config, useClient } from 'wagmi';

export type Provider = FallbackProvider | JsonRpcProvider;
function clientToProvider(client: Client<Transport, Chain>): Provider {
  const { chain, transport } = client;
  const network = { chainId: chain.id, name: chain.name, ensAddress: chain.contracts?.ensRegistry?.address };
  if (transport.type === 'fallback') {
    const providers = (transport.transports as ReturnType<Transport>[]).map(
      ({ value }) => new JsonRpcProvider(value?.url, network),
    );
    if (providers.length === 1) return providers[0] as JsonRpcProvider;
    return new FallbackProvider(providers);
  }
  return new JsonRpcProvider(transport.url, network);
}

/** Action to convert a viem Client to an ethers.js Provider. */
export default function useEthersProvider({ chainId }: { chainId?: number } = {}): Provider {
  const client = useClient<Config>({ chainId });
  return useMemo(() => clientToProvider(client as Client<Transport, Chain>), [client]);
}
