'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@nl/ui/base/button'

import { formatNumberToDisplay } from '@nl/ui/utils'
import useTokensBalances from '@/hooks/balances/useTokensBalances'
import BridgeButtonDialog from '@/components/dialog/BridgeButtonDialog'
import HoverDataCard from '@/components/cards/HoverDataCard'
import { GOVERNANCE_PORTAL_URL, SNAPSHOT_PORTAL_URL } from '@/constants/url'

const WalletBalances = (): React.ReactNode => {
  const { loadingNFTLBal, tokensBalances } = useTokensBalances()

  return (
    <>
      <div className="col-span-12 sm:col-span-6">
        <HoverDataCard
          title="IMX Wallet"
          primary={`${formatNumberToDisplay(tokensBalances.NFTL.imx)} NFTL`}
          isLoading={loadingNFTLBal}
          customStyle={{
            backgroundColor: 'var(--color-card)',
            border: 'var(--border-default)',
            position: 'relative',
          }}
          secondary="Available to Use"
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
              <div className="flex w-full flex-row items-center gap-2">
                <Link
                  href={SNAPSHOT_PORTAL_URL}
                  target="_blank"
                  rel="noreferrer"
                  style={{ width: '48%' }}
                >
                  <Button className="w-full" variant="outline">
                    Snapshot
                  </Button>
                </Link>
                <Link
                  href={GOVERNANCE_PORTAL_URL}
                  target="_blank"
                  rel="noreferrer"
                  style={{ width: '48%' }}
                >
                  <Button className="w-full" variant="default">
                    Tally
                  </Button>
                </Link>
              </div>
            </>
          }
        />
      </div>
      <div className="col-span-12 sm:col-span-6">
        <HoverDataCard
          title="ETH Wallet"
          primary={`${formatNumberToDisplay(tokensBalances.NFTL.eth)} NFTL`}
          customStyle={{
            backgroundColor: 'var(--color-card)',
            border: 'var(--border-default)',
            position: 'relative',
          }}
          secondary="Available to Bridge"
          isLoading={loadingNFTLBal}
          actions={
            <>
              <Button
                variant="ghost"
                size="icon"
                disabled
                className="absolute -top-4 -right-4 cursor-pointer"
              >
                <Image src="/icons/eth.svg" alt="Ethereum" width={22} height={22} />
              </Button>
              <BridgeButtonDialog balance={tokensBalances.NFTL.eth} loading={loadingNFTLBal} />
            </>
          }
        />
      </div>
    </>
  )
}

WalletBalances.displayName = 'WalletBalances'

export default WalletBalances
