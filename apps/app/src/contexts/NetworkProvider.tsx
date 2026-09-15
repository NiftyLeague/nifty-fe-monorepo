'use client'

import { createMemo } from 'solid-js'
import { useAccount } from 'wagmi'

import { TARGET_NETWORK } from '@/constants/networks'
import useContractLoader from '@/hooks/useContractLoader'
import useEthersProvider from '@/hooks/useEthersProvider'
import useEthersSigner from '@/hooks/useEthersSigner'
import useNotify from '@/hooks/useNotify'
import NetworkContext from './NetworkContext'

export const NetworkProvider = ({ children }: { children?: JSX.Element }): JSX.Element => {
  const chainId = TARGET_NETWORK?.chainId || 1
  const { address, isConnected } = useAccount()
  const publicProvider = useEthersProvider({ chainId })
  const signer = useEthersSigner({ chainId })
  const tx = useNotify(signer)
  const readContracts = useContractLoader(publicProvider, { chainId })
  const writeContracts = useContractLoader(signer, { chainId })
  const value = createMemo(
    () => ({ address, isConnected, publicProvider, readContracts, signer, tx, writeContracts }),
    [address, isConnected, publicProvider, readContracts, signer, tx, writeContracts]
  )

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
}
