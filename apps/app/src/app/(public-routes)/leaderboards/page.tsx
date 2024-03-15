import { Typography } from '@mui/material';
import LeaderBoards from '@/components/leaderboards';

const LeaderboardPage = () => {
  return (
    <>
      <Typography mb={4} variant="h2">
        Leaderboards
      </Typography>
      <LeaderBoards />
    </>
  );
};

export default LeaderboardPage;
