import { useMemo } from 'react';
import { Stack } from '@mui/material';
import { secondsToHours } from 'date-fns';

import { useGamerProfileContext } from '@/hooks/useGamerProfile';
import type { ProfileTotal, ProfileNiftySmsher } from '@/types/account';
import { formatNumberToDisplay } from '@/utils/numbers';

import Item from './Item';

interface LeftInfoProps {
  data: ProfileTotal | ProfileNiftySmsher | undefined;
}

const LeftInfo = ({ data }: LeftInfoProps): JSX.Element => {
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
        label: 'Matches',
        value: data?.matches,
      },
      {
        label: 'Wins',
        value: data?.wins,
      },
      {
        label: 'Win Rate',
        value: `${(data?.wins && data?.matches && formatNumberToDisplay((data?.wins / data?.matches) * 100)) || 0}%`,
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

export default LeftInfo;
