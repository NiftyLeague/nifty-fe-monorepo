import { IconButton, Stack } from '@mui/material';
import { Icon } from '@nl/ui/base/icon';

export interface PaginationIconOnlyProps {
  hasNext?: boolean;
  hasPrev?: boolean;
  onClickPrev?: React.MouseEventHandler<HTMLButtonElement>;
  onClickNext?: React.MouseEventHandler<HTMLButtonElement>;
}

const PaginationIconOnly: React.FC<React.PropsWithChildren<React.PropsWithChildren<PaginationIconOnlyProps>>> = ({
  hasNext,
  hasPrev,
  onClickPrev,
  onClickNext,
}) => (
  <Stack direction="row" gap={1}>
    <IconButton disabled={hasPrev === false} onClick={onClickPrev}>
      <Icon name="chevron-left" size="sm" />
    </IconButton>
    <IconButton disabled={hasNext === false} onClick={onClickNext}>
      <Icon name="chevron-right" size="sm" />
    </IconButton>
  </Stack>
);

export default PaginationIconOnly;
