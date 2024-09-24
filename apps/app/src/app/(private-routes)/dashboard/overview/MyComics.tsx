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
import useIMXContext from '@/hooks/useIMXContext';
import ComicPlaceholder from '@/components/cards/Skeleton/ComicPlaceholder';
import { COMICS_PURCHASE_URL } from '@/constants/url';

const MyComics = (): JSX.Element => {
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);
  const router = useRouter();
  const { comicsBalance, comicsLoading } = useIMXContext();
  const filteredComics = useMemo(
    () => comicsBalance.filter(comic => comic.balance && comic.balance > 0),
    [comicsBalance],
  );

  const handleViewComic = (comic: Comic) => {
    setSelectedComic(comic);
  };

  const handleCloseDialog = () => {
    setSelectedComic(null);
  };

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
          slidesToShow: 6,
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
        {comicsLoading ? (
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
          <Stack justifyContent="center" alignItems="center">
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
