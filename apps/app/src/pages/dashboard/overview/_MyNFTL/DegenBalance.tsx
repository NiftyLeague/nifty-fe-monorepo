import NativeImage from '@nl/ui/custom/native-image'
import { Button } from '@nl/ui/base/button'

import { formatNumberToDisplay } from '@nl/ui/number-format'
import HoverDataCard from '@/components/cards/HoverDataCard'
import useClaimNFTL from '@/hooks/writeContracts/useClaimNFTL'
import useNetworkContext from '@/hooks/useNetworkContext'
import type { JSX } from 'solid-js'

const DegenBalance = (): JSX.Element => {
  const network = useNetworkContext()
  const claim = useClaimNFTL()

  return (
    <HoverDataCard
      title="DEGEN Balance"
      primary={`${claim.balance ? formatNumberToDisplay(claim.balance) : '0.00'} NFTL`}
      secondary="Available to Claim"
      isLoading={claim.loading}
      actions={
        <>
          <Button
            variant="ghost"
            size="icon"
            disabled
            class="absolute -top-4 -right-4 cursor-pointer"
          >
            <NativeImage src="/icons/eth.svg" alt="Ethereum" width={22} height={22} />
          </Button>
          <Button
            class="w-full"
            variant="default"
            disabled={!(claim.balance > 0.0 && network.isConnected)}
            onClick={claim.claimCallback}
          >
            Claim NFTL
          </Button>
        </>
      }
    />
  )
}

export default DegenBalance
