import { Outlet, createFileRoute } from '@tanstack/react-router'

import PublicContentContainer from '@/components/wrapper/PublicContentContainer'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/_public/leaderboards')({
  head: () => buildHead({ path: '/leaderboards', title: 'Leaderboards' }),
  component: LeaderboardsLayout,
})

function LeaderboardsLayout() {
  return (
    <PublicContentContainer>
      <Outlet />
    </PublicContentContainer>
  )
}
