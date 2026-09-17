import type { JSX } from 'solid-js'
import { useAccount } from '@/runtime/wagmi'

import { TARGET_NETWORK } from '@/constants/networks'
import useContractLoader from '@/hooks/useContractLoader'
import useEthersProvider from '@/hooks/useEthersProvider'
import useEthersSigner from '@/hooks/useEthersSigner'
import NetworkContext from './NetworkContext'
import {
  executeContractWrite,
  type ContractWriteParams,
  type WriteReceiptCallback,
} from '@/utils/transactions'
import { useWagmiConfig } from '@/runtime/wagmi'

export const NetworkProvider = (props: { children?: JSX.Element }): JSX.Element => {
  const chainId = TARGET_NETWORK?.chainId || 1
  const account = useAccount()
  const publicProvider = useEthersProvider({ chainId })
  const signer = useEthersSigner({ chainId })
  const readContracts = useContractLoader(publicProvider, { chainId })
  const writeContracts = useContractLoader(signer, { chainId })

  const value = {
    get address() {
      return account.address
    },
    get isConnected() {
      return account.isConnected
    },
    get publicProvider() {
      return publicProvider()
    },
    get readContracts() {
      return readContracts()
    },
    get signer() {
      return signer()
    },
    write: (params: ContractWriteParams, callback?: WriteReceiptCallback) =>
      executeContractWrite(
        useWagmiConfig(),
        { chainId: TARGET_NETWORK.chainId, ...params },
        callback
      ),
    get writeContracts() {
      return writeContracts()
    },
  }

  return <NetworkContext.Provider value={value}>{props.children}</NetworkContext.Provider>
}
