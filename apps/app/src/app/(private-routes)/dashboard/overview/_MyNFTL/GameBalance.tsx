'use client'

import Image from 'next/image'
import { memo } from 'react'
import { Button } from '@nl/ui/base/button'

import { formatNumberToDisplay } from '@nl/ui/number-format'
import useUserUnclaimedAmount from '@/hooks/merkleDistributor/useUserUnclaimedAmount'
import WithdrawButtonDialog from '@/components/dialog/WithdrawButtonDialog'
import HoverDataCard from '@/components/cards/HoverDataCard'

const GameBalance: React.FC = memo(() => {
  const { nftlUnclaimed, loading } = useUserUnclaimedAmount()

  return (
    <HoverDataCard
      title="Game Balance"
      primary={`${formatNumberToDisplay(nftlUnclaimed)} NFTL`}
      isLoading={loading}
      customStyle={{
        backgroundColor: 'var(--color-card)',
        border: 'var(--border-default)',
        position: 'relative',
      }}
      secondary="Available to Withdraw"
      actions={
        <>
          <Button
            variant="ghost"
            size="icon"
            disabled
            className="absolute -top-4 -right-4 cursor-pointer"
          >
            <Image src="/img/logos/passport/32px.svg" alt="Immutable" width={22} height={22} />
          </Button>
          <WithdrawButtonDialog balance={nftlUnclaimed} loading={loading} />
        </>
      }
    />
  )
})

GameBalance.displayName = 'GameBalance'

export default GameBalance
