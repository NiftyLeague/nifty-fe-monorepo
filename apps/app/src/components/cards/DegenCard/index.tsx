'use client'

import { memo } from 'react'
import { Pencil } from 'lucide-react'
import { Button } from '@nl/ui/base/button'
import { Card, CardContent } from '@nl/ui/base/card'
import { Title } from '@nl/ui/custom/typography'
import type { SxProps, Theme } from '@/types'
import DegenImage from './DegenImage'
import type { PublicDegen } from '@/types/degens'
import { DEGEN_PURCHASE_URL } from '@/constants/public-urls'

export interface DegenCardProps {
  degen: Pick<PublicDegen, 'id' | 'name'>
  size?: 'small' | 'normal'
  isDashboardDegen?: boolean
  isSelectableDegen?: boolean
  isSelected?: boolean
  isSelectionDisabled?: boolean
  favs?: string[]
  onClickClaim?: React.MouseEventHandler<HTMLButtonElement>
  onClickDetail?: React.MouseEventHandler<HTMLButtonElement>
  onClickEditName?: React.MouseEventHandler<HTMLButtonElement>
  onClickFavorite?: React.MouseEventHandler<HTMLButtonElement>
  onClickSelect?: React.MouseEventHandler<HTMLButtonElement>
  sx?: SxProps<Theme>
  dashboardActions?: React.ReactNode
}

const DegenCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<DegenCardProps>>> = memo(
  ({
    degen,
    isDashboardDegen = false,
    isSelectableDegen = false,
    isSelected = false,
    isSelectionDisabled = false,
    size = 'normal',
    sx,
    onClickClaim,
    onClickDetail,
    onClickEditName,
    onClickSelect,
    dashboardActions,
  }) => {
    const { id, name } = degen

    const buttonFontSize = size === 'small' ? '12px' : 'var(--text-sm)'

    return (
      <Card
        className="h-full w-full gap-0 border py-0 pb-2"
        style={sx as React.CSSProperties | undefined}
      >
        {id && <DegenImage tokenId={id} />}
        <CardContent className="px-2 py-2">
          <div className="group flex flex-row justify-between gap-2">
            <div className="flex">
              <Title level={size === 'small' ? 6 : 5} className="truncate-text-1">
                {name || '[No Name]'}
              </Title>
              {isDashboardDegen && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Edit degen name"
                  onClick={onClickEditName}
                  className="ml-1 hidden size-6 cursor-pointer p-0 group-hover:inline-flex"
                >
                  <Pencil aria-hidden="true" absoluteStrokeWidth size={18} strokeWidth={1.5} />
                </Button>
              )}
            </div>
            <a
              href={id ? DEGEN_PURCHASE_URL(id) : '#'}
              target="_blank"
              rel="nofollow"
              className="text-muted-foreground"
              style={{ fontSize: buttonFontSize }}
            >
              {`#${id}`}
            </a>
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
        {dashboardActions}
      </Card>
    )
  }
)

DegenCard.displayName = 'DegenCard'
export default DegenCard
