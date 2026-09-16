import { createContext, type JSX } from 'solid-js'
import { immutableZkEvm, immutableZkEvmTestnet } from 'viem/chains'

import type { BrowserProvider } from 'ethers'
import type { Contracts } from '@/types/web3'

import { IS_PRODUCTION } from '@/runtime/env'
import useContractLoader from '@/hooks/useContractLoader'
import useImxProvider, { getNetwork, useImxSigner } from '@/hooks/useImxProvider'
import type { Signer } from '@/hooks/useEthersSigner'

export interface IMXContextValue {
  readonly address?: `0x${string}`
  readonly imxChainId: number
  readonly imxContracts: Contracts
  readonly imxSigner?: Signer
  readonly passportProvider?: BrowserProvider
}

const CONTEXT_INITIAL_STATE: IMXContextValue = {
  address: undefined,
  imxChainId: IS_PRODUCTION ? immutableZkEvm.id : immutableZkEvmTestnet.id,
  imxContracts: {} as Contracts,
  imxSigner: undefined,
  passportProvider: undefined,
}

const IMXContext = createContext<IMXContextValue>(CONTEXT_INITIAL_STATE)

export const IMXProvider = (props: { children?: JSX.Element }): JSX.Element => {
  // IMX Passport instance converted to an ethers.js Provider
  const passportProvider = useImxProvider()
  const passportNetwork = getNetwork()
  const imxChainId = passportNetwork.id

  // Ethers.js Signer connected to Immutable zkEVM
  const imxSigner = useImxSigner()

  // Load Immutable zkEVM contracts with Read access
  const imxContracts = useContractLoader(passportProvider, { chainId: imxChainId })

  const value: IMXContextValue = {
    get address() {
      return imxSigner()?.address as `0x${string}` | undefined
    },
    imxChainId,
    get imxContracts() {
      return imxContracts()
    },
    get imxSigner() {
      return imxSigner()
    },
    get passportProvider() {
      return passportProvider()
    },
  }

  return <IMXContext.Provider value={value}>{props.children}</IMXContext.Provider>
}

export default IMXContext
