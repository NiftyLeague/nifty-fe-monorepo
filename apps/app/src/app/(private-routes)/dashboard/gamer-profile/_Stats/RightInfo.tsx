import { useMemo } from 'react';
import { Stack } from '@mui/material';

import { useGamerProfileContext } from '@/hooks/useGamerProfile';
import Item from './Item';

const commonValue = { value: 'N/A', isDisable: true, isLoading: false };
interface RightInfoProps {
  comicCount: number;
  degenCount: number;
  itemCount: number;
  keyCount: number;
  rentalCount: number;
}
const RightInfo = ({ comicCount, degenCount, itemCount, keyCount, rentalCount }: RightInfoProps): React.ReactNode => {
  const { isLoadingDegens, isLoadingComics, isLoadingItems } = useGamerProfileContext();
  const rightDataMapper: {
    label: string;
    value: string | number | undefined;
    isLoading?: boolean;
    isDisable?: boolean;
  }[] = useMemo(() => {
    return [
      { label: 'Degens Owned', value: degenCount, isLoading: isLoadingDegens },
      // {
      //   label: 'Degens Rented',
      //   value: rentalCount,
      //   isLoading: isLoadingDegens,
      // },
      { label: 'Comics Owned', value: comicCount, isLoading: isLoadingComics },
      { label: 'Items Owned', value: itemCount, isLoading: isLoadingItems },
      { label: 'Keys Owned', value: keyCount, isLoading: isLoadingItems },
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
  }, [comicCount, degenCount, isLoadingComics, isLoadingDegens, isLoadingItems, itemCount, keyCount]);

  return (
    <Stack flex={1} spacing={1}>
      {rightDataMapper.map(child => (
        <Item key={child.label} {...child} />
      ))}
    </Stack>
  );
};

export default RightInfo;
