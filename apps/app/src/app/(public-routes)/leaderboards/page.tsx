import { Title } from '@nl/ui/custom/typography'
import LeaderBoards from '@/components/leaderboards'

const LeaderboardPage = () => {
  return (
    <>
      <Title level={2} className="mb-4">
        Leaderboards (Archived)
      </Title>
      <LeaderBoards />
    </>
  )
}

export default LeaderboardPage
