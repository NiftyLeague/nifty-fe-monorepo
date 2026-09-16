import type { ParentProps } from 'solid-js'

import DeferredComponent from '@nl/ui/custom/deferred-component'

const loadWalletFeatureProviders = () => import('@/contexts/WalletFeatureProviders')
const loadNFTDataProviders = () => import('@/contexts/NFTDataProviders')

type DashboardDataBoundaryProps = ParentProps<{ includeTokens?: boolean }>

export default function DashboardDataBoundary(props: DashboardDataBoundaryProps) {
  return (
    <DeferredComponent
      label="Dashboard data"
      load={(props.includeTokens ?? true) ? loadWalletFeatureProviders : loadNFTDataProviders}
      props={{ children: props.children }}
    />
  )
}
