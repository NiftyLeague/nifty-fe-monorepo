'use client';

import { useState } from 'react';
import { Badge, Button } from '@mui/material';
import { useSwitchChain } from 'wagmi';

import { TARGET_NETWORK } from '@/constants/networks';
import { Dialog, DialogContent, DialogTrigger } from '@/components/dialog';
import WithdrawForm from './WithdrawForm';
import WithdrawSuccess from './WithdrawSuccess';

type WithdrawButtonDialogProps = { balance: number; loading: boolean };

const WithdrawButtonDialog = ({ balance, loading }: WithdrawButtonDialogProps) => {
  const { switchChain } = useSwitchChain();
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const onCloseWithdrawDialog = () => {
    switchChain?.({ chainId: TARGET_NETWORK.chainId });
  };

  const onWithdrawSuccess = () => setSuccessDialogOpen(true);

  return (
    <>
      <Dialog onClose={onCloseWithdrawDialog}>
        <DialogTrigger>
          <Badge
            color="error"
            variant="standard"
            badgeContent=" "
            invisible={loading || balance === 0}
            sx={{ width: '100%' }}
          >
            <Button fullWidth variant="contained" disabled={loading || balance === 0}>
              Withdraw
            </Button>
          </Badge>
        </DialogTrigger>
        <DialogContent
          aria-labelledby="withdraw-earnings-dialog"
          dialogTitle="Withdraw Earnings"
          sx={{ '& h2': { textAlign: 'center' }, '& .MuiDialogContent-root': { textAlign: 'center' } }}
        >
          <WithdrawForm balance={balance} onWithdrawSuccess={onWithdrawSuccess} />
        </DialogContent>
      </Dialog>
      <WithdrawSuccess successDialogOpen={successDialogOpen} setSuccessDialogOpen={setSuccessDialogOpen} />
    </>
  );
};

export default WithdrawButtonDialog;
