'use client';

import { memo, useCallback } from 'react';
import { Button, IconButton } from '@mui/material';
import { useTheme } from '@nl/theme';
import type { TransactionResponse } from 'ethers6';
import Image from 'next/image';

import { formatNumberToDisplay } from '@/utils/numbers';
import useBalances from '@/hooks/useBalances';
import useUserUnclaimedAmount from '@/hooks/merkleDistributor/useUserUnclaimedAmount';
import { Dialog, DialogTrigger, DialogContent } from '@/components/dialog';
import HoverDataCard from '@/components/cards/HoverDataCard';
import WithdrawForm from './WithdrawForm';

const GameBalance: React.FC = memo(() => {
  const theme = useTheme();
  const nftlUnclaimed = useUserUnclaimedAmount();
  const { loadingNFTLAccrued } = useBalances();

  const handleWithdrawNFTL = useCallback(
    async (amount: number): Promise<{ txRes: TransactionResponse | null; error?: Error | undefined }> => {
      return { txRes: null, error: undefined };
    },
    [],
  );

  return (
    <HoverDataCard
      title="Game Balance"
      primary={`${formatNumberToDisplay(nftlUnclaimed)} NFTL`}
      isLoading={loadingNFTLAccrued}
      customStyle={{
        backgroundColor: theme.palette.background.default,
        border: '1px solid',
        borderColor: theme.palette.border,
        position: 'relative',
      }}
      secondary="Available to Withdraw"
      actions={
        <>
          <IconButton disabled color="primary" component="span" sx={{ position: 'absolute', top: -2, right: -2 }}>
            <Image src="/img/logos/passport/32px.svg" alt="Immutable" width={22} height={22} />
          </IconButton>
          <Dialog>
            <DialogTrigger>
              <Button fullWidth variant="contained" disabled={nftlUnclaimed === 0}>
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
              <WithdrawForm balance={nftlUnclaimed} onWithdrawEarnings={handleWithdrawNFTL} />
            </DialogContent>
          </Dialog>
        </>
      }
    />
  );
});

GameBalance.displayName = 'GameBalance';

export default GameBalance;
