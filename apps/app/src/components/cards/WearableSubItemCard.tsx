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
  const { data, itemIndex, onViewItem, sx, isSelected = false } = props
  const { image, imageWebp, thumbnail, title } = data

  const handleViewItem = (e: MouseEvent & { currentTarget: HTMLDivElement }) => {
    e.stopPropagation()
    if (onViewItem) onViewItem()
  }

  return (
    <div
      class="flex cursor-pointer flex-col items-center gap-5"
      style={sx as JSX.CSSProperties | undefined}
      onClick={handleViewItem}
    >
      <div
        class="relative overflow-hidden rounded-[10px]"
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          outline: isSelected ? '3px solid var(--color-purple)' : 'none',
        }}
      >
        <ImageCard
          image={image}
          imageWebp={imageWebp}
          thumbnail={thumbnail}
          title={title}
          ratio={1}
        />
      </div>
      <span
        class="text-center"
        style={{
          'max-width': CARD_WIDTH,
          color: isSelected ? 'var(--color-blue)' : 'var(--color-foreground)',
        }}
      >{`${title} #${itemIndex + 1}`}</span>
    </div>
  )
}

export default WearableSubItemCard
