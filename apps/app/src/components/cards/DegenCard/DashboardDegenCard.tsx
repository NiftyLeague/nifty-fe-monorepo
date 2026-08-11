'use client'

import dynamic from 'next/dynamic'
import DegenCard, { DegenCardInView, type DegenCardProps } from './index'

const DegenDashboardActions = dynamic(() => import('./DegenDashboardActions'), { ssr: false })

function withDashboardActions(props: DegenCardProps) {
  const { degen, favs = [], size = 'normal', onClickFavorite } = props

  return {
    ...props,
    dashboardActions: (
      <DegenDashboardActions
        tokenId={degen.id}
        fav={favs.includes(degen.id)}
        size={size}
        onClickFavorite={onClickFavorite}
      />
    ),
  }
}

export function DashboardDegenCard(props: DegenCardProps) {
  return <DegenCard {...withDashboardActions(props)} />
}

export function DashboardDegenCardInView(props: DegenCardProps) {
  return <DegenCardInView {...withDashboardActions(props)} />
}

export default DashboardDegenCard
