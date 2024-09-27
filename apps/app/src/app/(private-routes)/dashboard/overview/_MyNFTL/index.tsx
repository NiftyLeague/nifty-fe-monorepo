'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Grid2, IconButton, Skeleton, Stack, Typography } from '@mui/material';
import { useTheme, sectionSpacing } from '@nl/theme';
import type { TransactionResponse } from 'ethers6';
import Image from 'next/image';

import { BALANCE_MANAGER_CONTRACT, NFTL_CONTRACT } from '@/constants/contracts';
import { DEBUG } from '@/constants/index';
import { formatNumberToDisplay } from '@/utils/numbers';
import { GOOGLE_ANALYTICS } from '@/constants/google-analytics';
import { sendEvent } from '@/utils/google-analytics';

import useBalances from '@/hooks/useBalances';
import useGameAccount from '@/hooks/useGameAccount';
import useNetworkContext from '@/hooks/useNetworkContext';

import { Dialog, DialogTrigger, DialogContent } from '@/components/dialog';
import BuyArcadeTokensDialog from '@/components/dialog/BuyArcadeTokensDialog';
import HoverDataCard from '@/components/cards/HoverDataCard';
import SectionTitle from '@/components/sections/SectionTitle';
import TokenInfoCard from '@/components/cards/TokenInfoCard';
import WithdrawForm from './WithdrawForm';

const MyNFTL = (): JSX.Element => {
  const theme = useTheme();
  const router = useRouter();
  const { address, writeContracts, tx } = useNetworkContext();
  const [openBuyAT, setOpenBuyAT] = useState(false);
  const { account, loadingAccount, accountError } = useGameAccount();

  const [mockAccrued, setMockAccrued] = useState(0);
  const {
    arcadeBalance,
    loadingArcadeBal,
    loadingNFTLBal,
    loadingNFTLAccrued,
    refetchArcadeBal,
    refreshClaimableNFTL,
    tokenIndices,
    totalAccrued,
    userNFTLBalance,
  } = useBalances();

  useEffect(() => {
    if (totalAccrued) setMockAccrued(totalAccrued);
  }, [totalAccrued]);

  const handleClaimNFTL = useCallback(async () => {
    // eslint-disable-next-line no-console
    if (DEBUG) console.log('claim', tokenIndices, totalAccrued);
    const nftl = writeContracts[NFTL_CONTRACT];
    const res = await tx(nftl.claim(tokenIndices));
    if (res) {
      setMockAccrued(0);
      setTimeout(refreshClaimableNFTL, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenIndices, totalAccrued, tx, writeContracts]);

  const handleWithdrawNFTL = useCallback(
    async (amount: number): Promise<{ txRes: TransactionResponse | null; error?: Error | undefined }> => {
      return { txRes: null, error: undefined };
    },
    [],
  );

  const handleBuyArcadeTokens = () => {
    setOpenBuyAT(true);
  };

  const handlePlayArcade = useCallback(() => {
    sendEvent(GOOGLE_ANALYTICS.EVENTS.PLAY_ARCADE_GAMES_BUTTON_TAPPED, GOOGLE_ANALYTICS.CATEGORIES.GAMEPLAY);
    router.push('/games');
  }, [router]);

  return (
    <Grid2 container spacing={sectionSpacing}>
      <Grid2 size={{ xs: 12 }}>
        <SectionTitle
          firstSection
          variant="h3"
          actions={
            <Stack direction="row" gap={2}>
              {loadingNFTLBal ? (
                <Skeleton variant="rectangular" animation="wave" width={120} height={40} />
              ) : (
                <Typography variant="body1" fontWeight="bold">
                  NFTL in Wallet: {formatNumberToDisplay(userNFTLBalance)}
                </Typography>
              )}
            </Stack>
          }
        >
          My Tokens
        </SectionTitle>
      </Grid2>
      <Grid2 container size={{ xs: 12 }} spacing={sectionSpacing}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <HoverDataCard
            title="Game Balance"
            primary={`${
              accountError
                ? 'Error fetching balance'
                : `${account ? formatNumberToDisplay(account?.balance! ?? 0) : '0.00'} NFTL`
            }`}
            isLoading={loadingAccount}
            customStyle={{
              backgroundColor: theme.palette.background.default,
              border: '1px solid',
              borderColor: theme.palette.border,
              position: 'relative',
            }}
            secondary="Available Balance"
            actions={
              <>
                <IconButton disabled color="primary" component="span" sx={{ position: 'absolute', top: -2, right: -2 }}>
                  <Image src="/img/logos/passport/32px.svg" alt="Immutable" width={22} height={22} />
                </IconButton>
                <Dialog>
                  <DialogTrigger>
                    <Button fullWidth variant="contained" disabled={!account?.balance || account.balance === 0}>
                      Withdraw
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    aria-labelledby="customized-dialog-title"
                    dialogTitle="Withdraw Earnings"
                    sx={{
                      '& h2': { textAlign: 'center' },
                      '& .MuiDialogContent-root': { textAlign: 'center' },
                    }}
                  >
                    <WithdrawForm balance={account?.balance! || 0} onWithdrawEarnings={handleWithdrawNFTL} />
                  </DialogContent>
                </Dialog>
              </>
            }
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <HoverDataCard
            title="DEGEN Balance"
            primary={`${mockAccrued ? formatNumberToDisplay(mockAccrued) : '0.00'} NFTL`}
            customStyle={{
              backgroundColor: theme.palette.background.default,
              border: '1px solid',
              borderColor: theme.palette.border,
              position: 'relative',
            }}
            secondary="Available to Claim"
            isLoading={loadingNFTLAccrued}
            actions={
              <>
                <IconButton disabled color="primary" component="span" sx={{ position: 'absolute', top: -2, right: -2 }}>
                  <Image src="/icons/eth.svg" alt="Ethereum" width={22} height={22} />
                </IconButton>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={!(mockAccrued > 0.0 && writeContracts[NFTL_CONTRACT])}
                  onClick={handleClaimNFTL}
                >
                  Claim NFTL
                </Button>
              </>
            }
          />
        </Grid2>
      </Grid2>
      <>
        <Grid2 size={{ xs: 12 }}>
          <TokenInfoCard
            title="Arcade Token Balance"
            secondary={`${arcadeBalance} Tokens`}
            isLoading={loadingArcadeBal}
            customStyle={{
              backgroundColor: theme.palette.background.default,
              border: '1px solid',
              borderColor: theme.palette.border,
              borderRadius: '8px',
            }}
            actions={
              <Stack
                direction="row"
                sx={{ alignItems: 'center' }}
                spacing={1}
                paddingX={{ xl: 1, xs: 3 }}
                paddingY={{ xl: 0.5, xs: 1.5 }}
              >
                <Button fullWidth variant="contained" onClick={handleBuyArcadeTokens}>
                  Buy Tokens
                </Button>
                <Button fullWidth variant="outlined" onClick={handlePlayArcade}>
                  Play Arcade Games
                </Button>
              </Stack>
            }
          />
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
    </Grid2>
  );
};

export default MyNFTL;
