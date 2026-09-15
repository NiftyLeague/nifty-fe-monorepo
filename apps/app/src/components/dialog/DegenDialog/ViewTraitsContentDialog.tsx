import { For, Show } from 'solid-js'
import NativeImage from '@nl/ui/custom/native-image'
import { Button } from '@nl/ui/base/button'
import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import { Title } from '@nl/ui/custom/typography'

import type { DashboardDegen } from '@/types/degens'
import { DEGEN_PURCHASE_URL } from '@/constants/public-urls'
import DegenModalMedia from './DegenModalMedia'
import type { SxProps } from '@/types'
import { getDegenTraitEntries, type DegenTraitValue } from '@/utils/degen-traits'
import { hasEntries } from '@/utils/collections'

interface ViewTraitsContentDialogProps {
  degen?: DashboardDegen
  traits: string | readonly DegenTraitValue[] | { [traitType: string]: DegenTraitValue }
  displayName?: string
  onClose?: (event: MouseEvent & { currentTarget: HTMLButtonElement }) => void
  degenImageSx?: SxProps
}

const ViewTraitsContentDialog = (props: ViewTraitsContentDialogProps) => {
  const hasTraits = () =>
    props.traits &&
    (typeof props.traits === 'string' ? props.traits.trim() : hasEntries(props.traits))

  return (
    <div class="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
      <div class="flex min-w-0 flex-col items-center py-2 px-4">
        <Show when={props.degen?.id}>
          <DegenModalMedia tokenId={props.degen!.id} sx={props.degenImageSx} />
        </Show>
        <div class="my-4 flex flex-col items-center">
          <Title level={4}>{props.displayName}</Title>
          <a
            href={DEGEN_PURCHASE_URL(props.degen?.id as string)}
            target="_blank"
            rel="noreferrer"
            class="flex flex-row flex-nowrap items-center"
          >
            <span class="text-muted-foreground no-underline">DEGEN ID #{props.degen?.id} </span>
            <NativeImage
              src="/img/logos/other/OpenSea.webp"
              alt="OpenSea Logo"
              width={18}
              height={18}
              class="ml-1 w-[18px] h-[18px]"
            />
          </a>
        </div>
        <Show when={props.degen?.owner}>
          <div class="flex flex-col items-center gap-2">
            <span class="text-muted-foreground">
              Owned by{' '}
              {`${props.degen?.owner?.slice(0, 5)}...${props.degen?.owner?.slice(
                (props.degen?.owner?.length ?? 0) - 5,
                (props.degen?.owner?.length ?? 0) - 1
              )}`}
            </span>
          </div>
        </Show>
      </div>
      <div class="relative flex min-w-0 flex-col py-2 px-4">
        <div class="flex h-full flex-col justify-between gap-6">
          <div>
            <div class="flex flex-row items-center justify-center">
              <Title level={3}>Degen Traits</Title>
            </div>
            <div
              data-testid="degen-trait-grid"
              class="mt-6 grid min-w-0 grid-cols-2 justify-center gap-x-4 gap-y-6 sm:grid-cols-3"
            >
              <Show
                when={hasTraits()}
                fallback={
                  <For each={Array.from({ length: 9 })}>
                    {() => (
                      <div class="min-w-0">
                        <div class="flex min-w-0 flex-col items-center">
                          <DeferredSkeleton class="h-4 w-[60px]" />
                          <DeferredSkeleton class="h-4 w-10" />
                        </div>
                      </div>
                    )}
                  </For>
                }
              >
                <For each={getDegenTraitEntries(props.traits!)}>
                  {(trait) => (
                    <div class="min-w-0">
                      <div class="flex min-w-0 flex-col items-center">
                        <span class="break-words text-center font-bold">{trait.name}</span>
                        <span class="break-words text-center">{trait.value}</span>
                      </div>
                    </div>
                  )}
                </For>
              </Show>
            </div>
          </div>
          <div class="flex w-full flex-col gap-2">
            <Show when={props.onClose}>
              <Button variant="default" class="w-full" onClick={props.onClose} autofocus>
                Close
              </Button>
            </Show>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewTraitsContentDialog
