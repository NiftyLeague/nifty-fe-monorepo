import { For, Show, type JSX } from 'solid-js'
import type { SxProps } from '@/types'
import type { Comic } from '@/types/marketplace'
import ImageCard from '@/components/cards/ImageCard'
import useComicDimension from '@/hooks/useComicDimension'

interface ComicCardProps {
  data: Comic
  sx?: SxProps
  isSelected?: boolean
  onViewComic?: () => void
}

interface ComicCardPaneProps {
  data: Comic
  sx?: SxProps
  width: number
  height: number
}

const ComicCardPane = (props: ComicCardPaneProps) => {
  return (
    <div style={props.sx as JSX.CSSProperties | undefined}>
      <div
        class="relative overflow-hidden rounded-[5px]"
        style={{ width: `${props.width}px`, height: `${props.height}px` }}
      >
        <ImageCard
          image={props.data.image}
          thumbnail={props.data.thumbnail}
          title={props.data.title}
          ratio={1}
        />
      </div>
    </div>
  )
}

const ComicCard = (props: ComicCardProps): JSX.Element => {
  const dimensions = useComicDimension()

  const handleViewComic = (e: MouseEvent) => {
    e.stopPropagation()
    props.onViewComic?.()
  }

  return (
    <Show
      when={props.data.balance}
      fallback={
        <div
          class="rounded-[5px] border border-[#363636]"
          style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
        />
      }
    >
      <div
        onClick={handleViewComic}
        class="relative cursor-pointer"
        style={{
          'border-radius': 'var(--radius-default)',
          outline: props.isSelected ? '3px solid var(--color-purple)' : 'none',
        }}
      >
        <Show
          when={props.data.balance === 1}
          fallback={
            <div
              class="relative"
              style={{
                width: `${dimensions.width + 24}px`,
                height: `${dimensions.height + 16}px`,
              }}
            >
              <For each={[0, 1, 2]}>
                {(item) => (
                  <ComicCardPane
                    data={props.data}
                    width={dimensions.width}
                    height={dimensions.height}
                    sx={{
                      position: 'absolute',
                      'z-index': `${2 - item}`,
                      top: `${item * 8}px`,
                      left: `${(item + 1) * 8}px`,
                    }}
                  />
                )}
              </For>
              <div
                class="absolute bottom-0 left-0 flex items-center justify-center"
                style={{
                  width: '38px',
                  height: '35px',
                  background: '#8F4BF4',
                  'border-radius': 'var(--radius-default)',
                  'z-index': '3',
                }}
              >
                <span class="text-[20px] font-bold text-foreground">{props.data.balance}</span>
              </div>
            </div>
          }
        >
          <ComicCardPane data={props.data} width={dimensions.width} height={dimensions.height} />
        </Show>
      </div>
    </Show>
  )
}

export default ComicCard
