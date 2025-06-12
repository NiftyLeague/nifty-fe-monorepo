'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import {
  Container,
  Dialog,
  Stack,
  DialogTitle,
  Icon,
  Typography,
  Divider,
  TextField,
  Box,
  FormControl,
  FormControlLabel,
  Checkbox,
  Link,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
} from '@mui/material';
import { useTheme } from '@nl/theme';
import type { DialogProps } from '@/types/dialog';
import { sendEvent } from '@/utils/google-analytics';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import LoadingButton from '@mui/lab/LoadingButton';
import { useQuery } from '@tanstack/react-query';
import { formatNumberToDisplay } from '@/utils/numbers';
import { GET_PRODUCT, NFTL_PURCHASE_URL, PURCHASE_ARCADE_TOKEN_BALANCE_API } from '@/constants/url';
import useGameAccount from '@/hooks/useGameAccount';
import { GOOGLE_ANALYTICS } from '@/constants/google-analytics';
import useAuth from '@/hooks/useAuth';

const PRODUCT_ID = 'arcade-token-four-pack';

interface BuyArcadeTokensDialogProps extends DialogProps {
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

const BuyArcadeTokensDialog: FC<BuyArcadeTokensDialogProps> = ({ open, onSuccess, onClose, ...rest }) => {
  const { palette } = useTheme();
  const [agreement, setAgreement] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [tokenCount, setTokenCount] = useState<number>(1);
  const { authToken } = useAuth();

  const { account, refetchAccount, loadingAccount } = useGameAccount();
  const accountBalance = account?.balance ?? 0;

  const fetchArcadeTokenDetails = useCallback(async () => {
    const response = await fetch(GET_PRODUCT(PRODUCT_ID, 'nftl'), {
      method: 'GET',
      headers: { authorizationToken: authToken || '' },
    });
    const body = await response.json();
    return body;
  }, [authToken]);

  useEffect(() => {
    if (open) {
      sendEvent(GOOGLE_ANALYTICS.EVENTS.BUY_ARCADE_TOKEN_STARTED, GOOGLE_ANALYTICS.CATEGORIES.ECOMMERCE);
    }
  }, [open]);

  const {
    data: details,
    isLoading: isDetailsPending,
    error,
  } = useQuery({ queryKey: ['arcade-token-details'], queryFn: fetchArcadeTokenDetails, enabled: open });

  const updateTokenCount = (v: number | string) => {
    const value = Number(v);
    if (!Number.isNaN(value) && value > 0) {
      setTokenCount(value);
    }
  };

  const purchaseArcadeToken = useCallback(async () => {
    try {
      const response = await fetch(PURCHASE_ARCADE_TOKEN_BALANCE_API, {
        method: 'post',
        headers: { authorizationToken: authToken || '' },
        body: JSON.stringify({
          id: PRODUCT_ID,
          currency: details.currency,
          price: details.price,
          quantity: tokenCount,
        }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      sendEvent(GOOGLE_ANALYTICS.EVENTS.BUY_ARCADE_TOKEN_COMPLETE, GOOGLE_ANALYTICS.CATEGORIES.ECOMMERCE);
      refetchAccount();
      onSuccess();
    } catch {
      setShowError(true);
    }
  }, [authToken, tokenCount, details, onSuccess, refetchAccount]);

  const handleHideError = () => {
    setShowError(false);
  };

  return (
    <Dialog open={open} onClose={onClose} {...rest} maxWidth="xs">
      <Container>
        <>
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: 'center', alignItems: 'center', position: 'relative' }}
          >
            <DialogTitle>Buy Arcade Token</DialogTitle>
            <Icon sx={{ position: 'absolute', right: 0 }} onClick={onClose}>
              <CloseIcon />
            </Icon>
          </Stack>
          <Divider sx={{ opacity: '0.6' }} />
          {(isDetailsPending || error) && (
            <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center' }} width="390px" height="300px">
              <>
                {isDetailsPending && <CircularProgress />}
                {error && <Typography variant="h4">Something went wrong!</Typography>}
              </>
            </Stack>
          )}
          {!error && !isDetailsPending && details && (
            <>
              <Typography textAlign="center" mt={2}>
                <Typography>
                  To play an arcade game, you need at least 1 arcade token. Arcade tokens are sold in packs containing{' '}
                  {details.items['arcade-token']} tokens (i.e 1 pack = {details.items['arcade-token']} tokens)
                </Typography>
                <Typography my={2}>{details.price} NFTL Each</Typography>
              </Typography>
              <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center' }} spacing={1} mb={3}>
                <RemoveIcon
                  sx={{ fontSize: 50, fill: 'var(--color-foreground-2)', cursor: 'pointer' }}
                  onClick={() => updateTokenCount(tokenCount - 1)}
                />
                <TextField
                  variant="outlined"
                  sx={{ width: '100px' }}
                  value={tokenCount}
                  onChange={e => updateTokenCount(e.target.value)}
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="end">PACK</InputAdornment>,
                      inputProps: { inputMode: 'numeric', pattern: '[0-9]*', style: { textAlign: 'center' } },
                    },
                  }}
                />
                <AddIcon
                  sx={{ fontSize: 50, fill: 'var(--color-foreground-2)', cursor: 'pointer' }}
                  onClick={() => updateTokenCount(tokenCount + 1)}
                />
              </Stack>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
                <Typography
                  sx={{
                    color: theme =>
                      accountBalance && accountBalance > tokenCount * details.price
                        ? 'var(--color-success)'
                        : 'var(--color-foreground)',
                  }}
                  fontWeight="500"
                >
                  Bal: {accountBalance ? formatNumberToDisplay(accountBalance) : '0.00'} NFTL
                </Typography>
                <Typography fontWeight="500" display="flex">
                  Total:{' '}
                  <Box
                    component="img"
                    src="/icons/currencies/arcade-token.svg"
                    alt="Arcade Token"
                    width="16px"
                    mx={0.5}
                  />{' '}
                  {tokenCount * details.items['arcade-token']} Arcade Tokens
                </Typography>
                {accountBalance > 0 && accountBalance < tokenCount * details.price && (
                  <Typography variant="caption" sx={{ color: 'var(--color-warning)' }} my={1}>
                    Balance is too low.{' '}
                    <Link href={NFTL_PURCHASE_URL} target="_blank" rel="noreferrer">
                      Buy NFTL
                    </Link>
                  </Typography>
                )}
                {!accountBalance && (
                  <Typography variant="caption" sx={{ color: 'var(--color-error)' }} my={1}>
                    You have zero balance.{' '}
                    <Link href={NFTL_PURCHASE_URL} target="_blank" rel="noreferrer">
                      Buy NFTL
                    </Link>
                  </Typography>
                )}
              </Box>
              <FormControl sx={{ my: 2 }}>
                <FormControlLabel
                  label={
                    <Typography variant="caption">
                      I understand all the information above about the arcade token purchase
                    </Typography>
                  }
                  control={<Checkbox value={agreement} onChange={event => setAgreement(event.target.checked)} />}
                />
              </FormControl>
              <LoadingButton
                variant="contained"
                fullWidth
                onClick={purchaseArcadeToken}
                disabled={!agreement || !accountBalance || accountBalance < tokenCount * details.price}
                loading={loadingAccount}
                sx={{ mb: 2 }}
              >
                {!agreement
                  ? 'Accept Terms to Continue'
                  : accountBalance < tokenCount * details.price
                    ? 'Insufficient Balance'
                    : 'Buy'}
              </LoadingButton>
            </>
          )}
          <Snackbar open={showError} autoHideDuration={6000} onClose={handleHideError}>
            <Alert onClose={handleHideError} severity="error" sx={{ width: '100%' }}>
              Something went wrong!
            </Alert>
          </Snackbar>
        </>
      </Container>
    </Dialog>
  );
};

export default BuyArcadeTokensDialog;
