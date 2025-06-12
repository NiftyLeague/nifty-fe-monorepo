'use client';

import { useMemo } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import { useAccount } from 'wagmi';
import merge from 'lodash/merge';

import { useGamerProfile, useProfileAvatarFee } from '@/hooks/useGamerProfile';
import useFetch from '@/hooks/useFetch';
import useIMXContext from '@/hooks/useIMXContext';

import SectionSlider from '@/components/sections/SectionSlider';
import ImageProfile from './_ImageProfile';
import RightInfo from './_Stats/RightInfo';
import LeftInfo from './_Stats/LeftInfo';
import TopInfo from './_Stats/TopInfo';
import EmptyState from '@/components/EmptyState';
import BottomInfo from './_Stats/BottomInfo';

import { DEGEN_BASE_API_URL } from '@/constants/url';
import type { Degen } from '@/types/degens';
import useNFTsBalances from '@/hooks/balances/useNFTsBalances';
import { GamerProfileProvider } from '@/contexts/GamerProfileContext';

const defaultValue: {
  isLoadingProfile: boolean | undefined;
  isLoadingDegens: boolean | undefined;
  isLoadingComics: boolean | undefined;
} = { isLoadingProfile: true, isLoadingDegens: true, isLoadingComics: true };

const GamerProfile = (): React.ReactNode => {
  const { profile, error, loadingProfile } = useGamerProfile();
  const { address } = useAccount();
  const { avatarsAndFee } = useProfileAvatarFee();
  const { data } = useFetch<Degen[]>(`${DEGEN_BASE_API_URL}/cache/rentals/rentables.json`);

  const { comicsBalances, degenCount, degensBalances, itemsBalances } = useNFTsBalances();

  const filteredDegens: Degen[] = useMemo(() => {
    if (degensBalances.length && data) {
      const mapDegens = degensBalances.map(degen => data[Number(degen.id)]) as Degen[];
      return mapDegens;
    }
    return [];
  }, [degensBalances, data]);

  const filteredComics = useMemo(
    () => comicsBalances.filter(comic => comic.balance && comic.balance > 0),
    [comicsBalances],
  );

  const filteredItems = useMemo(
    () => itemsBalances.filter(item => !item.title.includes('Key') && item.balance && item.balance > 0),
    [itemsBalances],
  );
  const filteredKeys = useMemo(
    () => itemsBalances.filter(item => item.title.includes('Key') && item.balance && item.balance > 0),
    [itemsBalances],
  );

  const renderEmptyProfile = () => {
    return (
      <Grid container size={12} sx={{ justifyContent: 'center', alignItems: 'center' }} display="flex" height="100%">
        <EmptyState message="You don't own any Gamer Profile yet." />
      </Grid>
    );
  };

  const renderTopProfile = () => {
    return (
      <Grid container size={12} spacing={3} className="bg-background-3 p-8 rounded-md">
        <Grid size={{ xs: 12, md: 3.5 }}>
          <ImageProfile
            avatar={profile?.avatar}
            avatarFee={avatarsAndFee?.price}
            degens={filteredDegens && avatarsAndFee?.avatars && merge(filteredDegens, avatarsAndFee?.avatars)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 8.5 }}>
          {address && <TopInfo profile={profile} walletAddress={address} />}
          <hr className="mb-4" />
          <Stack spacing={2}>
            <Stack>
              <Typography variant="h3" component="div">
                Nifty League Player Stats
              </Typography>
            </Stack>
            <Stack direction="row" spacing={5}>
              <LeftInfo data={profile?.stats?.total} />
              <RightInfo
                comicCount={filteredComics?.reduce((prev, cur) => prev + Number(cur?.balance), 0)}
                degenCount={degenCount}
                itemCount={filteredItems?.reduce((prev, cur) => prev + Number(cur?.balance), 0)}
                keyCount={filteredKeys?.reduce((prev, cur) => prev + Number(cur?.balance), 0)}
                rentalCount={filteredDegens.length - degenCount}
              />
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    );
  };

  const renderBottomProfile = () => {
    const sliderSettingsOverride = {
      slidesToShow: 3,
      responsive: [
        { breakpoint: 1700, settings: { slidesToShow: 3 } },
        { breakpoint: 1280, settings: { slidesToShow: 3 } },
        { breakpoint: 900, settings: { slidesToShow: 2 } },
        { breakpoint: 600, settings: { slidesToShow: 1 } },
      ],
    };
    return (
      <SectionSlider
        firstSection
        variant="h3"
        title="Player Stats by Web3 Game"
        isSlider={false}
        sliderSettingsOverride={sliderSettingsOverride}
        styles={{ root: { width: '100%' } }}
      >
        <BottomInfo
          nifty_smashers={profile?.stats?.nifty_smashers}
          wen_game={profile?.stats?.wen_game}
          crypto_winter={profile?.stats?.crypto_winter}
        />
      </SectionSlider>
    );
  };

  const renderGamerProfile = () => {
    return (
      <GamerProfileProvider>
        {renderTopProfile()}
        {renderBottomProfile()}
      </GamerProfileProvider>
    );
  };
  return (
    <Grid container gap={4} mb="24px">
      {error && !profile && !loadingProfile && renderEmptyProfile()}
      {(profile || loadingProfile) && renderGamerProfile()}
    </Grid>
  );
};

export default GamerProfile;
