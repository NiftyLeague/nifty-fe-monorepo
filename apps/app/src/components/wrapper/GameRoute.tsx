'use client'

import type { PropsWithChildren } from 'react'
import dynamic from 'next/dynamic'
import type { UnityConfig } from 'react-unity-webgl'

import RouteLoading from '@nl/ui/custom/route-loading'

import WalletRouteProvider from '@/components/providers/WalletRouteProvider'

const GameWithAuth = dynamic(() => import('./GameWithAuth'), {
  ssr: false,
  loading: () => <RouteLoading label="Loading game" />,
})

interface GameRouteProps extends PropsWithChildren {
  arcadeTokenRequired?: boolean
  unityConfig: UnityConfig
}

export default function GameRoute({ arcadeTokenRequired, children, unityConfig }: GameRouteProps) {
  return (
    <WalletRouteProvider>
      {children}
      <GameWithAuth unityConfig={unityConfig} arcadeTokenRequired={arcadeTokenRequired} />
    </WalletRouteProvider>
  )
}
