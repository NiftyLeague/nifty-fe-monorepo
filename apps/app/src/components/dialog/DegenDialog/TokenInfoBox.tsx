'use client';
import { useEffect, useMemo, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Box, InputBase, Stack, Typography } from '@mui/material';
import debounce from 'lodash/debounce';
import { formatNumberToDisplay, formatNumberToDisplay2 } from '@/utils/numbers';
import useTokenUSDPrice from '@/hooks/useTokenUSDPrice';
import { OrderKind } from '@cowprotocol/cow-sdk';

const PREFIX = 'TokenInfoBox';

const classes = {
  swapBox: `${PREFIX}-swapBox`,
  tokenBox: `${PREFIX}-tokenBox`,
  infoUSD: `${PREFIX}-infoUSD`,
  transactionBox: `${PREFIX}-transactionBox`,
  transactionValue: `${PREFIX}-transactionValue`,
};

const StyledStack = styled(Stack)(() => ({
  [`& .${classes.swapBox}`]: {
    background: '#161622',
    border: '1px solid #282B3F',
    padding: '12px 12px 4px 12px',
    height: 93,
    width: '100%',
  },

  [`& .${classes.tokenBox}`]: {
    background: '#202230',
    borderRadius: '10px',
    width: 72,
  },

  [`& .${classes.infoUSD}`]: {
    color: '#4D4D4F',
    position: 'absolute',
  },

  [`& .${classes.transactionBox}`]: {
    borderRadius: '0px 0px 10px 10px',
    border: '1px solid #282B3F',
    padding: 12,
  },

  [`& .${classes.transactionValue}`]: {
    fontSize: '20px !important',
  },
}));

export interface TokenInfoBoxProps {
  balance: number;
  icon: React.ReactNode;
  name: string;
  slug: string;
  value: string;
  transactionValue: string;
  kind: string;
  setValue: (value: string) => void;
  getMarketPrice: (kind: OrderKind, amount: string) => void;
}

const TokenAmountInput = styled(InputBase)(() => ({
  '& .MuiInputBase-input': {
    position: 'relative',
    backgroundColor: 'transparent',
    border: 'none',
    padding: 0,
    height: 36,
    fontSize: 36,
    fontWeight: 700,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    '::placeholder': {
      fontSize: 36,
      color: '#4D4D4F',
    },
  },
}));

const TokenInfoBox = ({
  balance,
  icon,
  name,
  slug,
  value,
  transactionValue,
  kind,
  setValue,
  getMarketPrice,
}: TokenInfoBoxProps) => {
  const { price, refetch } = useTokenUSDPrice({ slug });

  useEffect(() => {
    const timer = setInterval(() => {
      refetch();
    }, 10000);
    return () => clearInterval(timer);
  }, [refetch]);

  const debouncedGetMarketplace = useRef(
    debounce(async amount => {
      if (!amount || Number(amount) === 0) return;
      getMarketPrice(kind === 'From' ? OrderKind.SELL : OrderKind.BUY, amount);
    }, 300),
  ).current;

  useEffect(() => {
    return () => {
      debouncedGetMarketplace.cancel();
    };
  }, [debouncedGetMarketplace]);

  const handleChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isNaN(Number(newValue))) {
      setValue(newValue);
      debouncedGetMarketplace(newValue);
    } else {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (['.', ','].includes(e.key)) {
      if (!value) {
        setValue('0.');
      } else if (e.key === ',' && !value.includes('.')) {
        setValue(value + '.');
      }
    }
  };

  const priceInfo = useMemo(() => {
    if (!price) return '';
    if (Number(value) === 0) {
      return formatNumberToDisplay(price, price < 1 ? 4 : 2);
    }
    const total = Number(value) * price;
    return formatNumberToDisplay(total, total < 1 ? 4 : 2);
  }, [price, value]);

  return (
    <StyledStack direction="column">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        className={classes.swapBox}
        sx={{ borderRadius: transactionValue ? '10px 10px 0px 0px' : '10px' }}
      >
        <Stack direction="row" alignItems="center" px={1} py={0.5} className={classes.tokenBox} spacing={0.5}>
          {icon}
          <Typography variant="body1" fontWeight="bold">
            {name}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1} width="100%" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1} flex={1} position="relative" overflow="hidden">
            <TokenAmountInput
              inputProps={{
                autoComplete: 'off',
                autoCorrect: 'off',
                inputMode: 'decimal',
                minLength: 1,
                maxLength: 79,
                pattern: '^[0-9]*[.,]?[0-9]*$',
                title: 'Token Amount',
              }}
              placeholder="0.00"
              value={value}
              onChange={handleChangeValue}
              onKeyDown={handleKeyDown}
            />
            {value !== '0' && priceInfo && (
              <Typography
                variant="body1"
                fontWeight="bold"
                className={classes.infoUSD}
                sx={{ left: value.length > 0 ? value.length * 19 + 10 : 86 }}
              >
                {`~$${priceInfo}`}
              </Typography>
            )}
          </Stack>
          <Typography variant="body1" fontWeight="bold" sx={{ color: '#4D4D4F' }}>
            {`Balance: ${balance ? formatNumberToDisplay2(balance, 4) : '0.00'}`}
          </Typography>
        </Stack>
      </Box>
      {transactionValue && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" className={classes.transactionBox}>
          <Typography>{`${kind} (incl. fee)`}</Typography>
          <Typography className={classes.transactionValue}>
            {`${formatNumberToDisplay2(Number(transactionValue), 4)}`}
          </Typography>
        </Stack>
      )}
    </StyledStack>
  );
};

export default TokenInfoBox;
