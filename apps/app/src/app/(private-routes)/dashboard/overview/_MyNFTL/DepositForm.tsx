'use client';

import { Alert, Box, TextField, ToggleButton, ToggleButtonGroup, Typography, useTheme, Stack } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useEffect, useState, useContext } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { type TransactionResponse, parseEther, formatEther, type AddressLike } from 'ethers6';
import useNetworkContext from '@/hooks/useNetworkContext';
import { GAME_ACCOUNT_CONTRACT, NFTL_CONTRACT } from '@/constants/contracts';
import { DialogContext } from '@/components/dialog';
import { formatNumberToDisplay } from '@/utils/numbers';

interface DepositFormProps {
  onDeposit: (amount: number) => Promise<TransactionResponse | null>;
  balance: number;
}

interface IFormInput {
  amountSelected: number;
  amountInput: string;
}

const amountSelects: number[] = [25, 50, 75, 100];

const DepositForm = ({ onDeposit, balance }: DepositFormProps): JSX.Element => {
  const [balanceDeposit, setBalanceDeposit] = useState(0);
  const [allowance, setAllowance] = useState<bigint>(0n);
  const [allowanceLoading, setAllowanceLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const { address, tx, writeContracts } = useNetworkContext();
  const [, setIsOpen] = useContext(DialogContext);
  const {
    handleSubmit,
    control,
    resetField,
    getValues,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: 'onChange',
    defaultValues: {
      amountSelected: 0,
      amountInput: '',
    },
  });
  const theme = useTheme();

  useEffect(() => {
    const getAllowance = async () => {
      const gameAccountContract = writeContracts[GAME_ACCOUNT_CONTRACT];
      const gameAccountAddress = await gameAccountContract.getAddress();
      const nftl = writeContracts[NFTL_CONTRACT];
      const allowanceBN = (await nftl.allowance(address as AddressLike, gameAccountAddress)) as bigint;
      setAllowance(allowanceBN);
    };
    if (writeContracts && writeContracts[NFTL_CONTRACT] && writeContracts[GAME_ACCOUNT_CONTRACT]) {
      getAllowance();
    }
  }, [address, writeContracts]);

  const resetForm = () => {
    reset();
    setBalanceDeposit(0);
    setDepositLoading(false);
    setIsOpen(false);
  };

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    if (balanceDeposit === 0) {
      setError('amountInput', {
        type: 'custom',
        message: 'Please enter the amount you like to deposit.',
      });
      return;
    }
    setDepositLoading(true);
    const res = await onDeposit(balanceDeposit);
    if (res) resetForm();
  };

  const handleIncreaseAllowance = async () => {
    setAllowanceLoading(true);
    const gameAccountContract = writeContracts[GAME_ACCOUNT_CONTRACT];
    const gameAccountAddress = await gameAccountContract.getAddress();
    const nftl = writeContracts[NFTL_CONTRACT];
    const newAllowance = parseEther(`${Math.max(100000, Math.ceil(balance))}`);
    await tx(nftl.increaseAllowance(gameAccountAddress, newAllowance));
    setAllowance(newAllowance);
    setAllowanceLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack alignItems="center" gap={2}>
        <Typography variant="h4">NFTL in Wallet</Typography>
        <Typography variant="h2" sx={{ opacity: 0.7 }}>
          {formatNumberToDisplay(balance)}
          <Typography variant="body1">Available to Deposit</Typography>
        </Typography>
        <Typography variant="h4">How much would you like to deposit?</Typography>
        <Controller
          name="amountSelected"
          control={control}
          render={({ field }) => (
            <ToggleButtonGroup
              {...field}
              size="large"
              exclusive
              color="primary"
              onChange={(e, value) => {
                clearErrors();
                if (getValues('amountInput') !== '') {
                  resetField('amountInput');
                }
                field.onChange(value);
                setBalanceDeposit(value * (balance / 100));
              }}
              sx={{
                bgcolor: theme.palette.secondary.light,
              }}
            >
              {amountSelects.map(amount => (
                <ToggleButton
                  key={amount}
                  value={amount}
                  sx={{
                    [theme.breakpoints.up('sm')]: {
                      px: 4,
                      py: 1,
                    },
                  }}
                >
                  {amount !== 100 ? `${amount}%` : 'ALL'}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        />

        <Typography variant="h4">or enter amount manually</Typography>

        <Box sx={{ width: '100%', '&>div': { width: '80%' } }}>
          <Controller
            name="amountInput"
            control={control}
            render={({ field }) => (
              <NumericFormat
                disabled={field.disabled}
                name={field.name}
                onBlur={field.onBlur}
                value={field.value}
                inputRef={field.ref}
                isAllowed={({ value }) => Number(value) <= Number(balance)}
                label="Amount of NFTL to deposit"
                thousandSeparator
                customInput={TextField}
                onValueChange={e => {
                  clearErrors();
                  if (getValues('amountSelected') !== 0) {
                    resetField('amountSelected');
                  }
                  field.onChange(e.value);
                  setBalanceDeposit(Number(e.value));
                }}
              />
            )}
          />
        </Box>
        <Typography sx={{ display: 'inline-flex' }} variant="h4">
          You are depositing
          <Typography sx={{ mx: '4px', fontWeight: 600, fontSize: 16, opacity: 0.7 }} variant="body1">
            {formatNumberToDisplay(balanceDeposit)}
          </Typography>
          NFTL
        </Typography>
        {errors.amountInput && <Alert severity="error">{errors.amountInput.message}</Alert>}
        {parseFloat(formatEther(allowance)) < balanceDeposit ? (
          <LoadingButton
            size="large"
            variant="contained"
            fullWidth
            loading={allowanceLoading}
            onClick={handleIncreaseAllowance}
          >
            Increase Allowance
          </LoadingButton>
        ) : (
          <LoadingButton
            size="large"
            type="submit"
            variant="contained"
            fullWidth
            loading={depositLoading}
            disabled={balanceDeposit === 0}
          >
            Deposit NFTL
          </LoadingButton>
        )}
      </Stack>
    </form>
  );
};

export default DepositForm;
