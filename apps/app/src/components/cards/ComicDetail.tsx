import { Box } from '@mui/material';
import type { Comic } from '@/types/comic';
import ImageCard from '@/components/cards/ImageCard';

export interface ComicDetailProps {
  data: Comic | null;
}

const ComicDetail: React.FC<React.PropsWithChildren<React.PropsWithChildren<ComicDetailProps>>> = ({ data }) => {
  if (!data) return <Box border="1px solid #363636" borderRadius="5px" minWidth={345} height={375} />;

  const { image, title, thumbnail } = data;

  return (
    <Box borderRadius="5px" position="relative" overflow="hidden" minWidth={345} height={350} margin="auto">
      <ImageCard image={image} thumbnail={thumbnail} title={title} ratio={1} />
    </Box>
  );
};

export default ComicDetail;
