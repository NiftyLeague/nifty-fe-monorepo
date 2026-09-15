import type { JSX } from 'solid-js'
import type { SxProps } from '@/types'
import type { Item } from '@/types/marketplace'
import ImageCard from '@/components/cards/ImageCard'

interface WearableSubItemCardProps {
  data: Item
  itemIndex: number
  sx?: SxProps
  isSelected?: boolean
  onViewItem?: () => void
}

const CARD_WIDTH = 82
const CARD_HEIGHT = 82

const WearableSubItemCard = (props: WearableSubItemCardProps & { children?: JSX.Element }) => {
  const handleViewItem = (e: MouseEvent) => {
    e.stopPropagation()
    props.onViewItem?.()
  }

  return (
    <div
      class="flex cursor-pointer flex-col items-center gap-5"
      style={props.sx as JSX.CSSProperties | undefined}
      onClick={handleViewItem}
    >
      <div
        class="relative overflow-hidden rounded-[10px]"
        style={{
          width: `${CARD_WIDTH}px`,
          height: `${CARD_HEIGHT}px`,
          outline: props.isSelected ? '3px solid var(--color-purple)' : 'none',
        }}
      >
        <ImageCard
          image={props.data.image}
          imageWebp={props.data.imageWebp}
          thumbnail={props.data.thumbnail}
          title={props.data.title}
          ratio={1}
        />
      </div>
      <span
        class="text-center"
        style={{
          'max-width': `${CARD_WIDTH}px`,
          color: props.isSelected ? 'var(--color-blue)' : 'var(--color-foreground)',
        }}
      >{`${props.data.title} #${props.itemIndex + 1}`}</span>
    </div>
  )
}

export default WearableSubItemCard
