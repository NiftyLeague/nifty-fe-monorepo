'use client'

import { useAccount, useSwitchChain } from 'wagmi'
import { immutableZkEvm, immutableZkEvmTestnet } from 'viem/chains'
import { Info, TriangleAlert } from 'lucide-react'

import { buttonVariants } from '@nl/ui/base/button-variants'
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
      {isConnectedToIMX ? (
        <Info aria-hidden="true" absoluteStrokeWidth size={24} strokeWidth={2.5} />
      ) : (
        <TriangleAlert aria-hidden="true" absoluteStrokeWidth size={24} strokeWidth={2.5} />
      )}
      <span aria-live="polite" className="px-2 text-xl font-semibold">
        {isConnectedToIMX
          ? `You're connected to Immutable zkEVM! Switch back to ${TARGET_NETWORK.label}`
          : `Please switch to ${TARGET_NETWORK.label}`}
      </span>
      <button
        type="button"
        data-slot="button"
        className={buttonVariants({ variant: 'default', className: 'px-4 py-0.5' })}
        onClick={() => switchChain?.({ chainId: TARGET_NETWORK.chainId })}
      >
        Switch
      </button>
    </div>
  )
}
