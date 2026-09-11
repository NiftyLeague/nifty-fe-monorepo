import { createFileRoute } from '@tanstack/react-router'

import DeferredLeaderboards from '@/components/providers/DeferredLeaderboards'
import { Title } from '@nl/ui/custom/typography'
import { acceptSearch } from '@/url/search-schema'

export const Route = createFileRoute('/_public/leaderboards/')({
  validateSearch: acceptSearch,
  component: LeaderboardPage,
})

function LeaderboardPage() {
  return (
    <>
      <Title level={2} className="mb-4">
        Leaderboards (Archived)
      </Title>
      <DeferredLeaderboards />
    </>
  )
}
