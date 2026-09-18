import type { Accessor } from 'solid-js'
import { useAccount } from '@/runtime/wagmi'
import { IS_PRODUCTION } from '@/runtime/env'
import { immutableZkEvm, immutableZkEvmTestnet } from 'viem/chains'

export function getNetwork() {
  return IS_PRODUCTION ? immutableZkEvm : immutableZkEvmTestnet
}

export function useConnectedToIMXCheck(): Accessor<boolean> {
  const account = useAccount()
  const chainId = () => account.chain?.id
  return () => chainId() === immutableZkEvm.id || chainId() === immutableZkEvmTestnet.id
}
