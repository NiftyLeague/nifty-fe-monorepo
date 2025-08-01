'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { styled } from '@nl/theme';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { isAddress } from 'ethers6';

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { Icon } from '@nl/ui/base/icon';
import type { Degen } from '@/types/degens';
import { errorMsgHandler } from '@/utils/errorHandlers';
import { formatNumberToDisplay } from '@nl/ui/utils';
import { gtm, GTM_EVENTS } from '@nl/ui/gtm';
import useNFTsBalances from '@/hooks/balances/useNFTsBalances';
import ConnectWrapper from '@/components/wrapper/ConnectWrapper';
import DegenImage from '@/components/cards/DegenCard/DegenImage';
import useGameAccount from '@/hooks/useGameAccount';
import useRent from '@/hooks/useRent';
import useRentalPassCount from '@/hooks/useRentalPassCount';
import useLocalStorageContext from '@/hooks/useLocalStorageContext';

import TermsOfServiceDialog from '../TermsOfServiceDialog';
import RentStepper from './RentStepper';
// import CowSwapWidget from './CowSwapWidget';

const PREFIX = 'RentDegenContentDialog';

const classes = {
  root: `${PREFIX}-root`,
  greyText: `${PREFIX}-greyText`,
  input: `${PREFIX}-input`,
  formHelper: `${PREFIX}-formHelper`,
  inputCheck: `${PREFIX}-inputCheck`,
  inputCheckFormControl: `${PREFIX}-inputCheckFormControl`,
  successInfo: `${PREFIX}-successInfo`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    '& button': { height: 28, borderRadius: '2px' },
    '& h5': { fontSize: '16px', fontWeight: 700, textTransform: 'uppercase' },
    '& p,span': { fontSize: '14px', lineHeight: 1.2 },
  },
  [`&.${classes.greyText}`]: { color: 'var(--color-muted-foreground)' },
  [`&.${classes.input}`]: { padding: '8px 8px 4px 8px', fontSize: '12px', '&::placeholder': { fontSize: '12px' } },
  [`&.${classes.formHelper}`]: { marginLeft: 0 },
  [`&.${classes.inputCheck}`]: { padding: 4, '& .MuiSvgIcon-root': { width: '0.75em', height: '0.75em' } },
  [`&.${classes.inputCheckFormControl}`]: { marginLeft: -4, marginRight: 0 },
  [`&.${classes.successInfo}`]: { fontSize: '16px', fontWeight: 700, lineHeight: 1.25 },
}));

export interface RentDegenContentDialogProps {
  degen?: Degen;
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const RentDegenContentDialog = ({ degen, onClose }: RentDegenContentDialogProps) => {
  const router = useRouter();
  const { account, refetchAccount } = useGameAccount();
  const { agreementAccepted, setAgreementAccepted } = useLocalStorageContext();
  const agreement = agreementAccepted === 'ACCEPTED';
  const [rentFor, setRentFor] = useState<string>('myself');
  const [ethAddress, setEthAddress] = useState<string>('');
  const [isUseRentalPass, setIsUseRentalPass] = useState<boolean>(false);
  const [addressError, setAddressError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [checkBalance, setCheckBalance] = useState<boolean>(false);
  const [rentSuccess, setRentSuccess] = useState<boolean>(false);
  const [openTOS, setOpenTOS] = useState<boolean>(false);
  const [disabledRentFor, setDisabledRentFor] = useState<boolean>(false);
  const [purchasingNFTL, setPurchasingNFTL] = useState<boolean>(false);
  const { isDegenOwner } = useNFTsBalances();

  const accountBalance = account?.balance ?? 0;
  const sufficientBalance = useMemo(() => accountBalance >= (degen?.price || 0), [accountBalance, degen?.price]);

  useEffect(() => {
    if (!degen || degen?.background === 'common') return;
    if (!isDegenOwner) {
      setRentFor('myself');
      setDisabledRentFor(true);
    } else {
      setDisabledRentFor(false);
      // Once api is ready,
      // need to check if user has reached out to max Sponsorship cap, then disable RentFor option
    }
  }, [degen, isDegenOwner]);

  const [, , rentalPassCount] = useRentalPassCount(degen?.id);
  const rent = useRent(degen?.id, degen?.rental_count || 0, degen?.price || 0, ethAddress, isUseRentalPass);

  const handleChangeRentingFor = (_: React.ChangeEvent<HTMLInputElement>, value: string) => {
    if (value === 'recruit') {
      gtm.sendEvent(GTM_EVENTS.RENTAL_RECRUIT_CLICKED);
    }
    setRentFor(value);
  };

  const handleChangeUseRentalPass = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      gtm.sendEvent(GTM_EVENTS.RENTAL_PASS_CLICKED);
    }
    setIsUseRentalPass(event.target.checked);
  };

