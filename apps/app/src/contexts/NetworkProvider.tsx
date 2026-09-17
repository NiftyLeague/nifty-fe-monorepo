import { useAccount } from '@/runtime/wagmi'
import type { JSX } from 'solid-js'

import { TARGET_NETWORK } from '@/constants/networks'
import NetworkContext from './NetworkContext'
import {
  executeContractWrite,
  type ContractWriteParams,
  type WriteReceiptCallback,
} from '@/utils/transactions'
import { useWagmiConfig } from '@/runtime/wagmi'

export const NetworkProvider = (props: { children?: JSX.Element }): JSX.Element => {
  const account = useAccount()

  const value = {
    get address() {
      return account.address
    },
    get isConnected() {
      return account.isConnected
    },
    write: (params: ContractWriteParams, callback?: WriteReceiptCallback) =>
      executeContractWrite(
        useWagmiConfig(),
        { chainId: TARGET_NETWORK.chainId, ...params },
        callback
      ),
  }

  return <NetworkContext.Provider value={value}>{props.children}</NetworkContext.Provider>
}
