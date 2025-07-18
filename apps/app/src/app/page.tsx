'use client';

// import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
// import { Grid, Button, Box, Dialog } from '@mui/material';
// import Link from 'next/link';
// import dynamic from 'next/dynamic';

import SectionSlider from '@/components/sections/SectionSlider';
// import type { Degen } from '@/types/degens';
// import { DEGEN_BASE_API_URL } from '@/constants/url';
// import useFetch from '@/hooks/useFetch';
// import SkeletonDegenPlaceholder from '@/components/cards/Skeleton/DegenPlaceholder';
// import { v4 as uuidv4 } from 'uuid';
import GameList from '@/app/(public-routes)/games/_GameList';
import Web3GameList from '@/app/(public-routes)/games/_Web3GameList';
// import DegenDialog from '@/components/dialog/DegenDialog';
// import RenameDegenDialogContent from '@/app/(private-routes)/dashboard/degens/_dialogs/RenameDegenDialogContent';

// const DegenCard = dynamic(() => import('@/components/cards/DegenCard').then(module => module.DegenCardInView), {
//   ssr: false,
// });

const Home = () => {
  // const [degens, setDegens] = useState<Degen[]>([]);
  // const [selectedDegen, setSelectedDegen] = useState<Degen>();
  // const [isRenameDegenModalOpen, setIsRenameDegenModalOpen] = useState<boolean>(false);
  // const [isDegenModalOpen, setIsDegenModalOpen] = useState<boolean>(false);
  // const [isRentDialog, setIsRentDialog] = useState<boolean>(false);

  // const { data } = useFetch<Degen[]>(`${DEGEN_BASE_API_URL}/cache/rentals/rentables.json`);

  // useEffect(() => {
  //   if (data) {
  //     const degensArray = Object.values(data);
  //     const sortDegens = degensArray
  //       .filter(degen => degen.rental_count > 0)
  //       .sort((degenA, degenB) => degenB.rental_count - degenA.rental_count)
  //       .slice(0, 100);
  //     setDegens(sortDegens);
  //   }
  //   return () => {
  //     setDegens([]);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data]);

  // const handleClickEditName = (degen: Degen): void => {
  //   setSelectedDegen(degen);
  //   setIsRenameDegenModalOpen(true);
  // };

  // const handleViewTraits = (degen: Degen): void => {
  //   setSelectedDegen(degen);
  //   setIsRentDialog(false);
  //   setIsDegenModalOpen(true);
  // };

  // const handleRentDegen = (degen: Degen): void => {
  //   setSelectedDegen(degen);
  //   setIsRentDialog(true);
  //   setIsDegenModalOpen(true);
  // };

  // const handleViewAllTraits = (event: React.MouseEvent<HTMLAnchorElement>) => {};

  // const settings = {
  //   slidesToShow: 5,
  //   responsive: [
  //     {
  //       breakpoint: 1536,
  //       settings: {
  //         slidesToShow: 4,
  //       },
  //     },
  //     {
  //       breakpoint: 1280,
  //       settings: {
  //         slidesToShow: 3,
  //       },
  //     },
  //     {
  //       breakpoint: 1024,
  //       settings: {
  //         slidesToShow: 2,
  //       },
  //     },
  //     {
  //       breakpoint: 640,
  //       settings: {
  //         slidesToShow: 1,
  //       },
  //     },
  //   ],
  // };

  return (
    <>
      <SectionSlider firstSection title="Free-2-Play Games" isSlider={false}>
        <Grid
          container
          flexDirection="row"
          flexWrap="wrap"
          rowSpacing={{ xs: 4, sm: 0 }}
          paddingBottom={{ xs: 8, sm: 4, md: 0 }}
        >
          <GameList />
        </Grid>
      </SectionSlider>
      <SectionSlider
        firstSection
        title="Web3 Games"
        isSlider={false}
        // actions={
        //   <Box sx={{ '& a': { textDecoration: 'none' } }}>
        //     <Link href="/games">
        //       <Button variant="outlined">View All Games</Button>
        //     </Link>
        //   </Box>
        // }
      >
        <Grid
          container
          flexDirection="row"
          flexWrap="wrap"
          rowSpacing={{ xs: 4, sm: 0 }}
          paddingBottom={{ xs: 8, sm: 4, md: 0 }}
        >
          <Web3GameList />
        </Grid>
      </SectionSlider>
      {/* <SectionSlider
        title="Degens"
        actions={
          <Box sx={{ '& a': { textDecoration: 'none' } }}>
            <Link href="/degens" onClick={handleViewAllTraits}>
              <Button variant="outlined">View All Degens</Button>
            </Link>
          </Box>
        }
        sliderSettingsOverride={settings}
      >
        {!degens.length
          ? [...Array(4)].map(() => (
              <Box paddingRight={2} key={uuidv4()}>
                <SkeletonDegenPlaceholder />
              </Box>
            ))
          : degens.map(degen => (
              <Box paddingRight={2} key={degen.id}>
                <DegenCard
                  degen={degen}
                  onClickDetail={() => handleViewTraits(degen)}
                  onClickEditName={() => handleClickEditName(degen)}
                  onClickRent={() => handleRentDegen(degen)}
                />
              </Box>
            ))}
      </SectionSlider>
      <DegenDialog
        open={isDegenModalOpen}
        degen={selectedDegen}
        isRent={isRentDialog}
        setIsRent={setIsRentDialog}
        onClose={() => setIsDegenModalOpen(false)}
      />
      <Dialog open={isRenameDegenModalOpen} onClose={() => setIsRenameDegenModalOpen(false)}>
        <RenameDegenDialogContent degen={selectedDegen} onSuccess={() => setIsRenameDegenModalOpen(false)} />
      </Dialog> */}
    </>
  );
};

export default Home;
