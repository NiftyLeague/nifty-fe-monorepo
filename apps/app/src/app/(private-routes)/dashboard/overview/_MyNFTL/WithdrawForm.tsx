'use client';

import { useState, useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Alert, Stack, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import type { TransactionResponse } from 'ethers6';

import { DialogContext } from '@/components/dialog';
import { formatDateTime } from '@/utils/dateTime';
import { formatNumberToDisplay } from '@/utils/numbers';

interface WithdrawFormProps {
  onWithdrawEarnings: (amount: number) => Promise<{ txRes: TransactionResponse | null; error?: Error }>;
  balance: number;
}

type IFormInput = { withdrawal: string };

const WithdrawForm = ({ onWithdrawEarnings, balance }: WithdrawFormProps): JSX.Element => {
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

  const onSubmit: SubmitHandler<IFormInput> = async () => {
    if (balance === 0) {
      setError('withdrawal', {
        type: 'custom',
        message: 'Please enter the amount you like to withdraw.',
      });
      return;
    }
    setLoading(true);
    const { error } = await onWithdrawEarnings(balance);
    if (error?.message) {
      setError('withdrawal', {
        type: 'custom',
        message: error.message.replaceAll('"', ''),
      });
      setLoading(false);
      return;
    }
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={2} sx={{ alignItems: 'center' }}>
        <Typography variant="h4">Game &amp; Rental Balance</Typography>
        <Typography variant="h2" sx={{ opacity: 0.7 }}>
          {formatNumberToDisplay(balance)}
          <Typography variant="body1">Available to Withdraw</Typography>
        </Typography>

        <Typography sx={{ display: 'inline-flex' }} variant="body1">
          You have until
          <Typography sx={{ mx: '4px', fontWeight: 600, fontSize: 16, opacity: 0.7 }} variant="body1">
            {formatDateTime(1767240000)}
          </Typography>
          to withdraw.
        </Typography>

        <Alert severity="info">NFTL will be sent to your Immutable zkEVM wallet!</Alert>

        {errors.withdrawal && <Alert severity="error">{errors.withdrawal.message}</Alert>}

        <LoadingButton
          size="large"
          type="submit"
          variant="contained"
          fullWidth
          loading={loading}
          disabled={balance === 0 || true}
        >
          {/* Withdraw NFTL */}
          Migration in progress - Will be available soon
        </LoadingButton>
      </Stack>
    </form>
  );
};

export default WithdrawForm;
