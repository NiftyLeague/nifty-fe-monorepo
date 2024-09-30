'use client';

import Image from 'next/image';
import { useContext, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Link,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import type { Theme } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import { Dialog, DialogContent, DialogContext, DialogTrigger } from '@/components/dialog';

import { formatNumberToDisplay } from '@/utils/numbers';
import TermsOfServiceDialog from '@/components/dialog/TermsOfServiceDialog';
import useLocalStorageContext from '@/hooks/useLocalStorageContext';
import { IMX_SQUID_BRIDGE_URL } from '@/constants/url';
import BridgeSuccess from './BridgeSuccess';

type BridgeFormProps = { balance: number; onBridgeSuccess: () => void };
type IFormInput = { amountSelected: number; amountInput: string; isCheckedTerm: boolean };

const AMOUNT_SELECTS: number[] = [25, 50, 75, 100];

export const BridgeForm = ({ balance, onBridgeSuccess }: BridgeFormProps): JSX.Element => {
  const [bridgeAmount, setBridgeAmount] = useState(0);
  const [openTOS, setOpenTOS] = useState<boolean>(false);
  const { agreementAccepted, setAgreementAccepted } = useLocalStorageContext();
  const [loading, setLoading] = useState(false);
  const [, setIsOpen] = useContext(DialogContext);
  const {
    handleSubmit,
    control,
    resetField,
    getValues,
    setError,
    clearErrors,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: 'onChange',
    defaultValues: {
      amountSelected: 0,
      amountInput: '',
      isCheckedTerm: agreementAccepted === 'ACCEPTED',
    },
  });

  const resetForm = () => {
    setLoading(false);
    reset();
    setBridgeAmount(0);
    setIsOpen(false);
  };

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    if (bridgeAmount === 0) {
      setError('amountInput', {
        type: 'custom',
        message: 'Please enter the amount you like to withdraw.',
      });
      return;
    }
    setLoading(true);
    // const { error } = await onWithdrawEarnings(bridgeAmount);
    const { error } = { error: { message: '' } };
    if (error?.message) {
      setError('amountInput', {
        type: 'custom',
        message: error.message.replaceAll('"', ''),
      });
      setLoading(false);
      return;
    }
    onBridgeSuccess();
    resetForm();
  };

  const openTOSDialog: React.MouseEventHandler<HTMLAnchorElement> = event => {
    event.preventDefault();
    setOpenTOS(true);
  };

  const handleTOSDialogClose = (event: object, reason: 'backdropClick' | 'escapeKeyDown' | 'accepted' | 'cancel') => {
    if (reason === 'accepted') {
      setValue('isCheckedTerm', true);
      setAgreementAccepted('ACCEPTED');
    }
    setOpenTOS(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack alignItems="center" gap={2}>
        <Typography variant="h4" sx={{ opacity: 0.7 }}>
          Powered by:{'  '}
          <Image src="/icons/axelar.svg" alt="Axelar" width={126} height={30} />
        </Typography>
        <Alert severity="info">
          <strong>Please Note:</strong> Axelar bridge transactions minimize fees but take 20 minutes to process. If you
          need your funds immediately you should check-out the{' '}
          <Link
            href={IMX_SQUID_BRIDGE_URL}
            target="_blank"
            rel="noreferrer"
            color="secondary"
            style={{ fontWeight: 800 }}
          >
            Immutable zkEVM Squid Bridge
          </Link>{' '}
          instead.
        </Alert>
        <Typography variant="h4">NFTL Wallet Balance on Ethereum:</Typography>
        <Typography variant="h2" sx={{ opacity: 0.7 }}>
          {formatNumberToDisplay(balance)}
          <Typography variant="body1">NFTL Available to Bridge</Typography>
        </Typography>
        <Typography variant="h4">How much would you like to bridge?</Typography>
        <Controller
          name="amountSelected"
          control={control}
          render={({ field }) => (
            <ToggleButtonGroup
              {...field}
              size="large"
              exclusive
              color="success"
              onChange={(e, value) => {
                clearErrors();
                field.onChange(value);
                const calculatedAmount = value * (balance / 100);
                setValue('amountInput', calculatedAmount.toString());
                setBridgeAmount(calculatedAmount);
              }}
              sx={{ bgcolor: theme => theme.palette.secondary.main }}
            >
              {AMOUNT_SELECTS.map(amount => (
                <ToggleButton
                  key={amount}
                  value={amount}
                  sx={(theme: Theme) => ({ [theme.breakpoints.up('sm')]: { px: 4, py: 1 } })}
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
                allowNegative={false}
                isAllowed={({ value }) => Number(value) <= Number(balance)}
                label="Amount of NFTL"
                thousandSeparator
                customInput={TextField}
                onValueChange={e => {
                  clearErrors();
                  const numberValue = Number(e.value);
                  if (getValues('amountSelected') !== 0) {
                    if (getValues('amountSelected') === 25 && numberValue / balance != 0.25)
                      resetField('amountSelected');
                    if (getValues('amountSelected') === 50 && numberValue / balance != 0.5)
                      resetField('amountSelected');
                    if (getValues('amountSelected') === 75 && numberValue / balance != 0.75)
                      resetField('amountSelected');
                    if (getValues('amountSelected') === 100 && numberValue !== balance) resetField('amountSelected');
                  }
                  field.onChange(e.value);
                  setBridgeAmount(numberValue);
                }}
              />
            )}
          />
        </Box>
        <Controller
          name="isCheckedTerm"
          control={control}
          render={({ field }) => (
            <FormGroup>
              <FormControlLabel
                sx={{ m: 0, justifyContent: 'center' }}
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={e => {
                      field.onChange(e);
                      setAgreementAccepted(e.target.checked ? 'ACCEPTED' : 'FALSE');
                    }}
                  />
                }
                label={
                  <Typography textAlign="left" variant="body1" sx={{ opacity: 0.7 }}>
                    I have read the
                    <Link sx={{ mx: '4px', fontWeight: 800 }} color="textPrimary" onClick={openTOSDialog}>
                      terms &amp; conditions
                    </Link>
                    regarding transactions.
                  </Typography>
                }
              />
            </FormGroup>
          )}
        />
        <TermsOfServiceDialog open={openTOS} onClose={handleTOSDialogClose} />
        {errors.amountInput && <Alert severity="error">{errors.amountInput.message}</Alert>}
        <LoadingButton
          size="large"
          type="submit"
          variant="contained"
          fullWidth
          loading={loading}
          disabled={!getValues('isCheckedTerm') || bridgeAmount === 0}
          sx={{ textTransform: 'none' }}
        >
          Bridge {bridgeAmount !== 0 ? formatNumberToDisplay(bridgeAmount) : ''} NFTL to Immutable zkEVM
        </LoadingButton>
      </Stack>
    </form>
  );
};

type BridgeButtonDialogProps = { balance: number; loading: boolean };

const BridgeButtonDialog = ({ balance, loading }: BridgeButtonDialogProps) => {
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const onCloseBridgeDialog = () => {};

  const onBridgeSuccess = () => setSuccessDialogOpen(true);

  return (
    <>
      <Dialog onClose={onCloseBridgeDialog}>
        <DialogTrigger>
          <Button fullWidth variant="contained" disabled={loading || balance === 0}>
            Bridge
          </Button>
        </DialogTrigger>
        <DialogContent
          aria-labelledby="bridge-nftl-dialog"
          dialogTitle="Bridge NFTL to Immutable"
          sx={{
            '& h2': { textAlign: 'center' },
            '& .MuiDialogContent-root': { textAlign: 'center' },
          }}
        >
          <BridgeForm balance={balance} onBridgeSuccess={onBridgeSuccess} />
        </DialogContent>
      </Dialog>
      <BridgeSuccess successDialogOpen={successDialogOpen} setSuccessDialogOpen={setSuccessDialogOpen} />
    </>
  );
};

export default BridgeButtonDialog;
