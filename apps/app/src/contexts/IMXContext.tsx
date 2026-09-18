import { createContext, type JSX } from 'solid-js'
import { immutableZkEvm, immutableZkEvmTestnet } from 'viem/chains'
import { useAccount } from '@/runtime/wagmi'

import { getNetwork } from '@/hooks/useImxProvider'
import { IS_PRODUCTION } from '@/runtime/env'

export interface IMXContextValue {
  readonly address?: `0x${string}`
  readonly imxChainId: number
}

const CONTEXT_INITIAL_STATE: IMXContextValue = {
  address: undefined,
  imxChainId: IS_PRODUCTION ? immutableZkEvm.id : immutableZkEvmTestnet.id,
}

const IMXContext = createContext<IMXContextValue>(CONTEXT_INITIAL_STATE)

export const IMXProvider = (props: { children?: JSX.Element }): JSX.Element => {
  const account = useAccount()
  const passportNetwork = getNetwork()

  const value: IMXContextValue = {
    get address() {
      return account.address
    },
    imxChainId: passportNetwork.id,
  }

  return <IMXContext.Provider value={value}>{props.children}</IMXContext.Provider>
}

export default IMXContext
