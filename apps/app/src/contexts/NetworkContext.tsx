import { createContext } from 'solid-js'

import type { Provider } from '@/hooks/useEthersProvider'
import type { Signer } from '@/hooks/useEthersSigner'
import type { ContractWriteParams } from '@/utils/transactions'
import type { Contracts } from '@/types/web3'
import type { Hash } from 'viem'
import type { WriteReceiptCallback } from '@/utils/transactions'

export interface NetworkContextValue {
  address?: `0x${string}`
  isConnected: boolean
  publicProvider?: Provider
  readContracts: Contracts
  signer?: Signer
  write: (params: ContractWriteParams, callback?: WriteReceiptCallback) => Promise<Hash | null>
  writeContracts: Contracts
}

const CONTEXT_INITIAL_STATE: NetworkContextValue = {
  address: undefined,
  isConnected: false,
  publicProvider: undefined,
  readContracts: {} as Contracts,
  signer: undefined,
  write: async () => null,
  writeContracts: {} as Contracts,
}

const NetworkContext = createContext<NetworkContextValue>(CONTEXT_INITIAL_STATE)

export default NetworkContext
