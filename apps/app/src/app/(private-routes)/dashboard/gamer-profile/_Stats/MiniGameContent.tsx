import { useMemo } from 'react';
import { Stack } from '@mui/material';
import { secondsToHours } from 'date-fns';

import { useGamerProfileContext } from '@/hooks/useGamerProfile';
import type { ProfileMiniGame } from '@/types/account';
import Item from './Item';

interface MiniGameContentProps {
  data: ProfileMiniGame | undefined;
}

const MiniGameContent = ({ data }: MiniGameContentProps): JSX.Element => {
  const leftDataMapper: {
    label: string;
    value: string | number | undefined;
  }[] = useMemo(() => {
    return [
      {
        label: 'XP Rank',
        value: data?.rank || 0,
      },
      {
        label: 'XP',
        value: Math.round(data?.xp || 0),
      },
      {
        label: 'High Score',
        value: data?.score,
      },
      {
        label: 'Games',
        value: data?.matches,
      },
      {
        label: 'Time Played',
        value: `${secondsToHours(data?.time_played ?? 0)} Hours`,
      },
    ];
  }, [data]);

  const { isLoadingProfile } = useGamerProfileContext();
  return (
    <Stack flex={1} spacing={1}>
      {leftDataMapper.map(child => (
        <Item key={child.label} {...child} isLoading={isLoadingProfile} />
      ))}
    </Stack>
  );
};

export default MiniGameContent;
