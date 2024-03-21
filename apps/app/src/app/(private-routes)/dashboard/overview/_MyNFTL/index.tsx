'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Button, Stack, Skeleton, IconButton, Typography } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { useTheme, sectionSpacing } from '@nl/theme';
import { type TransactionResponse, parseEther } from 'ethers6';

import SectionTitle from '@/components/sections/SectionTitle';
import HoverDataCard from '@/components/cards/HoverDataCard';
import { Dialog, DialogTrigger, DialogContent } from '@/components/dialog';
import useNetworkContext from '@/hooks/useNetworkContext';
import useGameAccount from '@/hooks/useGameAccount';
import { formatNumberToDisplay } from '@/utils/numbers';
import { GAME_ACCOUNT_CONTRACT, NFTL_CONTRACT } from '@/constants/contracts';
import { DEBUG } from '@/constants/index';
import { WITHDRAW_NFTL_SIGN, WITHDRAW_NFTL_REFRESH } from '@/constants/url';
import DepositForm from './DepositForm';
import RefreshBalanceForm from './RefreshBalanceForm';
import WithdrawForm from './WithdrawForm';
import TokenInfoCard from '@/components/cards/TokenInfoCard';
import BuyArcadeTokensDialog from '@/components/dialog/BuyArcadeTokensDialog';
import { sendEvent } from '@/utils/google-analytics';
import { GOOGLE_ANALYTICS } from '@/constants/google-analytics';
import useBalances from '@/hooks/useBalances';
import useAuth from '@/hooks/useAuth';

