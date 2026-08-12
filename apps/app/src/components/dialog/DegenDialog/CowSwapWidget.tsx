'use client'
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, Circle } from 'lucide-react'
import { formatEther } from 'ethers'
import { OrderKind } from '@cowprotocol/cow-sdk'
import { createOrderSwapEtherToNFTL, getCowMarketPrice, getOrderDetail } from '@/utils/cowswap'

import { Button } from '@nl/ui/base/button'
import { CircularProgress } from '@nl/ui/custom/circular-progress'
import { Progress } from '@nl/ui/base/progress'
import { Title } from '@nl/ui/custom/typography'
import { cn } from '@nl/ui/utils'
import { COW_PROTOCOL_URL } from '@/constants/url'
import { formatNumberToDisplay } from '@nl/ui/utils'
import { TARGET_NETWORK } from '@/constants/networks'
import useNetworkContext from '@/hooks/useNetworkContext'
import useTokensBalances from '@/hooks/balances/useTokensBalances'
import useEtherBalance from '@/hooks/balances/useEtherBalance'
import useGameAccount from '@/hooks/useGameAccount'
import useImportNFTLToWallet from '@/hooks/useImportNFTLToWallet'
import useRateEtherToNFTL from '@/hooks/useRateEtherToNFTL'
import useTokenUSDPrice from '@/hooks/useTokenUSDPrice'
import TokenInfoBox from './TokenInfoBox'

import styles from './CowSwapWidget.module.css'

type CowSwapWidgetProps = { refreshBalance: () => void }

