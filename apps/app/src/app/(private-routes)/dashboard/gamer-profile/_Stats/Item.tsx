import { Stack, Typography, Skeleton } from '@mui/material';

interface ItemProps {
  label?: string;
  value?: string | number;
  isDisable?: boolean;
  isLoading?: boolean;
}

const Item = ({ label, value, isDisable = false, isLoading = true }: ItemProps): React.ReactNode => (
  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
    <Typography sx={{ color: theme => (isDisable ? 'var(--color-muted-foreground)' : 'var(--color-foreground)') }}>
      {label}:
    </Typography>
    {isLoading ? (
      <Skeleton variant="rectangular" width="15%" height="18.67px" />
    ) : (
      <Typography
        sx={{ color: isDisable ? 'var(--color-muted-foreground)' : 'var(--color-warning)' }}
        fontWeight="bold"
      >
        {value}
      </Typography>
    )}
  </Stack>
);

export default Item;
