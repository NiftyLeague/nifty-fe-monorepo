import { useMemo } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import useIMXContext from '@/hooks/useIMXContext';
import WearableItemCard from '@/components/cards/WearableItemCard';
import SectionSlider from '@/components/sections/SectionSlider';
import EmptyState from '@/components/EmptyState';
import ComicPlaceholder from '@/components/cards/Skeleton/ComicPlaceholder';
import { ITEM_PURCHASE_URL } from '@/constants/url';

const MyItems = (): JSX.Element => {
  const router = useRouter();
  const { itemsBalance, itemsLoading } = useIMXContext();
  const filteredItems = useMemo(() => itemsBalance.filter(item => item.balance && item.balance > 0), [itemsBalance]);

  const settings = {
    slidesToShow: 4,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1750,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1350,
        settings: {
          slidesToShow: 7,
        },
      },
      {
        breakpoint: 1200,
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
      {
        breakpoint: 525,
        settings: {
          slidesToShow: 3,
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
        {itemsLoading ? (
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
