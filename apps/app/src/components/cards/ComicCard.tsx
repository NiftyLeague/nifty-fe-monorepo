import { For, Show } from 'solid-js'
import type { JSX } from 'solid-js'
import type { Comic } from '@/types/marketplace'
import ImageCard from '@/components/cards/ImageCard'
import useComicDimension from '@/hooks/useComicDimension'
import { cn } from '@nl/ui/utils'

interface ComicCardProps {
  data: Comic
  isSelected?: boolean
  onViewComic?: () => void
}

interface ComicCardPaneProps {
  data: Comic
  width: number
  height: number
  class?: string
}

const ComicCardPane = (props: ComicCardPaneProps) => {
  return (
    <div class={props.class}>
      <div
        class="relative overflow-hidden rounded-sm w-(--pane-w) h-(--pane-h)"
        style={{ '--pane-w': `${props.width}px`, '--pane-h': `${props.height}px` }}
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

// Stacked panes: z-index 2/1/0, offset 0/8/16px down and 8/16/24px right.
const STACK_Z = ['z-2', 'z-1', 'z-0'] as const
const STACK_TOP = ['top-0', 'top-2', 'top-4'] as const
const STACK_LEFT = ['left-2', 'left-4', 'left-6'] as const

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
          class="rounded-sm border border-(--card-border) w-(--dim-w) h-(--dim-h)"
          style={{ '--dim-w': `${dimensions.width}px`, '--dim-h': `${dimensions.height}px` }}
        />
      }
    >
      <div
        onClick={handleViewComic}
        class={`relative cursor-pointer rounded-(--radius-default) ${props.isSelected ? 'outline-3 outline-purple' : 'outline-none'}`}
      >
        <Show
          when={props.data.balance === 1}
          fallback={
            <div
              class="relative w-(--stack-w) h-(--stack-h)"
              style={{
                '--stack-w': `${dimensions.width + 24}px`,
                '--stack-h': `${dimensions.height + 16}px`,
              }}
            >
              <For each={[0, 1, 2]}>
                {(item) => (
                  <ComicCardPane
                    data={props.data}
                    width={dimensions.width}
                    height={dimensions.height}
                    class={cn('absolute', STACK_Z[item], STACK_TOP[item], STACK_LEFT[item])}
                  />
                )}
              </For>
              <div class="absolute bottom-0 left-0 flex w-9.5 h-8.75 items-center justify-center bg-(--count-purple) rounded-(--radius-default) z-3">
                <span class="text-xl font-bold text-foreground">{props.data.balance}</span>
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
