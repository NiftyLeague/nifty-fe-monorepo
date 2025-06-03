import { memo } from 'react';
import { CardMedia, SxProps } from '@mui/material';
import { LEGGIES } from '@/constants/degens';
const IMAGE_HEIGHT = 320;

const DegenImage = memo(({ tokenId, sx }: { tokenId: string | number; sx?: SxProps<{}> }) => {
  const imageURL = `/img/degens/nfts/${tokenId}`;
  // @ts-expect-error Property 'height' does not exist on type 'CSSPseudoSelectorProps<{}>'
  const imageHeight = sx?.height ?? IMAGE_HEIGHT;
  let setting: any = { height: imageHeight, component: 'img', image: `${imageURL}.webp` };

  if (LEGGIES.includes(Number(tokenId))) {
    setting = { ...setting, component: 'video', image: `${imageURL}.gif`, autoPlay: true, loop: true, muted: true };
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement, Event>) => {
    const target = e.target as HTMLImageElement | HTMLVideoElement;
    target.onerror = null;
    target.src = '/img/degens/unavailable-image.webp';
  };

  return <CardMedia sx={{ objectFit: 'cover', ...sx }} {...setting} onError={handleImageError} />;
});

DegenImage.displayName = 'DegenImage';
export default DegenImage;
