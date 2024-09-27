'use client';

import { memo } from 'react';
import { useSwitchChain } from 'wagmi';
import { Button, IconButton } from '@mui/material';
import { useTheme } from '@nl/theme';
import Image from 'next/image';

import { formatNumberToDisplay } from '@/utils/numbers';
import useUserUnclaimedAmount from '@/hooks/merkleDistributor/useUserUnclaimedAmount';
import { Dialog, DialogTrigger, DialogContent } from '@/components/dialog';
import HoverDataCard from '@/components/cards/HoverDataCard';
import { TARGET_NETWORK } from '@/constants/networks';
import WithdrawForm from './WithdrawForm';

const GameBalance: React.FC = memo(() => {
  const theme = useTheme();
  const { nftlUnclaimed, loading } = useUserUnclaimedAmount();
  const { switchChain } = useSwitchChain();

  const onCloseWithdrawDialog = () => {
    switchChain?.({ chainId: TARGET_NETWORK.chainId });
  };

  return (
    <HoverDataCard
      title="Game Balance"
      primary={`${formatNumberToDisplay(nftlUnclaimed)} NFTL`}
      isLoading={loading}
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
          <Dialog onClose={onCloseWithdrawDialog}>
            <DialogTrigger>
              <Button fullWidth variant="contained" disabled={loading || nftlUnclaimed === 0}>
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
              <WithdrawForm balance={nftlUnclaimed} />
            </DialogContent>
          </Dialog>
        </>
      }
    />
  );
});

GameBalance.displayName = 'GameBalance';

export default GameBalance;
