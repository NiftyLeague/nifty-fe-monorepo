'use client';

import { useCallback, useContext, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Alert, Badge, Button, Stack, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import type { TransactionResponse } from 'ethers6';
import { useSwitchChain } from 'wagmi';

import { formatDateTime } from '@/utils/dateTime';
import { formatNumberToDisplay } from '@/utils/numbers';
import { useConnectedToIMXCheck } from '@/hooks/useImxProvider';
import useClaimCallback from '@/hooks/merkleDistributor/useClaimCallback';
import useIMXContext from '@/hooks/useIMXContext';
import { TARGET_NETWORK } from '@/constants/networks';

import { Dialog, DialogContent, DialogContext, DialogTrigger } from '@/components/dialog';
import WithdrawSuccess from './WithdrawSuccess';

type WithdrawFormProps = { balance: number; onWithdrawSuccess: () => void };
type IFormInput = { withdrawal: string };

export const WithdrawForm = ({ balance, onWithdrawSuccess }: WithdrawFormProps): JSX.Element => {
  const { imxChainId } = useIMXContext();
  const isConnectedToIMX = useConnectedToIMXCheck();
  const { switchChain } = useSwitchChain();
  const { claimCallback } = useClaimCallback();

  const [, setIsOpen] = useContext(DialogContext);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();

  const resetForm = () => {
    setLoading(false);
    reset();
    setIsOpen(false);
  };

  const handleWithdrawNFTL = useCallback(async (): Promise<{ txRes: TransactionResponse | null }> => {
    const txRes = await claimCallback();
    return { txRes };
  }, [claimCallback]);

  const onSubmit: SubmitHandler<IFormInput> = async () => {
    if (!isConnectedToIMX) {
      switchChain?.({ chainId: imxChainId });
      return;
    }
    if (balance === 0) {
      setError('withdrawal', { type: 'custom', message: 'No NFTL available to withdraw.' });
      return;
    }
    setLoading(true);
    const { txRes } = await handleWithdrawNFTL();
    if (txRes === null) {
      setError('withdrawal', { type: 'custom', message: 'Failed to withdraw NFTL. Please try again.' });
      setLoading(false);
      return;
    }
    onWithdrawSuccess();
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={2} sx={{ alignItems: 'center' }}>
        <Typography variant="h4">Game &amp; Rental Balance</Typography>
        <Typography variant="h2" sx={{ opacity: 0.7 }}>
          {formatNumberToDisplay(balance)} NFTL
          <Typography variant="body1">Available to Withdraw</Typography>
        </Typography>

        <Typography variant="body1">
          You have until <span style={{ fontWeight: 600, opacity: 0.7 }}>{formatDateTime(1767240000)}</span> to
          withdraw.
        </Typography>

        <Alert severity="info">NFTL will be sent to your Immutable zkEVM wallet!</Alert>

        {errors.withdrawal && <Alert severity="error">{errors.withdrawal.message}</Alert>}

        <LoadingButton
          size="large"
          type="submit"
          variant="contained"
          fullWidth
          loading={loading}
          disabled={isConnectedToIMX && balance === 0}
        >
          {!isConnectedToIMX ? 'Switch Network to IMX' : 'Withdraw NFTL'}
        </LoadingButton>
      </Stack>
    </form>
  );
};

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
          sx={{
            '& h2': { textAlign: 'center' },
            '& .MuiDialogContent-root': { textAlign: 'center' },
          }}
        >
          <WithdrawForm balance={balance} onWithdrawSuccess={onWithdrawSuccess} />
        </DialogContent>
      </Dialog>
      <WithdrawSuccess successDialogOpen={successDialogOpen} setSuccessDialogOpen={setSuccessDialogOpen} />
    </>
  );
};

export default WithdrawButtonDialog;
