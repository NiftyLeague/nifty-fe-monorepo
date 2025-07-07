import { memo, ElementType } from 'react';
import CardMedia, { type CardMediaProps } from '@mui/material/CardMedia';
import { LEGGIES } from '@/constants/degens';
const IMAGE_HEIGHT = 320;

const DegenImage = memo(({ tokenId, sx }: { tokenId: string | number; sx?: CardMediaProps['sx'] }) => {
  const imageURL = `/img/degens/nfts/${tokenId}`;

  const sxHeight = sx && typeof sx === 'object' && 'height' in sx ? (sx.height as string | number) : undefined;
  const imageHeight = sxHeight ?? IMAGE_HEIGHT;
  const setting: { height: string | number; component: ElementType; image: string } = {
    height: imageHeight,
    component: 'img',
    image: `${imageURL}.webp`,
  };

  if (LEGGIES.includes(Number(tokenId))) {
    setting.image = `${imageURL}.gif`;
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement, Event>) => {
    const target = e.target as HTMLImageElement | HTMLVideoElement;
    target.onerror = null;
    target.src = '/img/degens/unavailable-image.webp';
  };

  return <CardMedia className="pixelated" sx={{ objectFit: 'cover', ...sx }} {...setting} onError={handleImageError} />;
});

DegenImage.displayName = 'DegenImage';
export default DegenImage;
