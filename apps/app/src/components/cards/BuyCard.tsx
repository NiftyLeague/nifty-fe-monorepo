import { ShoppingCart } from 'lucide-solid'
import useComicDimension from '@/hooks/useComicDimension'

interface BuyCardProps {
  isNew: boolean
  onBuy: () => void
}

const BuyCard = (props: BuyCardProps) => {
  const { isNew, onBuy } = props
  const { width: cardWidth, height: cardHeight } = useComicDimension()

  const handleBuyComic = (e: MouseEvent & { currentTarget: HTMLDivElement }) => {
    e.stopPropagation()
    onBuy()
  }

  return (
    <div
      onClick={handleBuyComic}
      class="flex w-(--card-w) h-(--card-h) cursor-pointer flex-col items-center justify-center rounded-sm border border-(--card-border)"
      style={{ '--card-w': `${cardWidth}px`, '--card-h': `${cardHeight}px` }}
    >
      <ShoppingCart
        aria-hidden="true"
        absoluteStrokeWidth
        color="var(--color-purple)"
        size={cardWidth - 50}
        strokeWidth={3}
      />
      <span class="mt-0.5 text-purple underline">{isNew ? 'Buy' : 'Buy More'}</span>
    </div>
  )
}

export default BuyCard
