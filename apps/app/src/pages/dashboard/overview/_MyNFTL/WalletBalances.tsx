import NativeImage from '@nl/ui/custom/native-image'
import { Button } from '@nl/ui/base/button'

import { formatNumberToDisplay } from '@nl/ui/number-format'
import useTokensBalances from '@/hooks/balances/useTokensBalances'
import BridgeButtonDialog from '@/components/dialog/BridgeButtonDialog'
import HoverDataCard from '@/components/cards/HoverDataCard'
import { GOVERNANCE_PORTAL_URL, SNAPSHOT_PORTAL_URL } from '@/constants/url'
import type { JSX } from 'solid-js'

const WalletBalances = (): JSX.Element => {
  const tokens = useTokensBalances()

  return (
    <>
      <div class="col-span-12 sm:col-span-6">
        <HoverDataCard
          title="IMX Wallet"
          primary={`${formatNumberToDisplay(tokens.tokensBalances.NFTL.imx)} NFTL`}
          isLoading={tokens.loadingNFTLBal}
          secondary="Available to Use"
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
              <div class="flex w-full flex-row items-center gap-2">
                <a
                  href={SNAPSHOT_PORTAL_URL}
                  target="_blank"
                  rel="noreferrer"
                  class="inline-block w-12/25"
                >
                  <Button class="w-full text-foreground" variant="outline">
                    Snapshot
                  </Button>
                </a>
                <a
                  href={GOVERNANCE_PORTAL_URL}
                  target="_blank"
                  rel="noreferrer"
                  class="inline-block w-12/25"
                >
                  <Button class="w-full" variant="default">
                    Tally
                  </Button>
                </a>
              </div>
            </>
          }
        />
      </div>
      <div class="col-span-12 sm:col-span-6">
        <HoverDataCard
          title="ETH Wallet"
          primary={`${formatNumberToDisplay(tokens.tokensBalances.NFTL.eth)} NFTL`}
          secondary="Available to Bridge"
          isLoading={tokens.loadingNFTLBal}
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
              <BridgeButtonDialog
                balance={tokens.tokensBalances.NFTL.eth}
                loading={tokens.loadingNFTLBal}
              />
            </>
          }
        />
      </div>
    </>
  )
}

WalletBalances.displayName = 'WalletBalances'

export default WalletBalances
