'use client'

import type { PropsWithChildren } from 'react'

import DeferredComponent from '@nl/ui/custom/deferred-component'

const loadDashboardDataProviders = () => import('@/contexts/DashboardDataProviders')

export default function DashboardDataBoundary({ children }: PropsWithChildren) {
  return (
    <DeferredComponent
      label="Dashboard data"
      load={loadDashboardDataProviders}
      props={{ children }}
    />
  )
}
