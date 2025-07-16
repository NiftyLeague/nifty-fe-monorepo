'use client';
import { useCallback, useEffect, useState } from 'react';
import { styled } from '@nl/theme';
import Image from 'next/image';
import { formatEther } from 'ethers6';
import { OrderKind } from '@cowprotocol/cow-sdk';
import { createOrderSwapEtherToNFTL, getCowMarketPrice, getOrderDetail } from '@/utils/cowswap';

import { Box, Button, LinearProgress, Link, Stack, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import Icon from '@nl/ui/base/Icon';
import { COW_PROTOCOL_URL } from '@/constants/url';
import { formatNumberToDisplay } from '@nl/ui/utils';
import { TARGET_NETWORK } from '@/constants/networks';
import useNetworkContext from '@/hooks/useNetworkContext';
import useTokensBalances from '@/hooks/balances/useTokensBalances';
import useEtherBalance from '@/hooks/balances/useEtherBalance';
import useGameAccount from '@/hooks/useGameAccount';
import useImportNFTLToWallet from '@/hooks/useImportNFTLToWallet';
import useRateEtherToNFTL from '@/hooks/useRateEtherToNFTL';
import useTokenUSDPrice from '@/hooks/useTokenUSDPrice';
import TokenInfoBox from './TokenInfoBox';

const PREFIX = 'CowSwapWidget';

const classes = { purchaseNFTLBtn: `${PREFIX}-purchaseNFTLBtn`, arrowDown: `${PREFIX}-arrowDown` };

const StyledStack = styled(Stack)(() => ({
  [`&.${classes.purchaseNFTLBtn}`]: {
    background: '#4291E5',
    borderRadius: '10px !important',
    height: '30px !important',
    '&:hover': { background: '#4291E5', opacity: 0.8 },
  },

  [`&.${classes.arrowDown}`]: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: '#202230',
    border: '1px solid #282B3F',
    left: 'calc(50% - 16px)',
  },
}));

type CowSwapWidgetProps = { refreshBalance: () => void };

