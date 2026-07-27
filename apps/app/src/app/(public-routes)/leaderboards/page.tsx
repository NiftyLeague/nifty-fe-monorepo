import { Typography } from '@mui/material'
import LeaderBoards from '@/components/leaderboards'

const LeaderboardPage = () => {
  return (
    <>
      <Typography variant="h2" sx={{ mb: 4 }}>
        Leaderboards (Archived)
      </Typography>
      <LeaderBoards />
    </>
  )
}

export default LeaderboardPage
