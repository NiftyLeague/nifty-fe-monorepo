'use client';

import { Grid } from '@mui/material';
import SectionSlider from '@/components/sections/SectionSlider';
import GameList from '@/app/(public-routes)/games/_GameList';
import Web3GameList from '@/app/(public-routes)/games/_Web3GameList';

const Home = () => {
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
        //   <Link href="/games">
        //     <Button variant="outlined">View All Games</Button>
        //   </Link>
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
    </>
  );
};

export default Home;
