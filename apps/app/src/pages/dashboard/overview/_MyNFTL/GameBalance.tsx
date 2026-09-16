import NativeImage from '@nl/ui/custom/native-image'
import { Button } from '@nl/ui/base/button'

import { formatNumberToDisplay } from '@nl/ui/number-format'
import useUserUnclaimedAmount from '@/hooks/merkleDistributor/useUserUnclaimedAmount'
import WithdrawButtonDialog from '@/components/dialog/WithdrawButtonDialog'
import HoverDataCard from '@/components/cards/HoverDataCard'

const GameBalance = () => {
  const unclaimed = useUserUnclaimedAmount()

  return (
    <HoverDataCard
      title="Game Balance"
      primary={`${formatNumberToDisplay(unclaimed.nftlUnclaimed)} NFTL`}
      isLoading={unclaimed.loading}
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
          <WithdrawButtonDialog balance={unclaimed.nftlUnclaimed} loading={unclaimed.loading} />
        </>
      }
    />
  )
}

export default GameBalance
