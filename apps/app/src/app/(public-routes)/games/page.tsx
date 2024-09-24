'use client';

import { Grid2, Button } from '@mui/material';
import SectionSlider from '@/components/sections/SectionSlider';
import useVersion from '@/hooks/useVersion';
import GameList from './_GameList';

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
        <Grid2 container flexDirection="row" flexWrap="wrap" rowSpacing={4}>
          <GameList />
        </Grid2>
      </SectionSlider>
    </>
  );
};

export default GamesPage;
