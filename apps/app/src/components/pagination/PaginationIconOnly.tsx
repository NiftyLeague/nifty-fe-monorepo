import { PaginationControls } from './PaginationControls'

export interface PaginationIconOnlyProps {
  hasNext?: boolean
  hasPrev?: boolean
  onClickPrev?: React.MouseEventHandler<HTMLButtonElement>
  onClickNext?: React.MouseEventHandler<HTMLButtonElement>
}

const PaginationIconOnly: React.FC<PaginationIconOnlyProps> = ({
  hasNext = true,
  hasPrev = true,
  onClickPrev = () => undefined,
  onClickNext = () => undefined,
}) => (
  <PaginationControls
    hasNext={hasNext}
    hasPrev={hasPrev}
    onClickNext={onClickNext}
    onClickPrev={onClickPrev}
  />
)

export default PaginationIconOnly
