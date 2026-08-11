'use client'

import { createContext } from 'react'

import type { Provider } from '@/hooks/useEthersProvider'
import type { Signer } from '@/hooks/useEthersSigner'
import type { Tx } from '@/types/notify'
import type { Contracts } from '@/types/web3'

export interface NetworkContextValue {
  address?: `0x${string}`
  isConnected: boolean
  publicProvider?: Provider
  readContracts: Contracts
  signer?: Signer
  tx: Tx
  writeContracts: Contracts
}

const CONTEXT_INITIAL_STATE: NetworkContextValue = {
  address: undefined,
  isConnected: false,
  publicProvider: undefined,
  readContracts: {} as Contracts,
  signer: undefined,
  tx: async () => new Promise(() => null),
  writeContracts: {} as Contracts,
}

const NetworkContext = createContext<NetworkContextValue>(CONTEXT_INITIAL_STATE)

export default NetworkContext
