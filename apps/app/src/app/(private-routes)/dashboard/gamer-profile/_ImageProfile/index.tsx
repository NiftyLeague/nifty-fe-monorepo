'use client';

import { useEffect, useState } from 'react';
import { Box, Skeleton, CardMedia } from '@mui/material';

import DegenImage from '@/components/cards/DegenCard/DegenImage';
import { useGamerProfileContext } from '@/hooks/useGamerProfile';
import ProfileImageDialog from './ProfileImageDialog';

import type { Degen } from '@/types/degens';
import type { ProfileAvatar } from '@/types/account';

interface ImageProfileProps {
  degens: Degen[] | undefined;
  avatar?: ProfileAvatar;
  avatarFee?: number;
}

const ImageProfile = ({ degens, avatar, avatarFee }: ImageProfileProps): React.ReactNode => {
  const { isLoadingDegens } = useGamerProfileContext();
  const [degenSelected, setDegenSelected] = useState<string>('');

  useEffect(() => {
    if (avatar?.id) {
      setDegenSelected(avatar?.id);
      return;
    }
    if (degens && degens[0]) {
      setDegenSelected(degens[0].id);
      return;
    }
  }, [degens, avatar]);

  const handleChangeAvatar = (degenId: string) => {
    if (degenId) {
      setDegenSelected(degenId);
    }
  };

  const renderImage = () => {
    if (isLoadingDegens) {
      return <Skeleton variant="rectangular" width="100%" height="320px" />;
    } else {
      if (!degenSelected) {
        return (
          <CardMedia
            component="img"
            height="auto"
            image="/img/degens/unavailable-image.webp"
            alt="no avatar"
            sx={{ objectFit: 'cover', maxWidth: '500px', margin: 'auto' }}
          />
        );
      }
      return <DegenImage tokenId={degenSelected} sx={{ maxWidth: '500px' }} />;
    }
  };

  return (
    <>
      <Box sx={{ '& img': { borderRadius: 'var(--radius-default)' } }} position="relative">
        {renderImage()}
        {degens && degens.length > 0 && (
          <ProfileImageDialog onChangeAvatar={handleChangeAvatar} degens={degens} avatarFee={avatarFee} />
        )}
      </Box>
    </>
  );
};

export default ImageProfile;
