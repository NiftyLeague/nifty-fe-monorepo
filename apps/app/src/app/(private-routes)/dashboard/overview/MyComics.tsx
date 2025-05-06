'use client';

/* eslint-disable no-nested-ternary */
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Box, Button, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import ComicCard from '@/components/cards/ComicCard';
import SectionSlider from '@/components/sections/SectionSlider';
import type { Comic } from '@/types/marketplace';
import EmptyState from '@/components/EmptyState';
import ViewComicDialog from '@/components/dialog/ViewComicDialog';
import useNFTsBalances from '@/hooks/balances/useNFTsBalances';
import ComicPlaceholder from '@/components/cards/Skeleton/ComicPlaceholder';
import { COMICS_PURCHASE_URL } from '@/constants/url';

const MyComics = (): React.ReactNode => {
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);
  const router = useRouter();
  const { comicsBalances, loadingComics } = useNFTsBalances();
  const filteredComics = useMemo(
    () => comicsBalances.filter(comic => comic.balance && comic.balance > 0),
    [comicsBalances],
  );

  const handleViewComic = (comic: Comic) => {
    setSelectedComic(comic);
  };

  const handleCloseDialog = () => {
    setSelectedComic(null);
  };

  const settings = {
    slidesToShow: 6,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 5,
        },
      },
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
        isSlider={filteredComics.length > 0}
        firstSection
        title="My Comics"
        variant="h3"
        sliderSettingsOverride={settings}
        actions={
          <Button variant="outlined" onClick={() => router.push('/dashboard/items')}>
            View All Comics
          </Button>
        }
      >
        {loadingComics ? (
          <Box px={1}>
            <ComicPlaceholder />
          </Box>
        ) : filteredComics.length ? (
          filteredComics.map(comic => (
            <Box px={1} key={comic.wearableName}>
              <ComicCard data={comic} onViewComic={() => handleViewComic(comic)} />
            </Box>
          ))
        ) : (
          <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
            <Link href={COMICS_PURCHASE_URL} target="_blank" rel="noreferrer">
              <EmptyState
                message="No Comics found. Please check your address or go purchase some if you have not done so already!"
                buttonText="Buy Comics"
              />
            </Link>
          </Stack>
        )}
      </SectionSlider>
      <ViewComicDialog comic={selectedComic} open={Boolean(selectedComic)} onClose={handleCloseDialog} />
    </>
  );
};

export default MyComics;
