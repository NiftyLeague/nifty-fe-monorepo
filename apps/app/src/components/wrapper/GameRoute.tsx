import type { ParentProps } from 'solid-js'
import dynamic from '@/runtime/dynamic'
import type { UnityConfig } from '@/runtime/unity'

import RouteLoading from '@nl/ui/custom/route-loading'

import WalletRouteProvider from '@/components/providers/WalletRouteProvider'

const GameWithAuth = dynamic(() => import('./GameWithAuth'), {
  ssr: false,
  loading: () => <RouteLoading label="Loading game" />,
})

interface GameRouteProps extends ParentProps {
  unityConfig: UnityConfig
}

export default function GameRoute(props: GameRouteProps) {
  return (
    <WalletRouteProvider>
      {props.children}
      <GameWithAuth unityConfig={props.unityConfig} />
    </WalletRouteProvider>
  )
}
