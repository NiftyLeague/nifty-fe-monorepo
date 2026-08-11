import { Title } from '@nl/ui/custom/typography'
import DeferredLeaderboards from '@/components/providers/DeferredLeaderboards'

const LeaderboardPage = () => {
  return (
    <>
      <Title level={2} className="mb-4">
        Leaderboards (Archived)
      </Title>
      <DeferredLeaderboards />
    </>
  )
}

export default LeaderboardPage
