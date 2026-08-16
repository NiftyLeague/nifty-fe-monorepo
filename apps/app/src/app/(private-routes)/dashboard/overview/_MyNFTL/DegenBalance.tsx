'use client'

import NativeImage from '@nl/ui/custom/native-image'
import { Button } from '@nl/ui/base/button'

import { formatNumberToDisplay } from '@nl/ui/number-format'
import HoverDataCard from '@/components/cards/HoverDataCard'
import useClaimNFTL from '@/hooks/writeContracts/useClaimNFTL'
import useNetworkContext from '@/hooks/useNetworkContext'

const DegenBalance = (): React.ReactNode => {
  const { isConnected } = useNetworkContext()
  const { balance, claimCallback, loading } = useClaimNFTL()

  return (
    <HoverDataCard
      title="DEGEN Balance"
      primary={`${balance ? formatNumberToDisplay(balance) : '0.00'} NFTL`}
      customStyle={{
        backgroundColor: 'var(--color-card)',
        border: 'var(--border-default)',
        position: 'relative',
      }}
      secondary="Available to Claim"
      isLoading={loading}
      actions={
        <>
          <Button
            variant="ghost"
            size="icon"
            disabled
            className="absolute -top-4 -right-4 cursor-pointer"
          >
            <NativeImage src="/icons/eth.svg" alt="Ethereum" width={22} height={22} />
          </Button>
          <Button
            className="w-full"
            variant="default"
            disabled={!(balance > 0.0 && isConnected)}
            onClick={claimCallback}
          >
            Claim NFTL
          </Button>
        </>
      }
    />
  )
}

export default DegenBalance