const MyNFTL = (): JSX.Element => {
  const theme = useTheme();
  const { authToken } = useAuth();
  const router = useRouter();
  const { address, writeContracts, tx } = useNetworkContext();
  const [refreshTimeout, setRefreshTimeout] = useState(0);
  const [refreshAccKey, setRefreshAccKey] = useState(0);
  const [openBuyAT, setOpenBuyAT] = useState(false);
  const { account, error: accError } = useGameAccount(refreshAccKey);

  const [mockAccrued, setMockAccrued] = useState(0);
  const {
    arcadeBalance,
    loadingArcadeBal,
    loadingNFTLBal,
    loadingNFTLAccrued,
    refetchArcadeBal,
    refreshClaimableNFTL,
    refreshNFTLBalance,
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

  const handleDepositNFTL = useCallback(
    async (amount: number) => {
      // eslint-disable-next-line no-console
      if (DEBUG) console.log('deposit', amount);
      const txRes = await tx(writeContracts[GAME_ACCOUNT_CONTRACT].deposit(parseEther(`${amount}`)));
      setRefreshAccKey(Math.random());
      refreshNFTLBalance();
      return txRes;
    },
    [tx, writeContracts, refreshNFTLBalance],
  );

  const handleWithdrawNFTL = useCallback(
    async (
      amount: number,
    ): Promise<{
      txRes: TransactionResponse | null;
      error?: Error;
    }> => {
      const amountWEI = parseEther(`${amount}`);
      const body = JSON.stringify({
        amount: amountWEI.toString(),
        address,
      });
      try {
        const response = await fetch(WITHDRAW_NFTL_SIGN, {
          headers: { authorizationToken: authToken as string },
          method: 'POST',
          body,
        });
        if (!response.ok) {
          const errMsg = await response.text();
          throw new Error(errMsg);
        }
        const signData = await response.json();
        // eslint-disable-next-line no-console
        if (DEBUG) console.log('SIG_REQ_DATA', signData);
        const { expire_at, signature, nonce } = signData as {
          expire_at: number;
          signature: string;
          nonce: number;
        };
        const txRes = await tx(
          writeContracts[GAME_ACCOUNT_CONTRACT].withdraw(amountWEI, BigInt(nonce), expire_at, signature),
        );
        // eslint-disable-next-line no-console
        if (DEBUG) console.log('TX_DATA', txRes);
        refreshNFTLBalance();
        setRefreshAccKey(Math.random());
        return { txRes };
      } catch (error) {
        console.error('error', error);
        return { txRes: null, error: error as Error };
      }
    },
    [address, authToken, refreshNFTLBalance, tx, writeContracts],
  );

  const handleRefreshBal = useCallback(async () => {
    try {
      const response = await fetch(WITHDRAW_NFTL_REFRESH, {
        headers: { authorizationToken: authToken as string },
        method: 'POST',
      });
      if (!response.ok) throw new Error(response.statusText);
      setRefreshTimeout(1);
      setRefreshAccKey(Math.random());
    } catch (error) {
      console.error('error', error);
    }
  }, [authToken]);

  const handleBuyArcadeTokens = () => {
    setOpenBuyAT(true);
  };

  const handlePlayArcade = useCallback(() => {
    sendEvent(GOOGLE_ANALYTICS.EVENTS.PLAY_ARCADE_GAMES_BUTTON_TAPPED, GOOGLE_ANALYTICS.CATEGORIES.GAMEPLAY);
    router.push('/games');
  }, [router]);

  return (
    <Grid container spacing={sectionSpacing}>
      <Grid item xs={12}>
        <SectionTitle
          firstSection
          variant="h3"
          actions={
            <Stack direction="row" gap={2}>
              {loadingNFTLBal ? (
                <Skeleton variant="rectangular" animation="wave" width={120} height={40} />
              ) : (
                // <Button variant="outlined" onClick={handleClaimNFTL}>
                //   Claim All {formatNumberToDisplay(mockAccrued)} NFTL
                // </Button>
                <Typography variant="body1" fontWeight="bold">
                  NFTL in Wallet: {formatNumberToDisplay(userNFTLBalance)}
                </Typography>
              )}
            </Stack>
          }
        >
          My Tokens
        </SectionTitle>
      </Grid>
      <>
        <Grid item xs={12}>
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
                alignItems="center"
                spacing={1}
                paddingX={{ xl: 1, xs: 3 }}
                paddingY={{ xl: 0.5, xs: 1.5 }}
              >
                <Button fullWidth variant="contained" onClick={handleBuyArcadeTokens}>
                  Buy Tokens
                </Button>
                <Button fullWidth variant="outlined" onClick={handlePlayArcade}>
                  Play Arcade
                </Button>
              </Stack>
            }
          />
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
      <Grid item xs={12}>
        <Grid container spacing={sectionSpacing}>
          <Grid item xl={6} lg={12} md={12} sm={12} xs={12}>
            <HoverDataCard
              title={
                <>
                  Game &amp; Rental Balance
                  <Dialog>
                    <DialogTrigger>
                      <IconButton
                        color="primary"
                        component="span"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                        }}
                      >
                        <HistoryIcon />
                      </IconButton>
                    </DialogTrigger>
                    <DialogContent
                      aria-labelledby="refresh-dialog"
                      dialogTitle="Withdrawal Request History"
                      sx={{
                        '& h2': {
                          textAlign: 'center',
                        },
                        '& .MuiDialogContent-root': {
                          textAlign: 'center',
                        },
                      }}
                    >
                      <RefreshBalanceForm refreshTimeout={refreshTimeout} onRefresh={handleRefreshBal} />
                    </DialogContent>
                  </Dialog>
                </>
              }
              primary={`${
                accError
                  ? 'Error fetching balance'
                  : `${account ? formatNumberToDisplay(account?.balance! ?? 0) : '0.00'} NFTL`
              }`}
              isLoading={loadingNFTLBal}
              customStyle={{
                backgroundColor: theme.palette.background.default,
                border: '1px solid',
                borderColor: theme.palette.border,
                position: 'relative',
              }}
              secondary="Available Balance"
              actions={
                <Stack direction="row" gap={2}>
                  <Dialog>
                    <DialogTrigger>
                      <Button fullWidth variant="contained">
                        Withdraw
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      aria-labelledby="customized-dialog-title"
                      dialogTitle="Withdraw Game &amp; Rental Earnings"
                      sx={{
                        '& h2': {
                          textAlign: 'center',
                        },
                        '& .MuiDialogContent-root': {
                          textAlign: 'center',
                        },
                      }}
                    >
                      <WithdrawForm balance={account?.balance! || 0} onWithdrawEarnings={handleWithdrawNFTL} />
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger>
                      <Button fullWidth variant="outlined">
                        Deposit
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      aria-labelledby="deposit-dialog"
                      dialogTitle="Deposit into Game Account"
                      sx={{
                        '& h2': {
                          textAlign: 'center',
                        },
                        '& .MuiDialogContent-root': {
                          textAlign: 'center',
                        },
                      }}
                    >
                      <DepositForm balance={userNFTLBalance} onDeposit={handleDepositNFTL} />
                    </DialogContent>
                  </Dialog>
                </Stack>
              }
            />
          </Grid>
          <Grid item xl={6} lg={12} md={12} sm={12} xs={12}>
            <HoverDataCard
              title="Daily NFTL Accrued"
              primary={`${mockAccrued ? formatNumberToDisplay(mockAccrued) : '0.00'} NFTL`}
              customStyle={{
                backgroundColor: theme.palette.background.default,
                border: '1px solid',
                borderColor: theme.palette.border,
              }}
              secondary="Available to Claim"
              isLoading={loadingNFTLAccrued}
              actions={
                <Button
                  fullWidth
                  variant="contained"
                  disabled={!(mockAccrued > 0.0 && writeContracts[NFTL_CONTRACT])}
                  onClick={handleClaimNFTL}
                >
                  Claim NFTL
                </Button>
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MyNFTL;
