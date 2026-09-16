import { createMemo, type Accessor } from 'solid-js'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import type { Account, Chain, Client, Transport } from 'viem'
import { useConnectorClient } from '@/runtime/wagmi'

export type Signer = JsonRpcSigner | undefined
function clientToSigner(client: Client<Transport, Chain, Account>): Signer {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account.address)
  return signer
}

/**
 * Signers are keyed to the connector client's identity: a fresh BrowserProvider
 * + JsonRpcSigner pair is only built when the wallet/chain actually changes,
 * not on every consuming mount.
 */
let cachedConnectorClient: Client<Transport, Chain, Account> | undefined
let cachedSigner: JsonRpcSigner | undefined

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export default function useEthersSigner({ chainId }: { chainId?: number } = {}): Accessor<Signer> {
  const connectorClient = useConnectorClient(() => ({ chainId }))
  return createMemo(() => {
    const client = connectorClient.data as Client<Transport, Chain, Account> | undefined
    if (!client) {
      cachedConnectorClient = undefined
      cachedSigner = undefined
      return undefined
    }
    if (client !== cachedConnectorClient) {
      cachedConnectorClient = client
      cachedSigner = clientToSigner(client)
    }
    return cachedSigner
  })
}
