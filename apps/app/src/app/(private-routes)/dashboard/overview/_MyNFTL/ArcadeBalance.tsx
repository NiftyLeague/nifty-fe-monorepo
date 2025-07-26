'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Stack } from '@mui/material';

import { gtm, GTM_EVENTS } from '@nl/ui/gtm';
import useTokensBalances from '@/hooks/balances/useTokensBalances';

import BuyArcadeTokensDialog from '@/components/dialog/BuyArcadeTokensDialog';
import HoverDataCard from '@/components/cards/HoverDataCard';

const ArcadeBalance = (): React.ReactNode => {
  const router = useRouter();
  const { tokensBalances, loadingArcadeBal, refetchArcadeBal } = useTokensBalances();
  const [openBuyAT, setOpenBuyAT] = useState(false);

  const handleBuyArcadeTokens = () => {
    setOpenBuyAT(true);
  };

  const handlePlayArcade = useCallback(() => {
    gtm.sendEvent(GTM_EVENTS.PLAY_ARCADE_GAMES_BUTTON_TAPPED);
    router.push('/games');
  }, [router]);

  return (
    <>
      <HoverDataCard
        title="Arcade Token Balance"
        primary={`${tokensBalances.AT} Tokens`}
        customStyle={{ backgroundColor: 'var(--color-card)', border: 'var(--border-default)', position: 'relative' }}
        secondary=" "
        isLoading={loadingArcadeBal}
        actions={
          <>
            <Stack direction="row" className="w-full items-center" spacing={1}>
              <Button fullWidth variant="outlined" onClick={handleBuyArcadeTokens}>
                Buy Tokens
              </Button>
              <Button fullWidth variant="contained" onClick={handlePlayArcade}>
                Play Games
              </Button>
            </Stack>
          </>
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
