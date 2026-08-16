'use client'

import type { PropsWithChildren } from 'react'

import DeferredComponent from '@nl/ui/custom/deferred-component'

const loadDashboardDataProviders = () => import('@/contexts/DashboardDataProviders')
const loadNFTDataProviders = () => import('@/contexts/NFTDataProviders')

type DashboardDataBoundaryProps = PropsWithChildren<{ includeTokens?: boolean }>

export default function DashboardDataBoundary({
  children,
  includeTokens = true,
}: DashboardDataBoundaryProps) {
  return (
    <DeferredComponent
      label="Dashboard data"
      load={includeTokens ? loadDashboardDataProviders : loadNFTDataProviders}
      props={{ children }}
    />
  )
}
