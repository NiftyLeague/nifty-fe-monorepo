import { CardContent, CardActions, Skeleton, Stack } from '@mui/material';
import MainCard from '../MainCard';

interface DegenPlaceholderProps {
  size?: 'normal' | 'small';
}

const DegenPlaceholder = ({ size = 'normal' }: DegenPlaceholderProps) => (
  <MainCard content={false} boxShadow={false} border={false}>
    <Skeleton variant="rectangular" height={size === 'small' ? 200 : 320} />
    <CardContent sx={{ pb: 0, pt: 1 }}>
      <Stack direction="row" justifyContent="space-between" gap={1} sx={{ mb: 1 }}>
        <Skeleton variant="rectangular" width={100} height={32} />
        <Skeleton variant="rectangular" width={100} height={32} />
        <Skeleton variant="rectangular" width={100} height={32} />
      </Stack>
      <Stack direction="row" mb="10px">
        <Skeleton variant="rectangular" width="100%" height={20} />
      </Stack>
      <Stack direction="row" justifyContent="space-between" gap={1}>
        <Skeleton variant="rectangular" width="100%" height={21} />
        <Skeleton variant="rectangular" width="100%" height={21} />
      </Stack>
    </CardContent>
    <CardActions>
      <Skeleton variant="rectangular" width="100%" height={36.5} />
      <Skeleton variant="rectangular" width="100%" height={36.5} />
    </CardActions>
  </MainCard>
);

export default DegenPlaceholder;
