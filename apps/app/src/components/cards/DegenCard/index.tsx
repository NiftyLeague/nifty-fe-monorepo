'use client'

import { memo, useMemo, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'
import { toast } from 'sonner'
import { Button } from '@nl/ui/base/button'
import { Card, CardContent } from '@nl/ui/base/card'
import { Icon } from '@nl/ui/base/icon'
import { Title } from '@nl/ui/custom/typography'
import { formatNumberToDisplay } from '@nl/ui/utils'
import type { SxProps, Theme } from '@/types'
import SkeletonDegenPlaceholder from '@/components/cards/Skeleton/DegenPlaceholder'
import useClaimableNFTL from '@/hooks/balances/useClaimableNFTL'
import DegenImage from './DegenImage'
import { downloadDegenAsZip } from '@/utils/file'
import { errorMsgHandler } from '@/utils/errorHandlers'
import type { Degen } from '@/types/degens'
import useAuth from '@/hooks/useAuth'
import { DEGEN_PURCHASE_URL } from '@/constants/url'

export interface DegenCardProps {
  degen: Degen
  size?: 'small' | 'normal'
  isDashboardDegen?: boolean
  isSelectableDegen?: boolean
  isSelected?: boolean
  isSelectionDisabled?: boolean
  degenEquipEnabled?: boolean
  favs?: string[]
  onClickClaim?: React.MouseEventHandler<HTMLButtonElement>
  onClickDetail?: React.MouseEventHandler<HTMLButtonElement>
  onClickEditName?: React.MouseEventHandler<SVGSVGElement>
  onClickEquip?: React.MouseEventHandler<HTMLButtonElement>
  onClickFavorite?: React.MouseEventHandler<SVGSVGElement>
  onClickRent?: React.MouseEventHandler<HTMLButtonElement>
  onClickSelect?: React.MouseEventHandler<HTMLButtonElement>
  sx?: SxProps<Theme>
}

const DegenClaimBal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<{ tokenId: string; fontSize: string }>>
> = memo(({ tokenId, fontSize }) => {
  const degenTokenIndices = useMemo(() => [parseInt(tokenId, 10)], [tokenId])
  const { balance } = useClaimableNFTL(degenTokenIndices)
  const amountParsed = formatNumberToDisplay(balance, 0)
  return <span className="text-center" style={{ fontSize }}>{`${amountParsed} NFTL`}</span>
})

DegenClaimBal.displayName = 'DegenClaimBal'

const DegenCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<DegenCardProps>>> = memo(
  ({
    degen,
    favs = [],
    isDashboardDegen = false,
    isSelectableDegen = false,
    isSelected = false,
    isSelectionDisabled = false,
    size = 'normal',
    sx,
    onClickClaim,
    onClickDetail,
    onClickEditName,
    onClickFavorite,
    onClickSelect,
  }) => {
    const { id, name } = degen
    const fav = favs.some((f) => f === id)
    const { authToken } = useAuth()

    const onClickDownload = async () => {
      if (authToken) {
        try {
          await downloadDegenAsZip(authToken, id)
        } catch (err) {
          toast.error(errorMsgHandler(err))
        }
      }
    }

    const buttonFontSize = size === 'small' ? '12px' : 'var(--text-sm)'
    const tinyFontSize = size === 'small' ? '8px' : 'var(--text-xs)'

    return (
      <Card
        className="h-full w-full gap-0 border py-0 pb-2"
        style={sx as React.CSSProperties | undefined}
      >
        {id && <DegenImage tokenId={id} />}
        <CardContent className="px-2 py-2">
          <div className="flex flex-row justify-between gap-2 hover:[&_svg]:block">
            <div className="flex">
              <Title level={size === 'small' ? 6 : 5} className="truncate-text-1">
                {name || '[No Name]'}
              </Title>
              {isDashboardDegen && (
                <Icon
                  name="pencil"
                  size="sm"
                  onClick={onClickEditName}
                  className="ml-1 hidden cursor-pointer"
                />
              )}
            </div>
            <Link
              href={id ? DEGEN_PURCHASE_URL(id) : '#'}
              target="_blank"
              rel="nofollow"
              className="text-muted-foreground"
              style={{ fontSize: buttonFontSize }}
            >
              {`#${id}`}
            </Link>
          </div>
        </CardContent>
        <div className="flex flex-row justify-between gap-2 px-2">
          {isSelectableDegen ? (
            <Button
              variant={isSelected ? 'default' : 'outline'}
              className="min-w-0 flex-1"
              style={{ fontSize: buttonFontSize }}
              onClick={onClickSelect}
              disabled={isSelectionDisabled && !isSelected}
            >
              {isSelected ? 'Selected' : 'Select'}
            </Button>
          ) : (
            <Button
              variant="outline"
              className="min-w-0 flex-1"
              style={{ fontSize: buttonFontSize }}
              onClick={onClickDetail}
            >
              Details
            </Button>
          )}
          {isDashboardDegen && (
            <Button
              onClick={onClickClaim}
              variant="default"
              className="min-w-0 flex-1"
              style={{ fontSize: buttonFontSize }}
            >
              Claim
            </Button>
          )}
        </div>
        {isDashboardDegen && (
          <div
            className="flex flex-row items-center justify-between px-2 pt-2"
            style={{ lineHeight: '1.5em' }}
          >
            <div className="flex flex-row items-center">
              <Icon
                name="heart"
                strokeWidth={fav ? 0 : 1.5}
                fill={fav ? 'foreground' : undefined}
                size={size === 'small' ? 12 : 16}
                onClick={onClickFavorite}
                className="mr-3 cursor-pointer"
              />
              <div className="flex cursor-pointer items-center" onClick={onClickDownload}>
                <span style={{ fontSize: tinyFontSize, paddingRight: '4px' }}>IP</span>
                <Image
                  src="/icons/download-solid.svg"
                  alt="Download Icon"
                  width={size === 'small' ? 12 : 16}
                  height={size === 'small' ? 12 : 16}
                />
              </div>
            </div>
            <DegenClaimBal tokenId={id} fontSize={tinyFontSize} />
          </div>
        )}
      </Card>
    )
  }
)

DegenCard.displayName = 'DegenCard'

const DegenCardInView: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<DegenCardProps>>
> = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useOnScreen(ref)

  return <div ref={ref}>{inView ? <DegenCard {...props} /> : <SkeletonDegenPlaceholder />}</div>
}

export { DegenCardInView }

export default DegenCard
