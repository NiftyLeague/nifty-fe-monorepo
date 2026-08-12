'use client'

import DashboardDataBoundary from '@/components/providers/DashboardDataBoundary'
import DeferredDashboardSection from '@/components/providers/DeferredDashboardSection'

const loadMyComics = () => import('./MyComics')
const loadMyItems = () => import('./MyItems')
const loadMyDegens = () => import('./MyDegens')
const loadMyNFTL = () => import('./_MyNFTL')
const loadMyStats = () => import('./MyStats')

const DashboardOverviewContent = (): React.ReactNode => {
  return (
    <div className="flex h-inherit flex-col gap-8 lg:flex-row">
      <div className="flex w-full flex-col gap-8 lg:w-[45.8333%]">
        <div className="w-full">
          <DeferredDashboardSection label="My Tokens" load={loadMyNFTL} />
        </div>
        <div className="w-full">
          <DeferredDashboardSection label="My Stats" load={loadMyStats} />
        </div>
      </div>
      <div className="flex w-full flex-col gap-8 lg:w-[54.1667%]">
        <div className="w-full">
          <DeferredDashboardSection label="My DEGENs" load={loadMyDegens} />
        </div>
        <div className="w-full">
          <DeferredDashboardSection label="My Comics" load={loadMyComics} />
        </div>
        <div className="w-full">
          <DeferredDashboardSection label="My Items" load={loadMyItems} />
        </div>
      </div>
    </div>
  )
}

const DashboardOverview = (): React.ReactNode => (
  <DashboardDataBoundary>
    <DashboardOverviewContent />
  </DashboardDataBoundary>
)

export default DashboardOverview
