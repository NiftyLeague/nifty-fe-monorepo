'use client'

import DashboardDataBoundary from '@/components/providers/DashboardDataBoundary'
import DeferredSection from '@nl/ui/custom/deferred-section'

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
          <DeferredSection label="My Tokens" load={loadMyNFTL} />
        </div>
        <div className="w-full">
          <DeferredSection label="My Stats" load={loadMyStats} />
        </div>
      </div>
      <div className="flex w-full flex-col gap-8 lg:w-[54.1667%]">
        <div className="w-full">
          <DeferredSection label="My DEGENs" load={loadMyDegens} />
        </div>
        <div className="w-full">
          <DeferredSection label="My Comics" load={loadMyComics} />
        </div>
        <div className="w-full">
          <DeferredSection label="My Items" load={loadMyItems} />
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
