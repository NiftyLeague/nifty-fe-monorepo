import { ShoppingCart } from 'lucide-solid'
import useComicDimension from '@/hooks/useComicDimension'

interface BuyCardProps {
  isNew: boolean
  onBuy: () => void
}

const BuyCard = (props: BuyCardProps) => {
  const dimension = useComicDimension()

  const handleBuyComic = (e: MouseEvent & { currentTarget: HTMLDivElement }) => {
    e.stopPropagation()
    props.onBuy()
  }

  return (
    <div
      onClick={handleBuyComic}
      class="flex w-(--card-w) h-(--card-h) cursor-pointer flex-col items-center justify-center rounded-sm border border-(--card-border)"
      style={{ '--card-w': `${dimension.width}px`, '--card-h': `${dimension.height}px` }}
    >
      <ShoppingCart
        aria-hidden="true"
        absoluteStrokeWidth
        color="var(--color-purple)"
        size={dimension.width - 50}
        strokeWidth={3}
      />
      <span class="mt-0.5 text-purple underline">{props.isNew ? 'Buy' : 'Buy More'}</span>
    </div>
  )
}

export default BuyCard