  const validateAddress = (value: string) => {
    setEthAddress(value);
    if (!isAddress(value)) {
      setAddressError('Address is invalid!');
    } else if (!value) {
      setAddressError('Please input an address');
    } else {
      setAddressError('');
    }
  };

  const handleRent = useCallback(async () => {
    const items = [{ item_id: `${degen?.id}`, item_name: 'DEGEN Rental' }];
    gtm.sendEvent(GTM_EVENTS.BEGIN_CHECKOUT, { items });

    setLoading(true);
    try {
      await rent();
      setLoading(false);
      setRentSuccess(true);

      gtm.sendEvent(GTM_EVENTS.PURCHASE_COMPLETE, { items });
      gtm.sendEvent(GTM_EVENTS.SPEND_VIRTUAL_CURRENCY, {
        virtual_currency_name: 'NFTL',
        value: degen?.price || 0,
        item_name: 'DEGEN Rental',
      });
    } catch (err: unknown) {
      setLoading(false);
      toast.error(errorMsgHandler(err), { theme: 'dark' });
    }
  }, [degen?.id, degen?.price, rent]);

  const isShowRentalPassOption = () => rentalPassCount > 0 && !degen?.rental_count;

  useEffect(() => {
    gtm.sendEvent(GTM_EVENTS.ADD_TO_CART, { items: [{ item_id: `${degen?.id}`, item_name: 'DEGEN Rental' }] });
  }, [degen?.id]);

  const openTOSDialog: React.MouseEventHandler<HTMLAnchorElement> = event => {
    event.preventDefault();
    setOpenTOS(true);
  };

  const handleTOSDialogClose = (event: object, reason: 'backdropClick' | 'escapeKeyDown' | 'accepted' | 'cancel') => {
    if (reason === 'accepted') {
      setAgreementAccepted('ACCEPTED');
    }
    setOpenTOS(false);
  };

