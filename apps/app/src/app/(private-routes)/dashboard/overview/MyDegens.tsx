'use client';

/* eslint-disable no-nested-ternary */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import xor from 'lodash/xor';
import { v4 as uuidv4 } from 'uuid';
import { Box, Button, Grid2, Dialog, Stack } from '@mui/material';

import SectionSlider from '@/components/sections/SectionSlider';
import { DEGEN_BASE_API_URL, DEGEN_COLLECTION_URL, PROFILE_FAV_DEGENS_API } from '@/constants/url';
import SkeletonDegenPlaceholder from '@/components/cards/Skeleton/DegenPlaceholder';
import EmptyState from '@/components/EmptyState';
import DegenDialog from '@/components/dialog/DegenDialog';
import RenameDegenDialogContent from '@/app/(private-routes)/dashboard/degens/_dialogs/RenameDegenDialogContent';
import useNFTsBalances from '@/hooks/balances/useNFTsBalances';
import useFetch from '@/hooks/useFetch';
import { useProfileFavDegens } from '@/hooks/useGamerProfile';
import useAuth from '@/hooks/useAuth';
import type { Degen } from '@/types/degens';
import useLocalStorageContext from '@/hooks/useLocalStorageContext';

const DegenCard = dynamic(() => import('@/components/cards/DegenCard').then(module => module.DegenCardInView), {
  ssr: false,
});

const BoxDegenStyles = {
  px: 1,
  '& .MuiCardContent-root': {
    p: '12px',
  },
  '& .MuiTypography-h3': {
    fontSize: '16px',
  },
  '& .MuiCardActions-root': {
    p: '12px',
  },
};

const MyDegens = (): React.ReactNode => {
  const { authToken } = useAuth();
  const [selectedDegen, setSelectedDegen] = useState<Degen>();
  const [isRenameDegenModalOpen, setIsRenameDegenModalOpen] = useState<boolean>(false);
  const [isDegenModalOpen, setIsDegenModalOpen] = useState<boolean>(false);
  const [isClaimDialog, setIsClaimDialog] = useState<boolean>(false);
  const [isRentDialog, setIsRentDialog] = useState<boolean>(false);
  const router = useRouter();
  const { favs: favsData } = useProfileFavDegens();
  const { favDegens, setFavDegens } = useLocalStorageContext();

  useEffect(() => {
    if (favsData && favsData !== 'null') {
      setFavDegens(favsData.split(','));
    }
  }, [favsData, setFavDegens]);

  const { loadingDegens, degensBalances } = useNFTsBalances();

  const { data: degensData } = useFetch<Degen[]>(`${DEGEN_BASE_API_URL}/cache/rentals/rentables.json`);

  const filteredDegens = useMemo(() => {
    if (degensBalances.length && degensData) {
      return degensBalances.map(degen => degensData[Number(degen.id)]).filter(Boolean);
    }
    return [];
  }, [degensBalances, degensData]) as Degen[];

  const settings = {
    slidesToShow: 3,
    adaptiveHeight: false, // buggy behavior with degen cards
    responsive: [
      {
        breakpoint: 1350,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1019,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const handleClickEditName = (degen: Degen): void => {
    setSelectedDegen(degen);
    setIsRenameDegenModalOpen(true);
  };

  const handleViewTraits = (degen: Degen): void => {
    setSelectedDegen(degen);
    setIsClaimDialog(false);
    setIsRentDialog(false);
    setIsDegenModalOpen(true);
  };

  const handleClaimDegen = (degen: Degen): void => {
    setSelectedDegen(degen);
    setIsClaimDialog(true);
    setIsRentDialog(false);
    setIsDegenModalOpen(true);
  };

  const handleRentDegen = (degen: Degen): void => {
    setSelectedDegen(degen);
    setIsRentDialog(true);
    setIsClaimDialog(false);
    setIsDegenModalOpen(true);
  };

  const handleClickFavorite = useCallback(
    async (degen: Degen) => {
      const newFavs = xor(
        favDegens?.filter(f => f),
        [degen.id],
      );
      await fetch(`${PROFILE_FAV_DEGENS_API}`, {
        method: 'POST',
        body: JSON.stringify({
          favorites: newFavs.toString(),
        }),
        headers: {
          authorizationToken: authToken,
        } as any,
      });
      setFavDegens(newFavs);
    },
    [authToken, favDegens, setFavDegens],
  );

  return (
    <>
      <SectionSlider
        isSlider={filteredDegens.length > 0 && degensBalances.length > 0}
        firstSection
        title="My DEGENs"
        variant="h3"
        sliderSettingsOverride={settings}
        actions={
          <Button variant="outlined" onClick={() => router.push('/dashboard/degens')}>
            View All DEGENs
          </Button>
        }
        styles={{ mainRow: { height: 343, overflow: 'hidden' } }}
      >
        {loadingDegens ? (
          [...Array(8)].map(() => (
            <Grid2 size={{ xs: 12, sm: 11 }} key={uuidv4()}>
              <SkeletonDegenPlaceholder />
            </Grid2>
          ))
        ) : filteredDegens.length && degensBalances.length ? (
          filteredDegens.map(degen => (
            <Box sx={BoxDegenStyles} key={degen.id}>
              <DegenCard
                degen={degen}
                favs={favDegens}
                isDashboardDegen
                onClickClaim={() => handleClaimDegen(degen)}
                onClickDetail={() => handleViewTraits(degen)}
                onClickEditName={() => handleClickEditName(degen)}
                onClickFavorite={() => handleClickFavorite(degen)}
                onClickRent={() => handleRentDegen(degen)}
                size="small"
              />
            </Box>
          ))
        ) : (
          <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
            <Link href={DEGEN_COLLECTION_URL} target="_blank" rel="noreferrer">
              <EmptyState
                message="No DEGENs found. Please check your address or go purchase a DEGEN if you have not done so already!"
                buttonText="Buy a DEGEN"
              />
            </Link>
          </Stack>
        )}
      </SectionSlider>
      <DegenDialog
        open={isDegenModalOpen}
        degen={selectedDegen}
        isClaim={isClaimDialog}
        isRent={isRentDialog}
        setIsRent={setIsRentDialog}
        onClose={() => setIsDegenModalOpen(false)}
      />
      <Dialog open={isRenameDegenModalOpen} onClose={() => setIsRenameDegenModalOpen(false)}>
        <RenameDegenDialogContent degen={selectedDegen} onSuccess={() => setIsRenameDegenModalOpen(false)} />
      </Dialog>
    </>
  );
};

export default MyDegens;
