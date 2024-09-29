import { useMemo } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import useNFTsBalances from '@/hooks/balances/useNFTsBalances';
import WearableItemCard from '@/components/cards/WearableItemCard';
import SectionSlider from '@/components/sections/SectionSlider';
import EmptyState from '@/components/EmptyState';
import ComicPlaceholder from '@/components/cards/Skeleton/ComicPlaceholder';
import { ITEM_PURCHASE_URL } from '@/constants/url';

const MyItems = (): JSX.Element => {
  const router = useRouter();
  const { itemsBalances, loadingItems } = useNFTsBalances();
  const filteredItems = useMemo(() => itemsBalances.filter(item => item.balance && item.balance > 0), [itemsBalances]);

  const settings = {
    slidesToShow: 4,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1350,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1019,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
        },
      },
    ],
  };

  return (
    <>
      <SectionSlider
        isSlider={filteredItems.length > 0}
        firstSection
        title="My Items"
        variant="h3"
        sliderSettingsOverride={settings}
        actions={
          <Button variant="outlined" onClick={() => router.push('/dashboard/items')}>
            View All Items
          </Button>
        }
      >
        {loadingItems ? (
          <Box px={1}>
            <ComicPlaceholder />
          </Box>
        ) : filteredItems.length ? (
          filteredItems.map(item => (
            <Box px={1} key={item.wearableName}>
              <WearableItemCard data={item} />
            </Box>
          ))
        ) : (
          <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
            <Link href={ITEM_PURCHASE_URL} target="_blank" rel="noreferrer">
              <EmptyState
                message="No Items found. Please check your address or go purchase some if you have not done so already!"
                buttonText="Buy Items"
              />
            </Link>
          </Stack>
        )}
      </SectionSlider>
    </>
  );
};

export default MyItems;
