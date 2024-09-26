import { useMemo } from 'react';
import { Stack } from '@mui/material';

import { useGamerProfileContext } from '@/hooks/useGamerProfile';
import Item from './Item';

const commonValue = {
  value: 'N/A',
  isDisable: true,
  isLoading: false,
};
interface RightInfoProps {
  degenCount: number;
  rentalCount: number;
  comicCount: number;
  itemCount: number;
}
const RightInfo = ({ degenCount, rentalCount, comicCount, itemCount }: RightInfoProps): JSX.Element => {
  const { isLoadingDegens, isLoadingComics, isLoadingItems } = useGamerProfileContext();
  const rightDataMapper: {
    label: string;
    value: string | number | undefined;
    isLoading?: boolean;
    isDisable?: boolean;
  }[] = useMemo(() => {
    return [
      {
        label: 'Degens Owned',
        value: degenCount,
        isLoading: isLoadingDegens,
      },
      // {
      //   label: 'Degens Rented',
      //   value: rentalCount,
      //   isLoading: isLoadingDegens,
      // },
      {
        label: 'Comics Owned',
        value: comicCount,
        isLoading: isLoadingComics,
      },
      {
        label: 'Items Owned',
        value: itemCount,
        isLoading: isLoadingItems,
      },
      // {
      //   label: 'Pets Owned',
      //   ...commonValue,
      // },
      // {
      //   label: 'Land Owned',
      //   ...commonValue,
      // },
      // {
      //   label: 'Land Items Owned',
      //   ...commonValue,
      // },
    ];
  }, [degenCount, rentalCount, comicCount, isLoadingDegens, isLoadingComics]);
  return (
    <Stack flex={1} spacing={1}>
      {rightDataMapper.map(child => (
        <Item key={child.label} {...child} />
      ))}
    </Stack>
  );
};

export default RightInfo;
