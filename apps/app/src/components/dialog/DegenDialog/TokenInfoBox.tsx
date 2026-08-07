'use client'
import { useEffect, useMemo, useRef } from 'react'
import { Box, InputBase, Stack, Typography } from '@mui/material'
import debounce from 'lodash/debounce'
import { formatNumberToDisplay } from '@nl/ui/utils'
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

  const debouncedGetMarketplace = useMemo(
    () =>
      debounce(async (amount: string) => {
        if (!amount || Number(amount) === 0) return
        getMarketPrice(kind === 'From' ? OrderKind.SELL : OrderKind.BUY, amount)
      }, 300),
    [getMarketPrice, kind]
  )

  useEffect(() => {
    return () => {
      debouncedGetMarketplace.cancel()
    }
  }, [debouncedGetMarketplace])

  const handleChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const newValue = e.target.value
    if (!isNaN(Number(newValue))) {
      setValue(newValue)
      debouncedGetMarketplace(newValue)
    } else {
      e.preventDefault()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
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
    <Stack direction="column">
      <Box
        className={styles.swapBox}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRadius: transactionValue ? '10px 10px 0px 0px' : '10px',
        }}
      >
        <Stack
          direction="row"
          className={styles.tokenBox}
          spacing={0.5}
          sx={{ px: 1, py: 0.5, alignItems: 'center' }}
        >
          {icon}
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {name}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ flex: 1, position: 'relative', overflow: 'hidden', alignItems: 'center' }}
          >
            <InputBase
              className={styles.tokenAmountInput}
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
                className={styles.infoUSD}
                sx={{ fontWeight: 'bold', left: value.length > 0 ? value.length * 19 + 10 : 86 }}
              >
                {`~$${priceInfo}`}
              </Typography>
            )}
          </Stack>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#4D4D4F' }}>
            {`Balance: ${balance ? formatNumberToDisplay(balance, 4) : '0.00'}`}
          </Typography>
        </Stack>
      </Box>
      {transactionValue && (
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
          className={styles.transactionBox}
        >
          <Typography>{`${kind} (incl. fee)`}</Typography>
          <Typography className={styles.transactionValue}>
            {`${formatNumberToDisplay(Number(transactionValue), 4)}`}
          </Typography>
        </Stack>
      )}
    </Stack>
  )
}

export default TokenInfoBox
