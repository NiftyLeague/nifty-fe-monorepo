'use client'

import { Skeleton } from '@nl/ui/base/skeleton'

import { formatNumberToDisplay } from '@nl/ui/utils'
import useTokensBalances from '@/hooks/balances/useTokensBalances'
import SectionTitle from '@/components/sections/SectionTitle'
import AddNFTLToMetamask from '@/app/_layout/_MainLayout/_Header/AddNFTLToMetamask'

const TitleSection = (): React.ReactNode => {
  const { loadingNFTLBal, tokensBalances } = useTokensBalances()
  return (
    <SectionTitle
      firstSection
      variant="h3"
      actions={
        <div className="flex flex-wrap items-center justify-end gap-4">
          <AddNFTLToMetamask />
          {loadingNFTLBal ? (
            <Skeleton className="h-10 w-[120px] rounded" />
          ) : (
            <span className="text-base font-bold">
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
