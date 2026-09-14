'use client'

import { memo, type PropsWithChildren, type ReactNode } from 'react'
import { Pencil } from 'lucide-react'
import { Button } from '@nl/ui/base/button'
import { Card, CardContent } from '@nl/ui/base/card'
import { Title } from '@nl/ui/custom/typography'
import type { SxProps } from '@/types'
import DegenImage from './DegenImage'
import type { PublicDegen } from '@/types/degens'
import { DEGEN_PURCHASE_URL } from '@/constants/public-urls'

/**
 * Handlers receive the card's degen instead of the click event so pages can
 * pass stable callbacks. An unstable per-card closure would defeat the memo
 * below and re-render the whole grid whenever the page re-renders.
 */
export interface DegenCardProps<T extends PublicDegen = PublicDegen> {
  degen: T
  size?: 'small' | 'normal'
  isDashboardDegen?: boolean
  isSelectableDegen?: boolean
  isSelected?: boolean
  isSelectionDisabled?: boolean
  deferAnimatedMedia?: boolean
  favs?: string[]
  onClickClaim?: (degen: T) => void
  onClickDetail?: (degen: T) => void
  onClickEditName?: (degen: T) => void
  onClickFavorite?: (degen: T) => void
  onClickSelect?: (degen: T) => void
  sx?: SxProps
  dashboardActions?: React.ReactNode
}

function DegenCardInner<T extends PublicDegen>({
  degen,
  isDashboardDegen = false,
  isSelectableDegen = false,
  isSelected = false,
  isSelectionDisabled = false,
  deferAnimatedMedia = false,
  size = 'normal',
  sx,
  onClickClaim,
  onClickDetail,
  onClickEditName,
  onClickSelect,
  dashboardActions,
}: PropsWithChildren<DegenCardProps<T>>) {
  const { id, name } = degen

  const buttonFontSize = size === 'small' ? '12px' : 'var(--text-sm)'

  return (
    <Card
      className="h-full w-full gap-0 border py-0 pb-2"
      style={sx as React.CSSProperties | undefined}
    >
      {id && (
        <DegenImage
          tokenId={id}
          deferAnimation={deferAnimatedMedia}
          sx={{ width: '100%', maxWidth: '100%' }}
        />
      )}
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
                onClick={() => onClickEditName?.(degen)}
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
            onClick={() => onClickSelect?.(degen)}
            disabled={isSelectionDisabled && !isSelected}
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        ) : (
          <Button
            variant="outline"
            className="min-w-0 flex-1"
            style={{ fontSize: buttonFontSize }}
            onClick={() => onClickDetail?.(degen)}
          >
            Details
          </Button>
        )}
        {isDashboardDegen && (
          <Button
            onClick={() => onClickClaim?.(degen)}
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

/**
 * `memo` is monomorphic, so the generic card is restored with a cast — the
 * same pattern `DeferredComponent` uses. Shallow comparison is enough now that
 * every callback prop can be stable.
 */
const DegenCard = memo(DegenCardInner) as <T extends PublicDegen>(
  props: PropsWithChildren<DegenCardProps<T>>
) => ReactNode

export default DegenCard
