'use client';

import { Grid2 } from '@mui/material';
import { sectionSpacing } from '@nl/theme';

import ArcadeBalance from './ArcadeBalance';
import DegenBalance from './DegenBalance';
import GameBalance from './GameBalance';
import WalletBalance from './WalletBalance';

const MyNFTL = (): JSX.Element => (
  <Grid2 container spacing={sectionSpacing}>
    <Grid2 size={{ xs: 12 }}>
      <WalletBalance />
    </Grid2>
    <Grid2 container size={{ xs: 12 }} spacing={sectionSpacing}>
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <GameBalance />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <DegenBalance />
      </Grid2>
    </Grid2>
    <Grid2 size={{ xs: 12 }}>
      <ArcadeBalance />
    </Grid2>
  </Grid2>
);

export default MyNFTL;
