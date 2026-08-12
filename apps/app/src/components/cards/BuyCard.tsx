import { ShoppingCart } from 'lucide-react'
import useComicDimension from '@/hooks/useComicDimension'

export interface BuyCardProps {
  isNew: boolean
  onBuy: () => void
}

const BuyCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<BuyCardProps>>> = ({
  isNew,
  onBuy,
}) => {
  const { width: cardWidth, height: cardHeight } = useComicDimension()

  const handleBuyComic = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    onBuy()
  }

  return (
    <div
      onClick={handleBuyComic}
      className="flex cursor-pointer flex-col items-center justify-center rounded-[5px] border border-[#363636]"
      style={{ width: cardWidth, height: cardHeight }}
    >
      <ShoppingCart
        aria-hidden="true"
        absoluteStrokeWidth
        color="var(--color-purple)"
        size={cardWidth - 50}
        strokeWidth={3}
      />
      <span className="mt-0.5 text-purple underline">{isNew ? 'Buy' : 'Buy More'}</span>
    </div>
  )
}

export default BuyCard
