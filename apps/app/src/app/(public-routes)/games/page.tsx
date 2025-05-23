'use client';

import { Grid, Button } from '@mui/material';
import SectionSlider from '@/components/sections/SectionSlider';
import useVersion from '@/hooks/useVersion';
import Web3GameList from './_Web3GameList';

const GamesPage = () => {
  const { isWindows, isMacOs, downloadURL, version, message } = useVersion();
  return (
    <>
      <SectionSlider
        firstSection
        isSlider={false}
        title="Games"
        actions={
          <Button href={downloadURL} disabled={isMacOs || !version} variant="outlined">
            {!version && isWindows ? 'Fetching installer version...' : message}
          </Button>
        }
      >
        <Grid container flexDirection="row" flexWrap="wrap" rowSpacing={4}>
          <Web3GameList />
        </Grid>
      </SectionSlider>
    </>
  );
};

export default GamesPage;
