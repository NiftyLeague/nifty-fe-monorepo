'use client'

import { memo, useMemo } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Button } from '@nl/ui/base/button'
import { Icon } from '@nl/ui/base/icon'
import { formatNumberToDisplay } from '@nl/ui/utils'
import useClaimableNFTL from '@/hooks/balances/useClaimableNFTL'
import useAuth from '@/hooks/useAuth'
import { downloadDegenAsZip } from '@/utils/file'
import { errorMsgHandler } from '@/utils/errorHandlers'

interface DegenDashboardActionsProps {
  tokenId: string
  fav: boolean
  size: 'small' | 'normal'
  onClickFavorite?: React.MouseEventHandler<HTMLButtonElement>
}

const DegenClaimBal = memo(({ tokenId, fontSize }: { tokenId: string; fontSize: string }) => {
  const degenTokenIndices = useMemo(() => [parseInt(tokenId, 10)], [tokenId])
  const { balance } = useClaimableNFTL(degenTokenIndices)
  const amountParsed = formatNumberToDisplay(balance, 0)
  return <span className="text-center" style={{ fontSize }}>{`${amountParsed} NFTL`}</span>
})

DegenClaimBal.displayName = 'DegenClaimBal'

const DegenDashboardActions = ({
  tokenId,
  fav,
  size,
  onClickFavorite,
}: DegenDashboardActionsProps) => {
  const { authToken } = useAuth()
  const tinyFontSize = size === 'small' ? '8px' : 'var(--text-xs)'

  const onClickDownload = async () => {
    if (!authToken) return
    try {
      await downloadDegenAsZip(authToken, tokenId)
    } catch (err) {
      toast.error(errorMsgHandler(err))
    }
  }

  return (
    <div
      className="flex flex-row items-center justify-between px-2 pt-2"
      style={{ lineHeight: '1.5em' }}
    >
      <div className="flex flex-row items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="mr-3 size-6 cursor-pointer p-0"
          onClick={onClickFavorite}
          aria-label={fav ? 'Remove degen from favorites' : 'Add degen to favorites'}
        >
          <Icon
            name="heart"
            strokeWidth={fav ? 0 : 1.5}
            fill={fav ? 'foreground' : undefined}
            size={size === 'small' ? 12 : 16}
            aria-hidden="true"
          />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-auto cursor-pointer gap-0 p-0"
          onClick={onClickDownload}
          aria-label="Download degen"
        >
          <span style={{ fontSize: tinyFontSize, paddingRight: '4px' }}>IP</span>
          <Image
            src="/icons/download-solid.svg"
            alt=""
            width={size === 'small' ? 12 : 16}
            height={size === 'small' ? 12 : 16}
          />
        </Button>
      </div>
      <DegenClaimBal tokenId={tokenId} fontSize={tinyFontSize} />
    </div>
  )
}

export default DegenDashboardActions