const CowSwapWidget = ({ refreshBalance }: CowSwapWidgetProps) => {
  const { address, signer } = useNetworkContext()
  const { account, refetchAccount } = useGameAccount()
  const { balance: etherBalance } = useEtherBalance()
  const { rate: rateEtherToNftl, refetch: refetchRateEtherToNftl } = useRateEtherToNFTL()
  const { handleImportNFTLToWallet } = useImportNFTLToWallet()
  const { refreshNFTLBalance } = useTokensBalances()

  const [inputEthAmount, setInputEthAmount] = useState<string>('')
  const [inputNftlAmount, setInputNftlAmount] = useState<string>('')
  const [ethAmount, setEthAmount] = useState<string>('')
  const [nftlAmount, setNftlAmount] = useState<string>('')
  const [fromEthAmount, setFromEthAmount] = useState<string>('')
  const [receiveNftlAmount, setReceiveNftlAmount] = useState<string>('')
  const [feeAmount, setFeeAmount] = useState<string>('')
  const [purchasing, setPurchasing] = useState<boolean>(false)
  const [orderId, setOrderId] = useState<string>('')
  const [feeExceedAmount, setFeeExceedAmount] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { price: etherPrice } = useTokenUSDPrice({ slug: 'ethereum' })
  const [txnState, setTxnState] = useState<string>('Buy NFTL')
  const [orderFulfilled, setOrderFulfilled] = useState<boolean>(false)
  const [orderBuyAmount, setOrderBuyAmount] = useState<string>('')
  const [deposited, setDeposited] = useState<boolean>(false)

  const accountBalance = account?.balance ?? 0

  useEffect(() => {
    const timer = setInterval(() => {
      refetchRateEtherToNftl()
      refetchAccount()
    }, 10000)
    return () => clearInterval(timer)
  }, [refetchRateEtherToNftl, refetchAccount])

  const checkOrderStatus = useCallback(async () => {
    const orderDetail = await getOrderDetail(TARGET_NETWORK.chainId, orderId)
    if (orderDetail?.status === 'fulfilled') {
      setOrderFulfilled(true)
      setOrderBuyAmount(formatEther(orderDetail?.buyAmount ?? ''))
      refreshNFTLBalance()
    } else {
      setTimeout(() => {
        checkOrderStatus()
      }, 3000)
    }
  }, [orderId, refreshNFTLBalance])

  useEffect(() => {
    if (orderId && TARGET_NETWORK.chainId) {
      checkOrderStatus()
    }
  }, [orderId, checkOrderStatus])

  const getMarketPrice = async (kind: OrderKind, amount: string) => {
    if (address) {
      try {
        setLoading(true)
        setFeeExceedAmount(false)
        setFeeAmount('')
        const quoteResponse = await getCowMarketPrice({
          kind,
          chainId: TARGET_NETWORK.chainId,
          amount,
          userAddress: address,
        })

        if (quoteResponse && quoteResponse.quote) {
          const { feeAmount: fee, buyAmount, sellAmount } = quoteResponse.quote
          setFeeAmount(formatEther(fee))
          if (kind === OrderKind.SELL) {
            setFromEthAmount('')
            setReceiveNftlAmount(formatEther(buyAmount))
          } else {
            setReceiveNftlAmount('')
            setFromEthAmount(formatEther(BigInt(sellAmount) + BigInt(fee)))
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
          setFeeExceedAmount(true)
          setFeeAmount(formatEther((err as { data: { fee_amount: string } }).data.fee_amount))
        }
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (!rateEtherToNftl) return
    if (!inputEthAmount || Number(inputEthAmount) === 0) {
      setNftlAmount('')
      setFromEthAmount('')
      setReceiveNftlAmount('')
      setFeeAmount('')
      return
    }
    setNftlAmount(Math.floor(Number(inputEthAmount) / rateEtherToNftl).toString())
  }, [inputEthAmount, rateEtherToNftl])

  useEffect(() => {
    if (!rateEtherToNftl) return
    if (!inputNftlAmount || Number(inputNftlAmount) === 0) {
      setEthAmount('')
      setFromEthAmount('')
      setReceiveNftlAmount('')
      setFeeAmount('')
      return
    }
    setEthAmount(formatNumberToDisplay(Number(inputNftlAmount) * rateEtherToNftl, 8))
  }, [inputNftlAmount, rateEtherToNftl])

  const sufficientBalance: boolean = Number(ethAmount) <= etherBalance

  const handleTxnState = (status: string) => {
    setTxnState(status)
  }

  const handleBuyNFTL = useCallback(async () => {
    if (address) {
      try {
        if (!signer) return
        setPurchasing(true)
        const orderID = await createOrderSwapEtherToNFTL({
          signer,
          chainId: TARGET_NETWORK.chainId,
          etherVal: fromEthAmount ? fromEthAmount : ethAmount,
          userAddress: address,
          handleTxnState,
        })
        setOrderId(orderID)
      } catch (err: unknown) {
        console.error(err)
      } finally {
        setPurchasing(false)
      }
    }
  }, [address, fromEthAmount, ethAmount, signer])

  const initialize = () => {
    setDeposited(false)
    setOrderBuyAmount('')
    setOrderId('')
    setOrderFulfilled(false)
    setInputEthAmount('')
    setInputNftlAmount('')
    setEthAmount('')
    setNftlAmount('')
    setFromEthAmount('')
    setReceiveNftlAmount('')
    setFeeAmount('')
    setTxnState('Buy NFTL')
  }

  const handleEthAmount = (val: string) => {
    setEthAmount(val)
    setInputEthAmount(val)
  }

  const handleNftlAmount = (val: string) => {
    setNftlAmount(val)
    setInputNftlAmount(val)
  }

  return (
    <div className="flex flex-col">
      <span className="ml-auto mb-2 text-xs text-muted-foreground flex items-center">
        This transaction is taking place live on{' '}
        <Link href={COW_PROTOCOL_URL} target="_blank" rel="noreferrer" className="underline">
          cow.fi
        </Link>
        <Circle
          aria-hidden="true"
          absoluteStrokeWidth
          color="var(--color-purple)"
          size={3}
          strokeWidth={1.5}
          className="ml-1 mb-1"
        />
      </span>
      <div
        className="flex flex-col"
        style={{
          border: '1px solid #1c1b1a',
          boxShadow: '0px 0px 9px var(--color-purple)',
          borderRadius: '10px',
          padding: '4px 8px',
          background: '#202230',
        }}
      >
        {!orderId ? (
          <div className="flex flex-col gap-1.5 relative" style={{ position: 'relative' }}>
            <TokenInfoBox
              balance={etherBalance}
              icon={
                <Image
                  src="/img/logos/networks/mainnet-network.webp"
                  alt="ETH Icon"
                  width={12}
                  height={12}
                />
              }
              name="ETH"
              slug="ethereum"
              value={ethAmount}
              transactionValue={fromEthAmount}
              kind="From"
              setValue={handleEthAmount}
              getMarketPrice={getMarketPrice}
            />
            <div
              className={styles.arrowDown}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                top: fromEthAmount ? 126 : 76,
                position: 'absolute',
              }}
            >
              <ArrowDown
                aria-hidden="true"
                absoluteStrokeWidth
                color="var(--color-foreground)"
                size={20}
                strokeWidth={1.5}
              />
            </div>
            <TokenInfoBox
              balance={accountBalance}
              icon={
                <Image src="/img/logos/NFTL/logo.webp" alt="NFTL Token" width={12} height={12} />
              }
              name="NFTL"
              slug="nifty-league"
              value={nftlAmount}
              transactionValue={receiveNftlAmount}
              kind="Receive"
              setValue={handleNftlAmount}
              getMarketPrice={getMarketPrice}
            />
            <div className="flex flex-col">
              {feeAmount && (
                <div className="flex justify-between my-2">
                  <span className="ml-1 text-base">Fees</span>
                  <span className="mr-1 text-base">
                    {`${formatNumberToDisplay(Number(feeAmount), 4)} ETH (~$${formatNumberToDisplay(
                      etherPrice * Number(feeAmount),
                      2
                    )})`}
                  </span>
                </div>
              )}
            </div>
            <Button
              variant="default"
              className={cn(styles.purchaseNFTLBtn, 'w-full')}
              disabled={!ethAmount || !Number(ethAmount) || !sufficientBalance || feeExceedAmount}
              onClick={handleBuyNFTL}
            >
              {(loading || purchasing) && <CircularProgress size="sm" />}
              {!ethAmount || !Number(ethAmount)
                ? 'Enter an amount'
                : !sufficientBalance
                  ? 'Insufficient ETH Balance'
                  : !feeExceedAmount
                    ? txnState
                    : 'Fees exceed from amount'}
            </Button>
          </div>
        ) : (
          <div
            className="flex flex-col gap-2 items-center justify-center relative"
            style={{ height: 228 }}
          >
            <Title level={4}>{!orderFulfilled ? 'Order In Progress' : 'Order Confirmed'}</Title>
            {!orderFulfilled && (
              <div style={{ width: 100 }}>
                <Progress
                  value={0}
                  style={{
                    backgroundColor: 'var(--color-muted-foreground)',
                    transform: 'translateZ(0)',
                  }}
                />
              </div>
            )}
            <Link
              href={`https://explorer.cow.fi/mainnet/orders/${orderId}`}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              View on explorer
            </Link>
            {orderFulfilled && !deposited && (
              <div className="mt-2">
                <span className="px-4 text-center text-base block" style={{ textAlign: 'center' }}>
                  Congrats! Your transaction has been confirmed successfully! 🚀 Click below Deposit
                  button to purchase in-game NFTL balance from your wallet.
                </span>
              </div>
            )}
            <div className="flex flex-row gap-2 items-center mt-4">
              <Button
                variant="outline"
                onClick={handleImportNFTLToWallet}
                className="w-full"
                style={{ height: 44, lineHeight: '18px' }}
              >
                Add NFTL to Metamask
              </Button>
              {orderFulfilled && deposited && (
                <Button
                  variant="default"
                  onClick={initialize}
                  className="w-full"
                  style={{ height: 44, lineHeight: '18px' }}
                >
                  Buy More NFTL
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CowSwapWidget
