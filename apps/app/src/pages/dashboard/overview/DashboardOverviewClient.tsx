import DashboardDataBoundary from '@/components/providers/DashboardDataBoundary'
import DeferredSection from '@nl/ui/custom/deferred-section'
import type { JSX } from 'solid-js'

const loadMyComics = () => import('./MyComics')
const loadMyItems = () => import('./MyItems')
const loadMyDegens = () => import('./MyDegens')
const loadMyNFTL = () => import('./_MyNFTL')
const loadMyStats = () => import('./MyStats')

const DashboardOverviewContent = (): JSX.Element => {
  return (
    <div class="flex flex-col gap-8 lg:flex-row">
      <div class="flex w-full flex-col gap-8 lg:w-11/24">
        <div class="w-full">
          <DeferredSection label="My Tokens" load={loadMyNFTL} />
        </div>
        <div class="w-full">
          <DeferredSection label="My Stats" load={loadMyStats} />
        </div>
      </div>
      <div class="flex w-full flex-col gap-8 lg:w-13/24">
        <div class="w-full">
          <DeferredSection label="My DEGENs" load={loadMyDegens} />
        </div>
        <div class="w-full">
          <DeferredSection label="My Comics" load={loadMyComics} />
        </div>
        <div class="w-full">
          <DeferredSection label="My Items" load={loadMyItems} />
        </div>
      </div>
    </div>
  )
}

const DashboardOverview = (): JSX.Element => (
  <DashboardDataBoundary>
    <DashboardOverviewContent />
  </DashboardDataBoundary>
)

export default DashboardOverview
