'use client';

import { useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { gridSpacing } from '@/theme/constants';
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
      <Grid container height="100%" alignItems="center" spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Typography variant="h1" component="div" textAlign="center">
                Arcade Tokens Required
              </Typography>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Button variant="outlined" color="primary" onClick={handleBuyArcadeTokens}>
                Buy Arcade Tokens
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
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
