'use client';

import { useState, useCallback, useEffect } from 'react';
import { Grid, Button, Stack, IconButton } from '@mui/material';
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
import RefreshBalanceForm from '@/app/(private-routes)/dashboard/overview/_MyNFTL/RefreshBalanceForm';
import WithdrawForm from '@/app/(private-routes)/dashboard/overview/_MyNFTL/WithdrawForm';
import useBalances from '@/hooks/useBalances';
import useAuth from '@/hooks/useAuth';

const MyNFTL = (): JSX.Element => {
  const theme = useTheme();
  const { authToken } = useAuth();
  const { address, writeContracts, tx } = useNetworkContext();
  const [refreshTimeout, setRefreshTimeout] = useState(0);
  const { account, accountError, loadingAccount, refetchAccount } = useGameAccount();
  const [mockAccrued, setMockAccrued] = useState(0);
  const {
    loadingNFTLAccrued,
    loadingNFTLBal,
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
    if (DEBUG) console.log('Claim', tokenIndices, totalAccrued);
    const nftl = writeContracts[NFTL_CONTRACT];
    if (nftl) {
      const res = await tx(nftl.claim(tokenIndices));
      if (res) {
        setMockAccrued(0);
        setTimeout(refreshClaimableNFTL, 5000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenIndices, totalAccrued, tx, writeContracts]);

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
        refetchAccount();
        return { txRes };
      } catch (error) {
        console.error('error', error);
        return { txRes: null, error: error as Error };
      }
    },
    [address, authToken, tx, writeContracts, refetchAccount, refreshNFTLBalance],
  );

  const handleRefreshBal = useCallback(async () => {
    try {
      const response = await fetch(WITHDRAW_NFTL_REFRESH, {
        headers: { authorizationToken: authToken as string },
        method: 'POST',
      });
      if (!response.ok) throw new Error(response.statusText);
      setRefreshTimeout(1);
      refetchAccount();
    } catch (error) {
      console.error('error', error);
    }
  }, [authToken, refetchAccount]);

  return (
    <Grid container spacing={sectionSpacing}>
      <Grid item xs={12}>
        <SectionTitle firstSection>My NFTL</SectionTitle>
      </Grid>
      <Grid item xs={12}>
        <HoverDataCard
          title="Wallet Balance"
          primary={`${formatNumberToDisplay(userNFTLBalance)} NFTL`}
          customStyle={{
            backgroundColor: theme.palette.background.default,
            border: '1px solid',
            borderColor: theme.palette.border,
          }}
          secondary="Available to Spend"
          isLoading={loadingNFTLBal}
        />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={sectionSpacing}>
          <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
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
              secondary="Available to Withdraw"
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
                </Stack>
              }
            />
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
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
