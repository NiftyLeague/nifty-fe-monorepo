'use client';

import { useMemo } from 'react';
import { Grid2, Stack, Typography } from '@mui/material';
import { useAccount } from 'wagmi';
import merge from 'lodash/merge';

import { useGamerProfile, useProfileAvatarFee } from '@/hooks/useGamerProfile';
import useFetch from '@/hooks/useFetch';
import useComicsBalance from '@/hooks/useComicsBalance';

import SectionSlider from '@/components/sections/SectionSlider';
import ImageProfile from './_ImageProfile';
import RightInfo from './_Stats/RightInfo';
import LeftInfo from './_Stats/LeftInfo';
import TopInfo from './_Stats/TopInfo';
import EmptyState from '@/components/EmptyState';
import BottomInfo from './_Stats/BottomInfo';

import { DEGEN_BASE_API_URL } from '@/constants/url';
import type { Degen } from '@/types/degens';
import { sectionSpacing } from '@nl/theme';
import useBalances from '@/hooks/useBalances';
import { GamerProfileProvider } from '@/contexts/GamerProfileContext';

const defaultValue: {
  isLoadingProfile: boolean | undefined;
  isLoadingDegens: boolean | undefined;
  isLoadingComics: boolean | undefined;
} = {
  isLoadingProfile: true,
  isLoadingDegens: true,
  isLoadingComics: true,
};

const GamerProfile = (): JSX.Element => {
  const { profile, error, loadingProfile } = useGamerProfile();
  const { address } = useAccount();
  const { avatarsAndFee } = useProfileAvatarFee();
  const { comicsBalance, loading: loadingComics } = useComicsBalance();
  const { data } = useFetch<Degen[]>(`${DEGEN_BASE_API_URL}/cache/rentals/rentables.json`);

  const { loadingDegens, characters, characterCount: degenCount } = useBalances();

  const filteredDegens: Degen[] = useMemo(() => {
    if (characters.length && data) {
      const mapDegens = characters.map(character => data[Number(character.id)]) as Degen[];
      return mapDegens;
    }
    return [];
  }, [characters, data]);

  const filteredComics = useMemo(
    () => comicsBalance.filter(comic => comic.balance && comic.balance > 0),
    [comicsBalance],
  );

  const renderEmptyProfile = () => {
    return (
      <Grid2 container justifyContent="center" alignItems="center" display="flex" height="100%">
        <EmptyState message="You don't own any Gamer Profile yet." />
      </Grid2>
    );
  };

  const renderTopProfile = () => {
    return (
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 3.5 }}>
          <ImageProfile
            avatar={profile?.avatar}
            avatarFee={avatarsAndFee?.price}
            degens={filteredDegens && avatarsAndFee?.avatars && merge(filteredDegens, avatarsAndFee?.avatars)}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 8.5 }}>
          {address && <TopInfo profile={profile} walletAddress={address} />}
          <hr />
          <Stack spacing={1}>
            <Stack>
              <Typography variant="h3" component="div">
                Nifty League Player Stats
              </Typography>
            </Stack>
            <Stack direction="row" spacing={5}>
              <LeftInfo data={profile?.stats?.total} />
              <RightInfo
                degenCount={degenCount}
                rentalCount={filteredDegens.length - degenCount}
                comicCount={filteredComics?.reduce((prev, cur) => prev + Number(cur?.balance), 0)}
              />
            </Stack>
          </Stack>
        </Grid2>
      </Grid2>
    );
  };

  const renderBottomProfile = () => {
    return (
      <SectionSlider firstSection variant="h3" title="Player Stats by Game" isSlider={false}>
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
    <Grid2 container gap={sectionSpacing} mb="24px">
      {error && !profile && !loadingProfile && renderEmptyProfile()}
      {(profile || loadingProfile) && renderGamerProfile()}
    </Grid2>
  );
};

export default GamerProfile;
