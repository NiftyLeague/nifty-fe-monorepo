import { For, Show, type JSX } from 'solid-js'
import NativeImage from '@nl/ui/custom/native-image'
import { cn } from '@nl/ui/utils'
import type { Item } from '@/types/marketplace'
import ImageCard from '@/components/cards/ImageCard'

interface WearableItemCardProps {
  data: Item
  isSelected?: boolean
  onViewItem?: () => void
}

interface WearableItemCardPaneProps {
  data: Item
  width: number
  height: number
  class?: string
}

const WearableItemCardPane = (props: WearableItemCardPaneProps) => {
  return (
    <div
      class={cn('relative overflow-hidden rounded-lg w-(--pane-w) h-(--pane-h)', props.class)}
      style={{
        '--pane-w': `${props.width}px`,
        '--pane-h': `${props.height}px`,
      }}
    >
      <div class="relative">
        <ImageCard
          image={props.data.image}
          imageWebp={props.data.imageWebp}
          thumbnail={props.data.thumbnail}
          title={props.data.title}
          ratio={1}
        />
      </div>
    </div>
  )
}

const CARD_WIDTH = 106
const CARD_HEIGHT = 106
// Stacked panes: z-index 2/1/0, offset 0/8/16px down and 8/16/24px right.
const STACK_Z = ['z-2', 'z-1', 'z-0'] as const
const STACK_TOP = ['top-0', 'top-2', 'top-4'] as const
const STACK_LEFT = ['left-2', 'left-4', 'left-6'] as const

const WearableItemCard = (props: WearableItemCardProps & { children?: JSX.Element }) => {
  const handleViewItem = (e: MouseEvent) => {
    e.stopPropagation()
    props.onViewItem?.()
  }

  return (
    <Show
      when={props.data.balance}
      fallback={
        <div class="flex w-32.5 h-32.5 items-center justify-center">
          <div class="flex w-26.5 h-26.5 items-center justify-center rounded-lg border border-(--card-border)">
            <NativeImage
              src={props.data.empty as string}
              alt={props.data.title}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              unoptimized
            />
          </div>
        </div>
      }
    >
      <div class="relative">
        <Show when={props.data.isNew}>
          <span class="absolute -top-4 w-full text-center text-(--accent-gold)">New!</span>
        </Show>
        <div
          onClick={handleViewItem}
          class="relative flex w-32.5 h-32.5 cursor-pointer items-center justify-center rounded-lg"
        >
          <Show
            when={props.data.balance === 1}
            fallback={
              <>
                <For each={[0, 1, 2]}>
                  {(item) => (
                    <WearableItemCardPane
                      data={props.data}
                      width={CARD_WIDTH}
                      height={CARD_HEIGHT}
                      class={cn(
                        'absolute border border-border',
                        STACK_Z[item],
                        STACK_TOP[item],
                        STACK_LEFT[item]
                      )}
                    />
                  )}
                </For>
                <div class="absolute bottom-0 left-0 flex w-9.5 h-8.75 items-center justify-center rounded-lg bg-(--count-purple) z-3">
                  <span class="text-xl font-bold text-foreground">{props.data.balance}</span>
                </div>
              </>
            }
          >
            <WearableItemCardPane
              data={props.data}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              class={props.isSelected ? 'outline-3 outline-purple' : 'outline-none'}
            />
          </Show>
        </div>
      </div>
    </Show>
  )
}

export default WearableItemCard
