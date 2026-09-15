import { For, Show, type JSX } from 'solid-js'
import NativeImage from '@nl/ui/custom/native-image'
import type { SxProps } from '@/types'
import type { Item } from '@/types/marketplace'
import ImageCard from '@/components/cards/ImageCard'

interface WearableItemCardProps {
  data: Item
  sx?: SxProps
  isSelected?: boolean
  onViewItem?: () => void
}

interface WearableItemCardPaneProps {
  data: Item
  sx?: SxProps
  width: number
  height: number
}

const WearableItemCardPane = (props: WearableItemCardPaneProps) => {
  return (
    <div
      class="relative overflow-hidden rounded-[10px]"
      style={{
        width: `${props.width}px`,
        height: `${props.height}px`,
        ...(props.sx as JSX.CSSProperties | undefined),
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

const WearableItemCard = (props: WearableItemCardProps & { children?: JSX.Element }) => {
  const handleViewItem = (e: MouseEvent) => {
    e.stopPropagation()
    props.onViewItem?.()
  }

  return (
    <Show
      when={props.data.balance}
      fallback={
        <div
          class="flex items-center justify-center"
          style={{ width: `${CARD_WIDTH + 24}px`, height: `${CARD_HEIGHT + 24}px` }}
        >
          <div
            class="flex items-center justify-center rounded-[10px] border border-[#363636]"
            style={{ width: `${CARD_WIDTH}px`, height: `${CARD_HEIGHT}px` }}
          >
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
          <span class="absolute w-full text-center" style={{ color: '#E3B210', top: '-16px' }}>
            New!
          </span>
        </Show>
        <div
          onClick={handleViewItem}
          class="relative flex cursor-pointer items-center justify-center rounded-[10px]"
          style={{ width: `${CARD_WIDTH + 24}px`, height: `${CARD_HEIGHT + 24}px` }}
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
                      sx={{
                        position: 'absolute',
                        'z-index': `${2 - item}`,
                        top: `${item * 8}px`,
                        left: `${(item + 1) * 8}px`,
                        border: 'var(--border-default)',
                      }}
                    />
                  )}
                </For>
                <div
                  class="absolute bottom-0 left-0 flex items-center justify-center rounded-[10px]"
                  style={{
                    width: '38px',
                    height: '35px',
                    background: '#8F4BF4',
                    'z-index': '3',
                  }}
                >
                  <span class="text-[20px] font-bold text-foreground">
                    {props.data.balance}
                  </span>
                </div>
              </>
            }
          >
            <WearableItemCardPane
              data={props.data}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              sx={{ outline: props.isSelected ? '3px solid var(--color-purple)' : 'none' }}
            />
          </Show>
        </div>
      </div>
    </Show>
  )
}

export default WearableItemCard