const CowSwapWidget = ({ refreshBalance }: CowSwapWidgetProps) => {
  const { address, signer } = useNetworkContext();
  const { account, refetchAccount } = useGameAccount();
  const { balance: etherBalance } = useEtherBalance();
  const { rate: rateEtherToNftl, refetch: refetchRateEtherToNftl } = useRateEtherToNFTL();
  const { handleImportNFTLToWallet } = useImportNFTLToWallet();
  const { refreshNFTLBalance } = useTokensBalances();

  const [inputEthAmount, setInputEthAmount] = useState<string>('');
  const [inputNftlAmount, setInputNftlAmount] = useState<string>('');
  const [ethAmount, setEthAmount] = useState<string>('');
  const [nftlAmount, setNftlAmount] = useState<string>('');
  const [fromEthAmount, setFromEthAmount] = useState<string>('');
  const [receiveNftlAmount, setReceiveNftlAmount] = useState<string>('');
  const [feeAmount, setFeeAmount] = useState<string>('');
  const [purchasing, setPurchasing] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');
  const [feeExceedAmount, setFeeExceedAmount] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { price: etherPrice } = useTokenUSDPrice({ slug: 'ethereum' });
  const [txnState, setTxnState] = useState<string>('Buy NFTL');
  const [orderFulfilled, setOrderFulfilled] = useState<boolean>(false);
  const [orderBuyAmount, setOrderBuyAmount] = useState<string>('');
  const [deposited, setDeposited] = useState<boolean>(false);

  const accountBalance = account?.balance ?? 0;

  useEffect(() => {
    const timer = setInterval(() => {
      refetchRateEtherToNftl();
      refetchAccount();
    }, 10000);
    return () => clearInterval(timer);
  }, [refetchRateEtherToNftl, refetchAccount]);

  const checkOrderStatus = useCallback(async () => {
    const orderDetail = await getOrderDetail(TARGET_NETWORK.chainId, orderId);
    if (orderDetail?.status === 'fulfilled') {
      setOrderFulfilled(true);
      setOrderBuyAmount(formatEther(orderDetail?.buyAmount ?? ''));
      refreshNFTLBalance();
    } else {
      setTimeout(() => {
        checkOrderStatus();
      }, 3000);
    }
  }, [orderId, refreshNFTLBalance]);

  useEffect(() => {
    if (orderId && TARGET_NETWORK.chainId) {
      checkOrderStatus();
    }
  }, [orderId, checkOrderStatus]);

  const getMarketPrice = async (kind: OrderKind, amount: string) => {
    if (address) {
      try {
        setLoading(true);
        setFeeExceedAmount(false);
        setFeeAmount('');
        const quoteResponse = await getCowMarketPrice({
          kind,
          chainId: TARGET_NETWORK.chainId,
          amount,
          userAddress: address,
        });

        if (quoteResponse && quoteResponse.quote) {
          const { feeAmount: fee, buyAmount, sellAmount } = quoteResponse.quote;
          setFeeAmount(formatEther(fee));
          if (kind === OrderKind.SELL) {
            setFromEthAmount('');
            setReceiveNftlAmount(formatEther(buyAmount));
          } else {
            setReceiveNftlAmount('');
            setFromEthAmount(formatEther(BigInt(sellAmount) + BigInt(fee)));
          }
        }
      } catch (err: unknown) {
        if (
          typeof err === 'object' &&
          err !== null &&
          'error_code' in err &&
          (err as { error_code?: string }).error_code === 'FeeExceedsFrom' &&
          'data' in err &&
          typeof (err as { data?: unknown }).data === 'object' &&
          (err as { data: { fee_amount?: string } }).data.fee_amount
        ) {
          setFeeExceedAmount(true);
          setFeeAmount(formatEther((err as { data: { fee_amount: string } }).data.fee_amount));
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!rateEtherToNftl) return;
    if (!inputEthAmount || Number(inputEthAmount) === 0) {
      setNftlAmount('');
      setFromEthAmount('');
      setReceiveNftlAmount('');
      setFeeAmount('');
      return;
    }
    setNftlAmount(Math.floor(Number(inputEthAmount) / rateEtherToNftl).toString());
  }, [inputEthAmount, rateEtherToNftl]);

  useEffect(() => {
    if (!rateEtherToNftl) return;
    if (!inputNftlAmount || Number(inputNftlAmount) === 0) {
      setEthAmount('');
      setFromEthAmount('');
      setReceiveNftlAmount('');
      setFeeAmount('');
      return;
    }
    setEthAmount(formatNumberToDisplay(Number(inputNftlAmount) * rateEtherToNftl, 8));
  }, [inputNftlAmount, rateEtherToNftl]);

  const sufficientBalance: boolean = Number(ethAmount) <= etherBalance;

  const handleTxnState = (status: string) => {
    setTxnState(status);
  };

  const handleBuyNFTL = useCallback(async () => {
    if (address) {
      try {
        if (!signer) return;
        setPurchasing(true);
        const orderID = await createOrderSwapEtherToNFTL({
          signer,
          chainId: TARGET_NETWORK.chainId,
          etherVal: fromEthAmount ? fromEthAmount : ethAmount,
          userAddress: address,
          handleTxnState,
        });
        setOrderId(orderID);
      } catch (err: unknown) {
        console.error(err);
      } finally {
        setPurchasing(false);
      }
    }
  }, [address, fromEthAmount, ethAmount, signer]);

  const initialize = () => {
    setDeposited(false);
    setOrderBuyAmount('');
    setOrderId('');
    setOrderFulfilled(false);
    setInputEthAmount('');
    setInputNftlAmount('');
    setEthAmount('');
    setNftlAmount('');
    setFromEthAmount('');
    setReceiveNftlAmount('');
    setFeeAmount('');
    setTxnState('Buy NFTL');
  };

  const handleEthAmount = (val: string) => {
    setEthAmount(val);
    setInputEthAmount(val);
  };

  const handleNftlAmount = (val: string) => {
    setNftlAmount(val);
    setInputNftlAmount(val);
  };

  return (
    <StyledStack direction="column">
      <Typography variant="caption" ml="auto" mb={1}>
        This transaction is taking place live on{' '}
        <Link href={COW_PROTOCOL_URL} target="_blank" rel="noreferrer">
          cow.fi
        </Link>
        <Icon name="circle" color="purple" size={3} className="ml-1 mb-1" />
      </Typography>
      <Box
        border={'1px solid #1c1b1a'}
        boxShadow="0px 0px 9px var(--color-purple)"
        borderRadius="10px"
        px={1}
        py={1.25}
        sx={{ background: '#202230' }}
      >
        {!orderId ? (
          <Stack direction="column" spacing={0.75} position="relative">
            <TokenInfoBox
              balance={etherBalance}
              icon={<Image src="/img/logos/networks/mainnet-network.webp" alt="ETH Icon" width={12} height={12} />}
              name="ETH"
              slug="ethereum"
              value={ethAmount}
              transactionValue={fromEthAmount}
              kind="From"
              setValue={handleEthAmount}
              getMarketPrice={getMarketPrice}
            />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              className={classes.arrowDown}
              sx={{ top: fromEthAmount ? 126 : 76 }}
            >
              <Icon name="arrow-down" color="foreground" />
            </Box>
            <TokenInfoBox
              balance={accountBalance}
              icon={<Image src="/img/logos/NFTL/logo.webp" alt="NFTL Token" width={12} height={12} />}
              name="NFTL"
              slug="nifty-league"
              value={nftlAmount}
              transactionValue={receiveNftlAmount}
              kind="Receive"
              setValue={handleNftlAmount}
              getMarketPrice={getMarketPrice}
            />
            <Stack direction="column">
              {feeAmount && (
                <Stack direction="row" sx={{ justifyContent: 'space-between', my: 1 }}>
                  <Typography ml={1}>Fees</Typography>
                  <Typography mr={1}>
                    {`${formatNumberToDisplay(Number(feeAmount), 4)} ETH (~$${formatNumberToDisplay(
                      etherPrice * Number(feeAmount),
                      2,
                    )})`}
                  </Typography>
                </Stack>
              )}
            </Stack>
            <LoadingButton
              variant="contained"
              fullWidth
              loading={loading || purchasing}
              loadingPosition={purchasing ? 'end' : 'center'}
              className={classes.purchaseNFTLBtn}
              onClick={handleBuyNFTL}
              disabled={!ethAmount || !Number(ethAmount) || !sufficientBalance || feeExceedAmount}
            >
              {!ethAmount || !Number(ethAmount)
                ? 'Enter an amount'
                : !sufficientBalance
                  ? 'Insufficient ETH Balance'
                  : !feeExceedAmount
                    ? txnState
                    : 'Fees exceed from amount'}
            </LoadingButton>
          </Stack>
        ) : (
          <Stack
            direction="column"
            sx={{ justifyContent: 'center', alignItems: 'center', position: 'relative' }}
            height={228}
            gap={1}
          >
            <Typography variant="h4">{!orderFulfilled ? 'Order In Progress' : 'Order Confirmed'}</Typography>
            {!orderFulfilled && (
              <Box sx={{ width: '100px' }}>
                <LinearProgress />
              </Box>
            )}
            <Link href={`https://explorer.cow.fi/mainnet/orders/${orderId}`} target="_blank" rel="noreferrer">
              View on explorer
            </Link>
            {orderFulfilled && !deposited && (
              <Stack mt={1}>
                <Typography px={4} textAlign="center">
                  Congrats! Your transaction has been confirmed successfully! 🚀 Click below Deposit button to purchase
                  in-game NFTL balance from your wallet.
                </Typography>
              </Stack>
            )}
            <Stack direction="row" sx={{ alignItems: 'center', mt: 2 }} gap={1}>
              <Button
                variant="outlined"
                onClick={handleImportNFTLToWallet}
                fullWidth
                sx={{ height: '44px !important', lineHeight: '18px' }}
              >
                Add NFTL to Metamask
              </Button>
              {orderFulfilled && deposited && (
                <Button
                  variant="contained"
                  onClick={initialize}
                  fullWidth
                  sx={{ height: '44px !important', lineHeight: '18px' }}
                >
                  Buy More NFTL
                </Button>
              )}
            </Stack>
          </Stack>
        )}
      </Box>
    </StyledStack>
  );
};

export default CowSwapWidget;
