import type { ParentProps } from 'solid-js'
import dynamic from '@/runtime/dynamic'

const WalletFeatureLoading = () => (
  <div class="sr-only" role="status" aria-live="polite" aria-busy="true">
    Loading wallet features
  </div>
)

const GameWalletProviders = dynamic(() => import('@/contexts/GameWalletProviders'), {
  ssr: false,
  loading: WalletFeatureLoading,
})

export default function WalletRouteProvider(props: ParentProps) {
  return <GameWalletProviders>{props.children}</GameWalletProviders>
}
