import Image from 'next/image'
import isEmpty from 'lodash/isEmpty'
import { Button } from '@nl/ui/base/button'
import { Skeleton } from '@nl/ui/base/skeleton'
import { Title } from '@nl/ui/custom/typography'

import DegenImage from '@/components/cards/DegenCard/DegenImage'
import { TRAIT_KEY_VALUE_MAP, TRAIT_NAME_MAP } from '@/constants/cosmeticsFilters'
import type { Degen, GetDegenResponse } from '@/types/degens'
import { DEGEN_PURCHASE_URL } from '@/constants/public-urls'
import type { SxProps } from '@/types'

export interface ViewTraitsContentDialogProps {
  degen?: Degen
  degenDetail?: GetDegenResponse
  traits: { [traitType: string]: number }
  displayName?: string
  onRent?: () => void
  onClaim?: () => void
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void
  degenImageSx?: SxProps<{}>
}

const ViewTraitsContentDialog = ({
  degen,
  degenDetail,
  traits,
  displayName,
  onRent,
  onClaim,
  onClose,
  degenImageSx,
}: ViewTraitsContentDialogProps) => (
  <div className="grid grid-cols-12">
    <div className="col-span-12 py-2 px-4 md:col-span-6">
      <div className="flex justify-center">
        {degen?.id && <DegenImage sx={{ maxWidth: '500px', ...degenImageSx }} tokenId={degen.id} />}
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
          <Image
            src="/img/logos/other/OpenSea.webp"
            alt="OpenSea Logo"
            width={18}
            height={18}
            className="ml-1 w-[18px] h-[18px]"
          />
        </a>
      </div>
      {/* <div className="my-4 flex flex-col items-center">
          <span className="text-[rgb(75,7,175)]">
            {degenDetail?.multiplier}x Multiplier
          </span>
          <span className="text-[rgb(75,7,175)]">
            {degenDetail?.rental_count} Active Rentals
          </span>
          <span className="text-[rgb(75,7,175)]">
            {degenDetail?.price} NFTL/ 1 Week
          </span>
        </div> */}
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
    <div className="col-span-12 relative py-2 px-4 md:col-span-6">
      <div className="flex h-full flex-col justify-between gap-6">
        <div>
          <div className="flex flex-row items-center justify-center">
            <Title level={3}>Degen Traits</Title>
          </div>
          <div className="mt-6 grid grid-cols-12 justify-center gap-x-4 gap-y-6">
            {isEmpty(traits)
              ? [...Array(9)].map((_, index) => (
                  <div className="col-span-3" key={`trait-skeleton-${index}`}>
                    <div className="flex flex-col items-center">
                      <Skeleton className="h-4 w-[60px]" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                  </div>
                ))
              : Object.entries(traits)
                  .filter(([, value]) => parseInt(value as unknown as string, 10) > 0)
                  .map(([key, value]) => (
                    <div className="col-span-3" key={key}>
                      <div className="flex flex-col items-center">
                        <span className="text-center font-bold">
                          {TRAIT_NAME_MAP[key as keyof typeof TRAIT_NAME_MAP]}
                        </span>
                        <span className="text-center">
                          {TRAIT_KEY_VALUE_MAP[value as keyof typeof TRAIT_KEY_VALUE_MAP] ?? value}
                        </span>
                      </div>
                    </div>
                  ))}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          {/* {false && (
              <Button variant="default" className="w-full" onClick={onRent || onClaim}>
                {onRent ? 'Rent Degen' : 'Claim Degen'}
              </Button>
            )} */}
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
