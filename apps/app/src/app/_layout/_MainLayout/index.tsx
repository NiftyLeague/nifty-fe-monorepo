'use client'

// third party
import { type PropsWithChildren } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'

// project imports
import { Button } from '@nl/ui/base/button'
import { useConnectedToIMXCheck } from '@/hooks/useImxProvider'
import { TARGET_NETWORK } from '@/constants/networks'

// components
import { Icon } from '@nl/ui/base/icon'
import AppShell from '@/app/_layout/AppShell'
import Header from './_Header'
import Sidebar from './_Sidebar'

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = ({ children }: PropsWithChildren) => {
  const { address, chain } = useAccount()
  const { switchChain } = useSwitchChain()
  const isConnectedToIMX = useConnectedToIMXCheck()

  const networkWarning =
    address && TARGET_NETWORK.chainId !== chain?.id ? (
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
    ) : null

  return (
    <AppShell
      header={<Header showWalletActions />}
      sidebar={<Sidebar />}
      networkWarning={networkWarning}
    >
      {children}
    </AppShell>
  )
}

export default MainLayout
