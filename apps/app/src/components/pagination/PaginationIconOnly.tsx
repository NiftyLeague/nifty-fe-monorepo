import { Button } from '@nl/ui/base/button'
import { Icon } from '@nl/ui/base/icon'

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
    >
      <Icon name="chevron-left" size="sm" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer"
      disabled={hasNext === false}
      onClick={onClickNext}
    >
      <Icon name="chevron-right" size="sm" />
    </Button>
  </div>
)

export default PaginationIconOnly
