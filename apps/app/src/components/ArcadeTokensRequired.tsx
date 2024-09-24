'use client';

import { useState } from 'react';
import { Button, Grid2, Typography } from '@mui/material';
import { gridSpacing } from '@nl/theme';
import BuyArcadeTokensDialog from '@/components/dialog/BuyArcadeTokensDialog';

interface ArcadeTokensRequiredProps {
  refetchArcadeBal: () => void;
}

const ArcadeTokensRequired: React.FC<ArcadeTokensRequiredProps> = ({ refetchArcadeBal }) => {
  const [openBuyAT, setOpenBuyAT] = useState(false);

  const handleBuyArcadeTokens = () => {
    // TODO: Integrate Buy Arcade Tokens here
    setOpenBuyAT(true);
  };

  return (
    <>
      <Grid2 container height="100%" alignItems="center" spacing={gridSpacing}>
        <Grid2 size={{ xs: 12 }}>
          <Grid2 container spacing={gridSpacing}>
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="h1" component="div" textAlign="center">
                Arcade Tokens Required
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12 }} textAlign="center">
              <Button variant="outlined" color="primary" onClick={handleBuyArcadeTokens}>
                Buy Arcade Tokens
              </Button>
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
      <BuyArcadeTokensDialog
        open={openBuyAT}
        onSuccess={() => {
          setOpenBuyAT(false);
          refetchArcadeBal();
        }}
        onClose={() => setOpenBuyAT(false)}
      />
    </>
  );
};

export default ArcadeTokensRequired;
