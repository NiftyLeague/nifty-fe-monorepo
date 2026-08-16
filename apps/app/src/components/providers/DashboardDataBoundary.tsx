'use client'

import type { PropsWithChildren } from 'react'

import DeferredComponent from '@nl/ui/custom/deferred-component'

const loadWalletFeatureProviders = () => import('@/contexts/WalletFeatureProviders')
const loadNFTDataProviders = () => import('@/contexts/NFTDataProviders')

type DashboardDataBoundaryProps = PropsWithChildren<{ includeTokens?: boolean }>

export default function DashboardDataBoundary({
  children,
  includeTokens = true,
}: DashboardDataBoundaryProps) {
  return (
    <DeferredComponent
      label="Dashboard data"
      load={includeTokens ? loadWalletFeatureProviders : loadNFTDataProviders}
      props={{ children }}
    />
  )
}
