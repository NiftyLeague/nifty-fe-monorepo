'use client'

import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'

import { formatNumberToDisplay } from '@nl/ui/number-format'
import useTokensBalances from '@/hooks/balances/useTokensBalances'
import SectionTitle from '@/components/sections/SectionTitle'
import AddNFTLToMetamask from '@/layouts/_layout/_MainLayout/_Header/AddNFTLToMetamask'
import type { JSX } from 'solid-js'

const TitleSection = (): JSX.Element => {
  const { loadingNFTLBal, tokensBalances } = useTokensBalances()
  return (
    <SectionTitle
      firstSection
      variant="h3"
      actions={
        <div class="flex flex-wrap items-center justify-end gap-4">
          <AddNFTLToMetamask />
          {loadingNFTLBal ? (
            <DeferredSkeleton class="h-10 w-[120px] rounded" />
          ) : (
            <span class="text-base font-bold">
              NFTL in Wallet:{' '}
              {formatNumberToDisplay(tokensBalances.NFTL.eth + tokensBalances.NFTL.imx)}
            </span>
          )}
        </div>
      }
    >
      My Tokens
    </SectionTitle>
  )
}

export default TitleSection
