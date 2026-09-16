import type { JSX } from 'solid-js'
import type { Item } from '@/types/marketplace'
import ImageCard from '@/components/cards/ImageCard'

interface WearableSubItemCardProps {
  data: Item
  itemIndex: number
  isSelected?: boolean
  onViewItem?: () => void
  class?: string
}

const WearableSubItemCard = (props: WearableSubItemCardProps & { children?: JSX.Element }) => {
  const handleViewItem = (e: MouseEvent) => {
    e.stopPropagation()
    props.onViewItem?.()
  }

  return (
    <div class="flex cursor-pointer flex-col items-center gap-5" onClick={handleViewItem}>
      <div
        class={`relative w-20.5 h-20.5 overflow-hidden rounded-lg ${props.isSelected ? 'outline-3 outline-purple' : 'outline-none'}`}
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
        class={`text-center max-w-20.5 ${props.isSelected ? 'text-blue' : 'text-foreground'}`}
      >{`${props.data.title} #${props.itemIndex + 1}`}</span>
    </div>
  )
}

export default WearableSubItemCard
