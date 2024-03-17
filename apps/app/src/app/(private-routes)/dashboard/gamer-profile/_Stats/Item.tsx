import { Stack, Typography, Skeleton } from '@mui/material';
import { useTheme } from '@nl/theme';

interface ItemProps {
  label?: string;
  value?: string | number;
  isDisable?: boolean;
  isLoading?: boolean;
}

const Item = ({ label, value, isDisable = false, isLoading = true }: ItemProps): JSX.Element => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography color={isDisable ? theme.palette.grey[400] : 'white'}>{label}:</Typography>
      {isLoading ? (
        <Skeleton variant="rectangular" width="15%" height="18.67px" />
      ) : (
        <Typography color={isDisable ? theme.palette.grey[400] : theme.palette.warning.main} fontWeight="bold">
          {value}
        </Typography>
      )}
    </Stack>
  );
};

export default Item;
