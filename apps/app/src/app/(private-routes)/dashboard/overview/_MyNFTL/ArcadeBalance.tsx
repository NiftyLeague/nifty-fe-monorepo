'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Stack } from '@mui/material';
import { useTheme } from '@nl/theme';

import { GOOGLE_ANALYTICS } from '@/constants/google-analytics';
import { sendEvent } from '@/utils/google-analytics';
import useTokensBalances from '@/hooks/balances/useTokensBalances';

import BuyArcadeTokensDialog from '@/components/dialog/BuyArcadeTokensDialog';
import TokenInfoCard from '@/components/cards/TokenInfoCard';

const ArcadeBalance = (): React.ReactNode => {
  const theme = useTheme();
  const router = useRouter();
  const { tokensBalances, loadingArcadeBal, refetchArcadeBal } = useTokensBalances();
  const [openBuyAT, setOpenBuyAT] = useState(false);

  const handleBuyArcadeTokens = () => {
    setOpenBuyAT(true);
  };

  const handlePlayArcade = useCallback(() => {
    sendEvent(GOOGLE_ANALYTICS.EVENTS.PLAY_ARCADE_GAMES_BUTTON_TAPPED, GOOGLE_ANALYTICS.CATEGORIES.GAMEPLAY);
    router.push('/games');
  }, [router]);

  return (
    <>
      <TokenInfoCard
        title="Arcade Token Balance"
        secondary={`${tokensBalances.AT} Tokens`}
        isLoading={loadingArcadeBal}
        customStyle={{
          backgroundColor: theme.palette.background.default,
          border: 'var(--border-light)',
          borderRadius: 'var(--border-radius-default)',
        }}
        actions={
          <Stack
            direction="row"
            sx={{ alignItems: 'center' }}
            spacing={1}
            paddingX={{ xl: 1, xs: 3 }}
            paddingY={{ xl: 0.5, xs: 1.5 }}
          >
            <Button fullWidth variant="outlined" onClick={handlePlayArcade}>
              Play Arcade Games
            </Button>
            <Button fullWidth variant="contained" onClick={handleBuyArcadeTokens}>
              Buy Tokens
            </Button>
          </Stack>
        }
      />
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

export default ArcadeBalance;
