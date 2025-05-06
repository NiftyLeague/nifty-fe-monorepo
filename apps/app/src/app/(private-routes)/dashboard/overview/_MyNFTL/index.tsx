'use client';

import { Grid } from '@mui/material';
import { sectionSpacing } from '@nl/theme';

import ArcadeBalance from './ArcadeBalance';
import DegenBalance from './DegenBalance';
import GameBalance from './GameBalance';
import TitleSection from './TitleSection';
import WalletBalances from './WalletBalances';

const MyNFTL = (): React.ReactNode => (
  <Grid container spacing={sectionSpacing}>
    <Grid size={{ xs: 12 }} sx={{ mt: '8px', mb: '4px' }}>
      <TitleSection />
    </Grid>
    <Grid container size={{ xs: 12 }} spacing={sectionSpacing}>
      <WalletBalances />
    </Grid>
    <Grid container size={{ xs: 12 }} spacing={sectionSpacing}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <GameBalance />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <DegenBalance />
      </Grid>
    </Grid>
    <Grid size={{ xs: 12 }}>
      <ArcadeBalance />
    </Grid>
  </Grid>
);

export default MyNFTL;
