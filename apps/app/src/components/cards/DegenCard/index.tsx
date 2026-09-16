import { type JSX } from 'solid-js'
import { Pencil } from 'lucide-solid'
import { Button } from '@nl/ui/base/button'
import { Card, CardContent } from '@nl/ui/base/card'
import { Title } from '@nl/ui/custom/typography'
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
  dashboardActions?: JSX.Element
}

function DegenCardInner<T extends PublicDegen>({
  degen,
  isDashboardDegen = false,
  isSelectableDegen = false,
  isSelected = false,
  isSelectionDisabled = false,
  deferAnimatedMedia = false,
  size = 'normal',
  onClickClaim,
  onClickDetail,
  onClickEditName,
  onClickSelect,
  dashboardActions,
}: DegenCardProps<T> & { children?: JSX.Element }) {
  const { id, name } = degen

  const buttonFontSizeClass = size === 'small' ? 'text-xs' : 'text-sm'

  return (
    <Card class="h-full w-full gap-0 border py-0 pb-2">
      {id && (
        <DegenImage tokenId={id} deferAnimation={deferAnimatedMedia} class="w-full max-w-full" />
      )}
      <CardContent class="px-2 py-2">
        <div class="group flex flex-row justify-between gap-2">
          <div class="flex">
            <Title level={size === 'small' ? 6 : 5} class="truncate-text-1">
              {name || '[No Name]'}
            </Title>
            {isDashboardDegen && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Edit degen name"
                onClick={() => onClickEditName?.(degen)}
                class="ml-1 hidden size-6 cursor-pointer p-0 group-hover:inline-flex"
              >
                <Pencil aria-hidden="true" absoluteStrokeWidth size={18} stroke-width={1.5} />
              </Button>
            )}
          </div>
          <a
            href={id ? DEGEN_PURCHASE_URL(id) : '#'}
            target="_blank"
            rel="nofollow"
            class={`text-muted-foreground ${buttonFontSizeClass}`}
          >
            {`#${id}`}
          </a>
        </div>
      </CardContent>
      <div class="flex flex-row justify-between gap-2 px-2">
        {isSelectableDegen ? (
          <Button
            variant={isSelected ? 'default' : 'outline'}
            class={size === 'small' ? 'min-w-0 flex-1 text-xs' : 'min-w-0 flex-1 text-sm'}
            onClick={() => onClickSelect?.(degen)}
            disabled={isSelectionDisabled && !isSelected}
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        ) : (
          <Button
            variant="outline"
            class={size === 'small' ? 'min-w-0 flex-1 text-xs' : 'min-w-0 flex-1 text-sm'}
            onClick={() => onClickDetail?.(degen)}
          >
            Details
          </Button>
        )}
        {isDashboardDegen && (
          <Button
            onClick={() => onClickClaim?.(degen)}
            variant="default"
            class={size === 'small' ? 'min-w-0 flex-1 text-xs' : 'min-w-0 flex-1 text-sm'}
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
const DegenCard = DegenCardInner as <T extends PublicDegen>(
  props: DegenCardProps<T> & { children?: JSX.Element }
) => JSX.Element

export default DegenCard
