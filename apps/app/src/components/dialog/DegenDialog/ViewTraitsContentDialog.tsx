import NativeImage from '@nl/ui/custom/native-image'
import { Button } from '@nl/ui/base/button'
import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import { Title } from '@nl/ui/custom/typography'

import DegenImage from '@/components/cards/DegenCard/DegenImage'
import { getTraitDisplay, TRAIT_NAME_MAP } from '@/constants/cosmeticsFilters'
import { TRAIT_INDEXES } from '@/constants/traitIndexes'
import type { DashboardDegen } from '@/types/degens'
import { DEGEN_PURCHASE_URL } from '@/constants/public-urls'
import type { SxProps } from '@/types'
import { hasEntries } from '@/utils/collections'

interface ViewTraitsContentDialogProps {
  degen?: DashboardDegen
  traits: { [traitType: string]: bigint | number | string }
  displayName?: string
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void
  degenImageSx?: SxProps<{}>
}

const TRAIT_INDEX_BY_TYPE = Object.fromEntries(
  Object.entries(TRAIT_INDEXES).map(([index, traitType]) => [traitType, Number(index)])
) as Record<string, number>

const getTraitEntries = (traits: ViewTraitsContentDialogProps['traits']) =>
  Object.entries(traits)
    .map(([key, value]) => {
      const index = /^\d+$/.test(key) ? Number(key) : TRAIT_INDEX_BY_TYPE[key]
      const traitType = index === undefined ? key : TRAIT_INDEXES[index]

      return { index, key: traitType, value }
    })
    .filter(({ value }) => Number(value) > 0)

const ViewTraitsContentDialog = ({
  degen,
  traits,
  displayName,
  onClose,
  degenImageSx,
}: ViewTraitsContentDialogProps) => (
  <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
    <div className="flex min-w-0 flex-col items-center py-2 px-4">
      <div className="flex min-w-0 justify-center">
        {degen?.id && (
          <div className="w-full max-w-[500px] min-w-0 overflow-hidden">
            <DegenImage
              sx={{
                ...degenImageSx,
                display: 'block',
                width: '100%',
                maxWidth: '100%',
                height: 'auto',
                maxHeight: 'min(60vh, 640px)',
                objectFit: 'contain',
              }}
              tokenId={degen.id}
            />
          </div>
        )}
      </div>
      <div className="my-4 flex flex-col items-center">
        <Title level={4}>{displayName}</Title>
        <a
          href={DEGEN_PURCHASE_URL(degen?.id as string)}
          target="_blank"
          rel="noreferrer"
          className="flex flex-row flex-nowrap items-center"
        >
          <span className="text-muted-foreground no-underline">DEGEN ID #{degen?.id} </span>
          <NativeImage
            src="/img/logos/other/OpenSea.webp"
            alt="OpenSea Logo"
            width={18}
            height={18}
            className="ml-1 w-[18px] h-[18px]"
          />
        </a>
      </div>
      {degen?.owner && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-muted-foreground">
            Owned by{' '}
            {`${degen?.owner?.slice(0, 5)}...${degen?.owner?.slice(
              degen?.owner?.length - 5,
              degen?.owner?.length - 1
            )}`}
          </span>
        </div>
      )}
    </div>
    <div className="relative flex min-w-0 flex-col py-2 px-4">
      <div className="flex h-full flex-col justify-between gap-6">
        <div>
          <div className="flex flex-row items-center justify-center">
            <Title level={3}>Degen Traits</Title>
          </div>
          <div
            data-testid="degen-trait-grid"
            className="mt-6 grid min-w-0 grid-cols-2 justify-center gap-x-4 gap-y-6 sm:grid-cols-3"
          >
            {!hasEntries(traits)
              ? [...Array(9)].map((_, index) => (
                  <div className="min-w-0" key={`trait-skeleton-${index}`}>
                    <div className="flex min-w-0 flex-col items-center">
                      <DeferredSkeleton className="h-4 w-[60px]" />
                      <DeferredSkeleton className="h-4 w-10" />
                    </div>
                  </div>
                ))
              : getTraitEntries(traits).map(({ index, key, value }) => {
                  const display = getTraitDisplay(value, index)

                  return (
                    <div className="min-w-0" key={key}>
                      <div className="flex min-w-0 flex-col items-center">
                        <span className="break-words text-center font-bold">
                          {display.name ?? TRAIT_NAME_MAP[key as keyof typeof TRAIT_NAME_MAP]}
                        </span>
                        <span className="break-words text-center">{display.value}</span>
                      </div>
                    </div>
                  )
                })}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          {onClose && (
            <Button variant="default" className="w-full" onClick={onClose} autoFocus>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  </div>
)

export default ViewTraitsContentDialog
