import { createContext } from 'solid-js'
import type { Hash } from 'viem'

import type { ContractWriteParams, WriteReceiptCallback } from '@/utils/transactions'

export interface NetworkContextValue {
  address?: `0x${string}`
  isConnected: boolean
  write: (params: ContractWriteParams, callback?: WriteReceiptCallback) => Promise<Hash | null>
}

const CONTEXT_INITIAL_STATE: NetworkContextValue = {
  address: undefined,
  isConnected: false,
  write: async () => null,
}

const NetworkContext = createContext<NetworkContextValue>(CONTEXT_INITIAL_STATE)

export default NetworkContext
