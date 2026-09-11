import { Outlet, createFileRoute } from '@tanstack/react-router'

import PublicContentContainer from '@/components/wrapper/PublicContentContainer'
import AppQueryProvider from '@/query/AppQueryProvider'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/_public/leaderboards')({
  head: () => buildHead({ title: 'Leaderboards' }),
  component: LeaderboardsLayout,
})

function LeaderboardsLayout() {
  return (
    <AppQueryProvider>
      <PublicContentContainer>
        <Outlet />
      </PublicContentContainer>
    </AppQueryProvider>
  )
}
