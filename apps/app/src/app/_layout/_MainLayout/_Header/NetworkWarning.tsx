'use client'

import { useAccount, useSwitchChain } from 'wagmi'
import { immutableZkEvm, immutableZkEvmTestnet } from 'viem/chains'

import { Button } from '@nl/ui/base/button'
import { Icon } from '@nl/ui/base/icon'
import { TARGET_NETWORK } from '@/constants/networks'

export default function NetworkWarning() {
  const { address, chain } = useAccount()
  const { switchChain } = useSwitchChain()
  const isConnectedToIMX = chain?.id === immutableZkEvm.id || chain?.id === immutableZkEvmTestnet.id

  if (!address || TARGET_NETWORK.chainId === chain?.id) return null

  return (
    <div
      className={
        isConnectedToIMX
          ? 'bg-success-dark/[80%] flex h-[60px] w-full items-center justify-center'
          : 'bg-error/[80%] flex h-[60px] w-full items-center justify-center'
      }
      style={{ zIndex: 1, position: 'absolute' }}
    >
      <Icon name={isConnectedToIMX ? 'info' : 'triangle-alert'} size="lg" strokeWidth={2.5} />
      <span className="px-2 text-xl font-semibold">
        {isConnectedToIMX
          ? `You're connected to Immutable zkEVM! Switch back to ${TARGET_NETWORK.label}`
          : `Please switch to ${TARGET_NETWORK.label}`}
      </span>
      <Button
        className="px-4 py-0.5"
        variant="default"
        onClick={() => switchChain?.({ chainId: TARGET_NETWORK.chainId })}
      >
        Switch
      </Button>
    </div>
  )
}
