import { CardMedia, Box } from '@mui/material';
import useImageOnLoad from '@/hooks/useImageOnLoad';

interface ImageCardProps {
  thumbnail?: string;
  image?: string;
  title: string;
  ratio: number;
}

const styleImage = { imageWrapper: { height: 0, width: '100%' }, imageCommon: { position: 'absolute', width: '100%' } };

const ImageCard = ({ image, thumbnail, title, ratio }: ImageCardProps) => {
  const { handleImageOnLoad, css } = useImageOnLoad();
  return (
    <Box sx={{ ...styleImage.imageWrapper, paddingBottom: `${ratio * 100}%` }}>
      {thumbnail && (
        <CardMedia
          onLoad={handleImageOnLoad}
          component="img"
          image={thumbnail}
          alt={`thumbnail-${title}`}
          sx={{ ...styleImage.imageCommon, ...css.thumbnail }}
        />
      )}
      {image && (
        <CardMedia
          onLoad={handleImageOnLoad}
          component="img"
          image={image}
          alt={title}
          sx={{ height: '100%', ...styleImage.imageCommon, ...css.fullSize }}
        />
      )}
    </Box>
  );
};

export default ImageCard;
