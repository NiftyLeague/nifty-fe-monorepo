import { memo } from 'react';
import { CardMedia } from '@mui/material';
import type { Degen } from '@/types/degens';

const DegenInternalImage = memo(({ degen }: { degen: Degen }) => {
  let setting: any = {
    height: 320,
    component: 'img',
    image: degen?.url,
    alt: degen?.name,
  };
  if (degen?.background === 'legendary') {
    setting = {
      ...setting,
      component: 'video',
      autoPlay: true,
      loop: true,
      muted: true,
    };
  }
  return <CardMedia {...setting} />;
});

DegenInternalImage.displayName = 'DegenInternalImage';
export default DegenInternalImage;
