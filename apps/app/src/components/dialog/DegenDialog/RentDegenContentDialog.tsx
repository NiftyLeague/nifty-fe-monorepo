'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { styled, useTheme } from '@nl/theme';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { isAddress } from 'ethers6';

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid2,
  IconButton,
  Link,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import type { Degen } from '@/types/degens';
import { errorMsgHandler } from '@/utils/errorHandlers';
import { formatNumberToDisplay } from '@/utils/numbers';
import { GOOGLE_ANALYTICS } from '@/constants/google-analytics';
import { sendEvent } from '@/utils/google-analytics';
import useBalances from '@/hooks/useBalances';
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
  closeBtn: `${PREFIX}-closeBtn`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
  [`& .${classes.root}`]: {
    '& button': {
      height: 28,
      borderRadius: '2px',
    },
    '& h5': {
      fontSize: '16px',
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    '& p,span': {
      fontSize: '14px',
      lineHeight: 1.2,
    },
  },
  [`& .${classes.greyText}`]: {
    color: '#4C4F52',
  },
  [`& .${classes.input}`]: {
    padding: '8px 8px 4px 8px',
    fontSize: '12px',
    '&::placeholder': {
      fontSize: '12px',
    },
  },
  [`& .${classes.formHelper}`]: {
    marginLeft: 0,
  },
  [`& .${classes.inputCheck}`]: {
    padding: 4,
    '& .MuiSvgIcon-root': {
      width: '0.75em',
      height: '0.75em',
    },
  },
  [`& .${classes.inputCheckFormControl}`]: {
    marginLeft: -4,
    marginRight: 0,
  },
  [`& .${classes.successInfo}`]: {
    fontSize: '16px',
    fontWeight: 700,
    lineHeight: 1.25,
  },
  [`& .${classes.closeBtn}`]: {
    position: 'absolute',
    right: 12,
    top: 6,
    color: '#5820D6',
    border: '1px solid #5820D6',
    borderRadius: '50% !important',
    width: '20px',
    height: '20px !important',
    zIndex: 1,
    '& .MuiSvgIcon-root': {
      width: 16,
      height: 16,
    },
    [theme.breakpoints.down('md')]: {
      right: 20,
      top: 20,
    },
  },
}));

