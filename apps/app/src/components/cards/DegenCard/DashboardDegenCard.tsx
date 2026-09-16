import { type JSX } from 'solid-js'

import dynamic from '@/runtime/dynamic'
import DeferredDegenCard from '@/components/providers/DeferredDegenCard'
import type { PublicDegen } from '@/types/degens'

import DegenCard, { type DegenCardProps } from './index'

const DegenDashboardActions = dynamic(() => import('./DegenDashboardActions'), { ssr: false })

function DashboardDegenCardInner<T extends PublicDegen>(props: DegenCardProps<T>) {
  return (
    <DegenCard
      {...props}
      dashboardActions={
        <DegenDashboardActions
          tokenId={props.degen.id}
          fav={(props.favs ?? []).includes(props.degen.id)}
          size={props.size ?? 'normal'}
          onClickFavorite={
            props.onClickFavorite ? () => props.onClickFavorite?.(props.degen) : undefined
          }
        />
      }
    />
  )
}

function DashboardDegenCardInViewInner<T extends PublicDegen>(props: DegenCardProps<T>) {
  return (
    <DeferredDegenCard
      {...props}
      dashboardActions={
        <DegenDashboardActions
          tokenId={props.degen.id}
          fav={(props.favs ?? []).includes(props.degen.id)}
          size={props.size ?? 'normal'}
          onClickFavorite={
            props.onClickFavorite ? () => props.onClickFavorite?.(props.degen) : undefined
          }
        />
      }
    />
  )
}

// Memoized so unchanged grids skip re-rendering when the page around them
// updates; the casts restore the generic card the same way `DeferredComponent`
// does.
export const DashboardDegenCard = DashboardDegenCardInner as <T extends PublicDegen>(
  props: DegenCardProps<T>
) => JSX.Element

export const DashboardDegenCardInView = DashboardDegenCardInViewInner as <T extends PublicDegen>(
  props: DegenCardProps<T>
) => JSX.Element

export default DashboardDegenCard
