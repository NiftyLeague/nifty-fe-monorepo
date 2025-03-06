import { Box, LinearProgress } from '@mui/material';
import { linearProgressClasses } from '@mui/material/LinearProgress';
import { useTheme } from '@nl/theme';

import type { ProfileTotal, ProfileNiftySmsher, ProfileMiniGame } from '@/types/account';

interface ProgressGamerProps {
  data?: ProfileTotal | ProfileNiftySmsher | ProfileMiniGame;
  size?: 'sm' | 'md';
}

const ProgressGamer = ({ data, size = 'md' }: ProgressGamerProps): React.ReactNode => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'relative',
        '&:before': {
          position: 'absolute',
          width: size === 'md' ? '54px' : '34px',
          height: size === 'md' ? '54px' : '34px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          top: 0,
          right: '-6px',
          bottom: 0,
          margin: 'auto',
          background: theme.palette.primary.main,
          content: `'${(data && data?.xp > data?.rank_xp_previous ? data?.rank + 1 : data?.rank) || 0}'`,
          zIndex: 1,
          fontWeight: 'bold',
          fontSize: size === 'md' ? '18px' : '14px',
        },
      }}
    >
      <LinearProgress
        variant="determinate"
        color="primary"
        value={data ? (data?.xp / data?.rank_xp_next) * 100 : 0}
        sx={{
          height: size === 'md' ? '25px' : '14px',
          [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[400],
          },
        }}
      />
    </Box>
  );
};

export default ProgressGamer;
