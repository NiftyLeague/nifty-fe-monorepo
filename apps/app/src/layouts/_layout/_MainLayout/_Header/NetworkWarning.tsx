import { useAccount, useSwitchChain } from '@/runtime/wagmi'
import { immutableZkEvm, immutableZkEvmTestnet } from 'viem/chains'
import { Info, TriangleAlert } from 'lucide-solid'

import { buttonVariants } from '@nl/ui/base/button-variants'
import { TARGET_NETWORK } from '@/constants/networks'

export default function NetworkWarning() {
  const account = useAccount()
  const { switchChain } = useSwitchChain()
  const isConnectedToIMX = () =>
    account.chain?.id === immutableZkEvm.id || account.chain?.id === immutableZkEvmTestnet.id

  if (!account.address || TARGET_NETWORK.chainId === account.chain?.id) return null

  return (
    <div
      class={`absolute z-1 ${
        isConnectedToIMX()
          ? 'bg-success-dark/[80%] flex h-15 w-full items-center justify-center'
          : 'bg-error/[80%] flex h-15 w-full items-center justify-center'
      }`}
    >
      {isConnectedToIMX() ? (
        <Info aria-hidden="true" absoluteStrokeWidth size={24} strokeWidth={2.5} />
      ) : (
        <TriangleAlert aria-hidden="true" absoluteStrokeWidth size={24} strokeWidth={2.5} />
      )}
      <span aria-live="polite" class="px-2 text-xl font-semibold">
        {isConnectedToIMX()
          ? `You're connected to Immutable zkEVM! Switch back to ${TARGET_NETWORK.label}`
          : `Please switch to ${TARGET_NETWORK.label}`}
      </span>
      <button
        type="button"
        data-slot="button"
        class={buttonVariants({ variant: 'default', className: 'px-4 py-0.5' })}
        onClick={() => switchChain?.({ chainId: TARGET_NETWORK.chainId })}
      >
        Switch
      </button>
    </div>
  )
}
