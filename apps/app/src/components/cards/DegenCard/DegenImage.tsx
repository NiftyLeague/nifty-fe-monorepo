import { memo } from 'react';
import { CardMedia, SxProps } from '@mui/material';
import { DEGEN_BASE_IMAGE_URL } from '@/constants/url';
import { TARGET_NETWORK } from '@/constants/networks';
import { LEGGIES } from '@/constants/degens';
const IMAGE_HEIGHT = 320;

const DegenImage = memo(({ tokenId, sx }: { tokenId: string | number; sx?: SxProps<{}> }) => {
  const imageURL = `${DEGEN_BASE_IMAGE_URL}/${TARGET_NETWORK.name}/images/${tokenId}`;
  // @ts-ignore
  const imageHeight = sx?.height ?? IMAGE_HEIGHT;
  let setting: any = {
    height: imageHeight,
    component: 'img',
    image: `${imageURL}.png`,
  };

  if (LEGGIES.includes(Number(tokenId))) {
    setting = {
      ...setting,
      component: 'video',
      image: `${imageURL}.mp4`,
      autoPlay: true,
      loop: true,
      muted: true,
    };
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement, Event>) => {
    const target = e.target as HTMLImageElement | HTMLVideoElement;
    target.onerror = null;
    target.src = '/images/unavailable-image.png';
  };

  return <CardMedia sx={{ objectFit: 'cover', ...sx }} {...setting} onError={handleImageError} />;
});

DegenImage.displayName = 'DegenImage';
export default DegenImage;
