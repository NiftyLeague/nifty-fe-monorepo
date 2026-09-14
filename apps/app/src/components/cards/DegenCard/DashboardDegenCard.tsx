'use client'

import { memo, type ReactNode } from 'react'

import dynamic from '@/runtime/dynamic'
import DeferredDegenCard from '@/components/providers/DeferredDegenCard'
import type { PublicDegen } from '@/types/degens'

import DegenCard, { type DegenCardProps } from './index'

const DegenDashboardActions = dynamic(() => import('./DegenDashboardActions'), { ssr: false })

function withDashboardActions<T extends PublicDegen>(props: DegenCardProps<T>) {
  const { degen, favs = [], size = 'normal', onClickFavorite } = props

  return {
    ...props,
    dashboardActions: (
      <DegenDashboardActions
        tokenId={degen.id}
        fav={favs.includes(degen.id)}
        size={size}
        onClickFavorite={onClickFavorite ? () => onClickFavorite(degen) : undefined}
      />
    ),
  }
}

function DashboardDegenCardInner<T extends PublicDegen>(props: DegenCardProps<T>) {
  return <DegenCard {...withDashboardActions(props)} />
}

function DashboardDegenCardInViewInner<T extends PublicDegen>(props: DegenCardProps<T>) {
  return <DeferredDegenCard {...withDashboardActions(props)} />
}

// Memoized so unchanged grids skip re-rendering when the page around them
// updates; the casts restore the generic card the same way `DeferredComponent`
// does.
export const DashboardDegenCard = memo(DashboardDegenCardInner) as <T extends PublicDegen>(
  props: DegenCardProps<T>
) => ReactNode

export const DashboardDegenCardInView = memo(DashboardDegenCardInViewInner) as <
  T extends PublicDegen,
>(
  props: DegenCardProps<T>
) => ReactNode

export default DashboardDegenCard