  const handleAgreementChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setAgreementAccepted('ACCEPTED');
    } else {
      setAgreementAccepted('FALSE');
    }
  };

  const handleRefreshBalance = () => {
    gtm.sendEvent(GTM_EVENTS.RENTAL_REFRESH_BALANCE_CLICKED);
    refetchAccount();
  };

  const handleGoCheckBalance = () => {
    if (rentFor === 'recruit' && !ethAddress) {
      setAddressError('Please input an address.');
      return;
    }

    if (rentFor === 'recruit' && Boolean(addressError)) {
      return;
    }

    if (rentFor === 'myself') {
      setEthAddress('');
    }

    setCheckBalance(true);
    refetchAccount();
  };

  const handleClickPlay = useCallback(() => {
    router.push('/games/smashers');
  }, [router]);

  const handleBuyNFTL = () => {
    gtm.sendEvent(GTM_EVENTS.RENTAL_BUY_NFTL_CLICKED);
    setPurchasingNFTL(true);
  };

  return (
    <Root>
      <Stack maxWidth={430} rowGap={{ xs: 6, lg: 4 }} mx={{ xs: 1, sm: 'auto' }} className={classes.root}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 6,
            border: 'var(--border-purple)',
            borderRadius: '50% !important',
            width: '20px',
            height: '20px !important',
            zIndex: 1,
          }}
        >
          <Icon name="x" size="sm" color="purple" />
        </IconButton>

        <RentStepper rentSuccess={rentSuccess} checkBalance={checkBalance} />
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          width="100%"
          p={1}
          sx={{ backgroundColor: '#262930' }}
        >
          <Typography variant="h5">Rental Overview</Typography>
        </Box>
        <Stack direction="row" spacing={{ xs: 1.5, sm: 3.5 }} mt={0.5}>
          <Stack direction="column">
            <Stack direction="row" sx={{ justifyContent: 'center' }}>
              {degen?.id && (
                <DegenImage
                  sx={{
                    objectFit: 'contain',
                    width: 132,
                    height: 146,
                    borderRadius: '10px',
                    border: 'var(--border-default)',
                  }}
                  tokenId={degen.id}
                />
              )}
            </Stack>
            <Stack direction="column" sx={{ alignItems: 'center', mt: 0.5 }}>
              <Typography sx={{ fontSize: '10px', lineHeight: 2, color: '#535659' }}>
                Owned by {degen?.owner?.substring(0, 5)}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="column" width="100%">
            {rentSuccess ? (
              <Stack
                direction="column"
                width="100%"
                spacing={1}
                height="146px"
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Typography variant="h6" className={classes.successInfo} mt={2}>
                  Congratulations!
                </Typography>
                <Typography variant="h6" className={classes.successInfo}>
                  Your rental is active.
                </Typography>
                <Button variant="contained" fullWidth onClick={handleClickPlay}>
                  Play Nifty Smashers Now
                </Button>
              </Stack>
            ) : (
              <Stack
                direction="column"
                width="100%"
                spacing={1.25}
                height="146px"
                sx={{ justifyContent: 'space-between' }}
              >
                <Stack direction="column" display={checkBalance ? 'none' : 'flex'}>
                  <Typography sx={{ fontSize: '10px', lineHeight: 2 }}>Who are you renting for?</Typography>
                  <RadioGroup row onChange={handleChangeRentingFor} value={rentFor}>
                    <FormControlLabel value="myself" control={<Radio size="small" />} label="Myself" />
                    <FormControlLabel
                      value="recruit"
                      control={<Radio size="small" />}
                      label={
                        <Box display="flex" alignItems="center">
                          <Typography>Recruit</Typography>
                          {disabledRentFor && (
                            <Tooltip title="DEGEN ownership is required to sponsor Recruits on this DEGEN.">
                              <Icon name="info" size="sm" className="-mt-1" />
                            </Tooltip>
                          )}
                        </Box>
                      }
                      disabled={disabledRentFor}
                    />
                  </RadioGroup>
                  {rentFor === 'recruit' && (
                    <Stack direction="column" sx={{ alignItems: 'center', my: 1 }}>
                      <FormControl fullWidth>
                        <TextField
                          placeholder="Paste your recruit's eth address"
                          name="address"
                          variant="outlined"
                          fullWidth
                          value={ethAddress}
                          error={addressError !== ''}
                          helperText={addressError}
                          onChange={event => validateAddress(event.target.value)}
                          slotProps={{
                            htmlInput: { className: classes.input },

                            formHelperText: { className: classes.formHelper },
                          }}
                        />
                      </FormControl>
                    </Stack>
                  )}
                </Stack>
                <Stack direction="column" spacing={1.25}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography>Rental Cost:</Typography>
                    <Typography
                      sx={{ textDecoration: isUseRentalPass ? 'line-through' : 'none' }}
                    >{`${formatNumberToDisplay(degen?.price || 0)} NFTL`}</Typography>
                  </Stack>
                  {checkBalance && (
                    <Stack direction="column">
                      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                        <Typography>Balance:</Typography>
                        <Typography sx={{ color: sufficientBalance ? '#007B60' : '#B51424' }}>{`${
                          accountBalance ? formatNumberToDisplay(accountBalance) : '0.00'
                        } NFTL`}</Typography>
                      </Stack>
                      {!sufficientBalance && (
                        <Typography variant="caption" mt={1} ml="auto">
                          Balance low.{' '}
                          <Typography
                            variant="caption"
                            onClick={handleBuyNFTL}
                            sx={{ color: 'var(--color-purple)', textDecoration: 'underline', cursor: 'pointer' }}
                          >
                            Buy NFTL now
                          </Typography>
                        </Typography>
                      )}
                    </Stack>
                  )}
                </Stack>
                <Stack direction="column" spacing={1.25}>
                  {checkBalance && isShowRentalPassOption() && (
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <FormControl>
                        <FormControlLabel
                          label={<Typography variant="caption">Rental Pass</Typography>}
                          control={
                            <Checkbox
                              size="small"
                              checked={isUseRentalPass}
                              onChange={handleChangeUseRentalPass}
                              className={classes.inputCheck}
                            />
                          }
                          className={classes.inputCheckFormControl}
                        />
                      </FormControl>
                      {isUseRentalPass && (
                        <Stack
                          direction="row"
                          sx={{ justifyContent: 'space-between', alignItems: 'center', width: '100px' }}
                        >
                          <Typography>Balance:</Typography>
                          <Typography sx={{ color: 'var(--color-purple)' }}>{rentalPassCount}</Typography>
                        </Stack>
                      )}
                    </Stack>
                  )}
                  <ConnectWrapper fullWidth>
                    {!checkBalance ? (
                      <Button variant="contained" fullWidth onClick={handleGoCheckBalance}>
                        Next
                      </Button>
                    ) : sufficientBalance || isUseRentalPass ? (
                      <Stack direction="column" spacing={1}>
                        <LoadingButton
                          variant="contained"
                          fullWidth
                          onClick={handleRent}
                          loading={loading}
                          disabled={!agreement}
                        >
                          Rent
                        </LoadingButton>
                        <FormControl fullWidth>
                          <FormControlLabel
                            label={
                              <Typography variant="caption">
                                I have read the{' '}
                                <Link className="mx-1 no-underline font-bold" onClick={openTOSDialog}>
                                  terms &amp; conditions
                                </Link>{' '}
                                regarding rentals
                              </Typography>
                            }
                            control={
                              <Checkbox
                                size="small"
                                checked={agreement}
                                onChange={handleAgreementChange}
                                className={classes.inputCheck}
                              />
                            }
                            className={classes.inputCheckFormControl}
                          />
                        </FormControl>
                        <TermsOfServiceDialog open={openTOS} onClose={handleTOSDialogClose} />
                      </Stack>
                    ) : (
                      <Button variant="contained" fullWidth onClick={handleRefreshBalance}>
                        Refresh Balance
                      </Button>
                    )}
                  </ConnectWrapper>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Stack>
        <Stack direction="column" mb={6}>
          {/* {purchasingNFTL && <CowSwapWidget refreshBalance={refetchAccount} />} */}
          <Typography variant="h5" mt={4} mb={1.5}>
            Stats
          </Typography>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Stack gap={1}>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography>Multipliers</Typography>
                  <Typography className={classes.greyText}>{degen?.multiplier}x</Typography>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography>Queue</Typography>
                  <Typography className={classes.greyText}>{degen?.rental_count}</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Stack gap={1}>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography>Rental period</Typography>
                  <Typography className={classes.greyText}>1 week</Typography>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography>Renewal Cost</Typography>
                  <Typography className={classes.greyText}>{degen?.price_daily}/Day</Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </Root>
  );
};

export default RentDegenContentDialog;
