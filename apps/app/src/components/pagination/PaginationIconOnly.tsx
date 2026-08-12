import { Button } from '@nl/ui/base/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface PaginationIconOnlyProps {
  hasNext?: boolean
  hasPrev?: boolean
  onClickPrev?: React.MouseEventHandler<HTMLButtonElement>
  onClickNext?: React.MouseEventHandler<HTMLButtonElement>
}

const PaginationIconOnly: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<PaginationIconOnlyProps>>
> = ({ hasNext, hasPrev, onClickPrev, onClickNext }) => (
  <div className="flex flex-row gap-2">
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer"
      disabled={hasPrev === false}
      onClick={onClickPrev}
      aria-label="Previous page"
    >
      <ChevronLeft aria-hidden="true" absoluteStrokeWidth size={18} strokeWidth={1.5} />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer"
      disabled={hasNext === false}
      onClick={onClickNext}
      aria-label="Next page"
    >
      <ChevronRight aria-hidden="true" absoluteStrokeWidth size={18} strokeWidth={1.5} />
    </Button>
  </div>
)

export default PaginationIconOnly