export interface RentDegenContentDialogProps {
  degen?: Degen;
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const RentDegenContentDialog = ({ degen, onClose }: RentDegenContentDialogProps) => {
  const router = useRouter();
  const { account, refetchAccount } = useGameAccount();
  const { agrementAccepted, setAgreementAccepted } = useLocalStorageContext();
  const agreement = agrementAccepted === 'ACCEPTED';
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
  const { isDegenOwner } = useBalances();

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

  const theme = useTheme();

  const handleChangeRentingFor = (_: React.ChangeEvent<HTMLInputElement>, value: string) => {
    if (value === 'recruit') {
      sendEvent(GOOGLE_ANALYTICS.EVENTS.RENTAL_RECRUIT_CLICKED, GOOGLE_ANALYTICS.CATEGORIES.ECOMMERCE);
    }
    setRentFor(value);
  };

  const handleChangeUseRentalPass = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      sendEvent(GOOGLE_ANALYTICS.EVENTS.RENTAL_PASS_CLICKED, GOOGLE_ANALYTICS.CATEGORIES.ECOMMERCE);
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
    sendEvent(GOOGLE_ANALYTICS.EVENTS.BEGIN_CHECKOUT, GOOGLE_ANALYTICS.CATEGORIES.ECOMMERCE);

    setLoading(true);
    try {
      await rent();
      setLoading(false);
      setRentSuccess(true);

      sendEvent(GOOGLE_ANALYTICS.EVENTS.PURCHASE, GOOGLE_ANALYTICS.CATEGORIES.ECOMMERCE);
    } catch (err: any) {
      setLoading(false);
      toast.error(errorMsgHandler(err), { theme: 'dark' });
    }
  }, [rent]);

  const isShowRentalPassOption = () => rentalPassCount > 0 && !degen?.rental_count;

  useEffect(() => {
    sendEvent(GOOGLE_ANALYTICS.EVENTS.ADD_TO_CART, GOOGLE_ANALYTICS.CATEGORIES.ECOMMERCE);
  }, []);

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
    sendEvent(GOOGLE_ANALYTICS.EVENTS.RENTAL_REFRESH_BALANCE_CLICKED, GOOGLE_ANALYTICS.CATEGORIES.ECOMMERCE, 'method');
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
    sendEvent(GOOGLE_ANALYTICS.EVENTS.RENTAL_BUY_NFTL_CLICKED, GOOGLE_ANALYTICS.CATEGORIES.ECOMMERCE);
    setPurchasingNFTL(true);
  };

  return (
    <Root>
      <Stack maxWidth={430} rowGap={{ xs: 6, lg: 4 }} mx={{ xs: 1, sm: 'auto' }} className={classes.root}>
        <IconButton aria-label="close" onClick={onClose} className={classes.closeBtn}>
          <CloseIcon />
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
            <Stack direction="row" justifyContent="center">
              {degen?.id && (
                <DegenImage
                  sx={{
                    objectFit: 'contain',
                    width: 132,
                    height: 146,
                    borderRadius: '10px',
                    border: '1px solid #0c0b0a',
                  }}
                  tokenId={degen.id}
                />
              )}
            </Stack>
            <Stack direction="column" alignItems="center" mt={0.5}>
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
                justifyContent="space-between"
                alignItems="center"
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
              <Stack direction="column" width="100%" spacing={1.25} height="146px" justifyContent="space-between">
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
                              <InfoOutlinedIcon
                                fontSize="small"
                                sx={{
                                  ml: 0.5,
                                  mt: -1.5,
                                  width: '16px',
                                  height: '16px',
                                }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      }
                      disabled={disabledRentFor}
                    />
                  </RadioGroup>
                  {rentFor === 'recruit' && (
                    <Stack direction="column" alignItems="center" my={1}>
                      <FormControl fullWidth>
                        <TextField
                          placeholder="Paste your recruit’s eth address"
                          name="address"
                          variant="outlined"
                          fullWidth
                          value={ethAddress}
                          error={addressError !== ''}
                          helperText={addressError}
                          onChange={event => validateAddress(event.target.value)}
                          slotProps={{
                            htmlInput: {
                              className: classes.input,
                            },

                            formHelperText: {
                              className: classes.formHelper,
                            },
                          }}
                        />
                      </FormControl>
                    </Stack>
                  )}
                </Stack>
                <Stack direction="column" spacing={1.25}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Rental Cost:</Typography>
                    <Typography
                      sx={{
                        textDecoration: isUseRentalPass ? 'line-through' : 'none',
                      }}
                    >{`${formatNumberToDisplay(degen?.price || 0)} NFTL`}</Typography>
                  </Stack>
                  {checkBalance && (
                    <Stack direction="column">
                      <Stack direction="row" justifyContent="space-between">
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
                            sx={{
                              color: '#5820D6',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                            }}
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
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
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
                        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100px">
                          <Typography>Balance:</Typography>
                          <Typography sx={{ color: '#5820D6' }}>{rentalPassCount}</Typography>
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
                                <Link
                                  sx={{
                                    mx: '4px',
                                    textDecoration: 'none',
                                    fontWeight: theme.typography.fontWeightBold,
                                  }}
                                  onClick={openTOSDialog}
                                >
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
          <Grid2 container spacing={6}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Stack gap={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Multipliers</Typography>
                  <Typography className={classes.greyText}>{degen?.multiplier}x</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Queue</Typography>
                  <Typography className={classes.greyText}>{degen?.rental_count}</Typography>
                </Stack>
              </Stack>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Stack gap={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Rental period</Typography>
                  <Typography className={classes.greyText}>1 week</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Renewal Cost</Typography>
                  <Typography className={classes.greyText}>{degen?.price_daily}/Day</Typography>
                </Stack>
              </Stack>
            </Grid2>
          </Grid2>
        </Stack>
      </Stack>
    </Root>
  );
};

export default RentDegenContentDialog;
