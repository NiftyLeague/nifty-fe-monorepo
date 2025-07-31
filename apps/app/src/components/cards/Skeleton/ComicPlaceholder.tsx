import { Skeleton } from '@mui/material';
import useComicDimension from '@/hooks/useComicDimension';

const ComicPlaceholder = () => {
  const { width, height } = useComicDimension();
  return (
    <Skeleton variant="rectangular" width={width} height={height} sx={{ borderRadius: 'var(--radius-default)' }} />
  );
};

export default ComicPlaceholder;
