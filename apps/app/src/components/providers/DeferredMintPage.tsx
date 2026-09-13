'use client'

import DeferredComponent from '@nl/ui/custom/deferred-component'
import RouteLoading from '@nl/ui/custom/route-loading'

const loadMintPageContent = () => import('./MintPageContent')

export default function DeferredMintPage() {
  return (
    <DeferredComponent
      label="Mint page"
      load={loadMintPageContent}
      loadingFallback={<RouteLoading label="Loading Mint-o-Matic" />}
      props={{}}
    />
  )
}
