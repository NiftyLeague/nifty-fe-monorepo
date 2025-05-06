import { memo } from 'react';
import { CardMedia } from '@mui/material';
import type { Degen } from '@/types/degens';

type CardMediaWithComponent = Partial<React.ComponentProps<typeof CardMedia>> & {
  component?: React.ElementType;
  alt?: string;
  src?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
};

const DegenInternalImage = memo(({ degen }: { degen: Degen }) => {
  let setting: CardMediaWithComponent = {
    sx: { height: 320 },
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
