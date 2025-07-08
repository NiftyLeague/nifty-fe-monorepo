'use client';

import { Grid, Button } from '@mui/material';
import SectionSlider from '@/components/sections/SectionSlider';
import useVersion from '@/hooks/useVersion';
import GameList from './_GameList';
import Web3GameList from './_Web3GameList';

const GamesPage = () => {
  const { isWindows, isMacOs, downloadURL, version, message } = useVersion();
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
        actions={
          <Button href={downloadURL} disabled={isMacOs || !version} variant="outlined">
            {!version && isWindows ? 'Fetching installer version...' : message}
          </Button>
        }
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

export default GamesPage;
