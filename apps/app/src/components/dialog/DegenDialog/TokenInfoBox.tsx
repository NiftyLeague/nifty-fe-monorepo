'use client'
import { useEffect, useMemo } from 'react'
import { cn } from '@nl/ui/utils'
import { formatNumberToDisplay } from '@nl/ui/utils'
import { useDebouncedCallback } from '@nl/ui/hooks/useDebouncedCallback'
import useTokenUSDPrice from '@/hooks/useTokenUSDPrice'
import { OrderKind } from '@cowprotocol/cow-sdk'

import styles from './TokenInfoBox.module.css'

export interface TokenInfoBoxProps {
  balance: number
  icon: React.ReactNode
  name: string
  slug: string
  value: string
  transactionValue: string
  kind: string
  setValue: (value: string) => void
  getMarketPrice: (kind: OrderKind, amount: string) => void
}

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
  const { price, refetch } = useTokenUSDPrice({ slug })

  useEffect(() => {
    const timer = setInterval(() => {
      refetch()
    }, 10000)
    return () => clearInterval(timer)
  }, [refetch])

  const debouncedGetMarketplace = useDebouncedCallback((amount: string) => {
    if (!amount || Number(amount) === 0) return
    getMarketPrice(kind === 'From' ? OrderKind.SELL : OrderKind.BUY, amount)
  }, 300)

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (!isNaN(Number(newValue))) {
      setValue(newValue)
      debouncedGetMarketplace(newValue)
    } else {
      e.preventDefault()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['.', ','].includes(e.key)) {
      if (!value) {
        setValue('0.')
      } else if (e.key === ',' && !value.includes('.')) {
        setValue(value + '.')
      }
    }
  }

  const priceInfo = useMemo(() => {
    if (!price) return ''
    if (Number(value) === 0) {
      return formatNumberToDisplay(price, price < 1 ? 4 : 2)
    }
    const total = Number(value) * price
    return formatNumberToDisplay(total, total < 1 ? 4 : 2)
  }, [price, value])

  return (
    <div
      className={styles.swapBox}
      style={{
        borderRadius: transactionValue ? '10px 10px 0 0' : '10px',
      }}
    >
      <div className="flex flex-col justify-between">
        <div className={cn(styles.tokenBox, 'flex items-center gap-1')}>
          {icon}
          <span className="font-bold">{name}</span>
        </div>
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-row items-center flex-1 relative overflow-hidden">
            <input
              className={styles.tokenAmountInput}
              autoComplete="off"
              autoCorrect="off"
              inputMode="decimal"
              minLength={1}
              maxLength={79}
              pattern="^[0-9]*[.,]?[0-9]*$"
              title="Token Amount"
              placeholder="0.00"
              value={value}
              onChange={handleChangeValue}
              onKeyDown={handleKeyDown}
              style={{
                position: 'relative',
                backgroundColor: 'transparent',
                border: 'none',
                padding: 0,
                height: 36,
                fontSize: 36,
                fontWeight: 700,
              }}
            />
            {value !== '0' && priceInfo && (
              <span
                className={cn(styles.infoUSD, 'text-base font-bold')}
                style={{
                  left: value.length > 0 ? value.length * 19 + 10 : 86,
                }}
              >{`~$${priceInfo}`}</span>
            )}
          </div>
          <span className="text-base font-bold" style={{ color: '#4D4D4F' }}>
            {`Balance: ${balance ? formatNumberToDisplay(balance, 4) : '0.00'}`}
          </span>
        </div>
      </div>
      {transactionValue && (
        <div className={cn(styles.transactionBox, 'flex justify-between items-center')}>
          <span className="text-base">{`${kind} (incl. fee)`}</span>
          <span className={styles.transactionValue}>
            {`${formatNumberToDisplay(Number(transactionValue), 4)}`}
          </span>
        </div>
      )}
    </div>
  )
}

export default TokenInfoBox
