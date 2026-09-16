import NativeImage from '@nl/ui/custom/native-image'
import { Button } from '@nl/ui/base/button'

import { formatNumberToDisplay } from '@nl/ui/number-format'
import useUserUnclaimedAmount from '@/hooks/merkleDistributor/useUserUnclaimedAmount'
import WithdrawButtonDialog from '@/components/dialog/WithdrawButtonDialog'
import HoverDataCard from '@/components/cards/HoverDataCard'

const GameBalance = () => {
  const { nftlUnclaimed, loading } = useUserUnclaimedAmount()

  return (
    <HoverDataCard
      title="Game Balance"
      primary={`${formatNumberToDisplay(nftlUnclaimed)} NFTL`}
      isLoading={loading}
      secondary="Available to Withdraw"
      actions={
        <>
          <Button
            variant="ghost"
            size="icon"
            disabled
            class="absolute -top-4 -right-4 cursor-pointer"
          >
            <NativeImage
              src="/img/logos/passport/32px.svg"
              alt="Immutable"
              width={22}
              height={22}
            />
          </Button>
          <WithdrawButtonDialog balance={nftlUnclaimed} loading={loading} />
        </>
      }
    />
  )
}

export default GameBalance
