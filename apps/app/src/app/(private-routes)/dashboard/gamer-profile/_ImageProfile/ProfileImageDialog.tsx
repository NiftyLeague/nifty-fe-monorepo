'use client';

import { useContext, useState, useEffect } from 'react';
import { IconButton, Box, Typography, Stack } from '@mui/material';
import { toast } from 'react-toastify';

import { Icon } from '@nl/ui/base/icon';
import { Dialog, DialogTrigger, DialogContent, DialogContext } from '@/components/dialog';
import SectionSlider from '@/components/sections/SectionSlider';
import DegenImage from '@/components/cards/DegenCard/DegenImage';
import SearchRental from '@/app/(private-routes)/dashboard/rentals/SearchRental';
import EmptyState from '@/components/EmptyState';
import DegenInternalImage from './DegenInternalImage';

import type { Degen } from '@/types/degens';
import { UPDATE_PROFILE_AVATAR_API } from '@/constants/url';
import useAuth from '@/hooks/useAuth';

type ProfileImageContentProps = {
  onSearch: (currentValue: string) => void;
  onChangeAvatar: (degenId: string) => void;
  degensInternal: Degen[];
  avatarFee?: number;
};

const settings = { className: 'center', slidesToShow: 4, rows: 2, slidesPerRow: 1, swipe: false };

const ProfileImageContent = ({ onSearch, onChangeAvatar, degensInternal, avatarFee }: ProfileImageContentProps) => {
  const [, setIsOpen] = useContext(DialogContext);
  const { authToken } = useAuth();

  const handleSelectedDegen = async (degen: Degen) => {
    if (!degen?.id || !authToken) {
      return;
    }

    try {
      const response = await fetch(UPDATE_PROFILE_AVATAR_API, {
        headers: { authorizationToken: authToken },
        method: 'POST',
        body: JSON.stringify({ avatar: degen?.id }),
      });
      if (!response.ok) {
        const errMsg = await response.text();
        toast.error(`Can not update the profile avatar: ${errMsg}`, { theme: 'dark' });
        return;
      }
      toast.success('Update Profile Avatar Successful!', { theme: 'dark' });
      onChangeAvatar(degen?.id);
      setIsOpen(false);
    } catch (error) {
      toast.error(`Can not update the profile avatar: ${error}`, { theme: 'dark' });
    }
  };

  const renderDegenImage = (degen: Degen) => {
    if (degen?.url) {
      return <DegenInternalImage degen={degen} />;
    }
    return <DegenImage tokenId={degen?.id} />;
  };

  const renderDegens = () => {
    if (degensInternal.length > 0) {
      return degensInternal.map(degen => (
        <Box
          key={degen?.id}
          sx={{
            overflow: 'hidden',
            cursor: 'pointer',
            display: 'block !important',
            '&:hover img': { transform: 'scale(1.3)' },
            '& img': { transition: 'transform .5s ease' },
          }}
          onClick={() => handleSelectedDegen(degen)}
        >
          {renderDegenImage(degen)}
        </Box>
      ));
    }
    return (
      <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
        <EmptyState message="No DEGENs found." />
      </Stack>
    );
  };

  return (
    <SectionSlider
      isSlider={degensInternal.length > 0}
      sliderSettingsOverride={settings}
      firstSection
      title={
        <Stack flex={1} gap={1}>
          <Typography variant="h2">Choose a new profile degen</Typography>
          <Typography variant="h5" component="p">
            There is a {avatarFee} NFTL fee for changing your gamer profile avatar
          </Typography>
        </Stack>
      }
      actions={<SearchRental placeholder="Search degen by token # or name" handleSearch={onSearch} />}
    >
      {renderDegens()}
    </SectionSlider>
  );
};

type ProfileImageDialogProps = {
  degens: Degen[] | undefined;
  onChangeAvatar: (degenId: string) => void;
  avatarFee?: number;
};

const ProfileImageDialog = ({ degens, onChangeAvatar, avatarFee }: ProfileImageDialogProps): React.ReactNode => {
  const [degensInternal, setDegensInternal] = useState<Degen[]>([]);

  useEffect(() => {
    if (degens) {
      setDegensInternal(degens);
    }
  }, [degens]);

  const handleSearch = (currentValue: string) => {
    if (currentValue?.trim() === '' && degens) {
      setDegensInternal(degens);
      return;
    }
    const newCurrentValue = currentValue.toLowerCase();
    const newDegen: Degen[] | undefined = degens?.filter(
      (degen: Degen) =>
        degen?.id.toLowerCase().includes(newCurrentValue) || degen?.name.toLowerCase().includes(newCurrentValue),
    );
    if (newDegen) {
      setDegensInternal(newDegen);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <IconButton
          sx={{ cursor: 'pointer', position: 'absolute', top: 1, left: 1 }}
          aria-label="edit"
          onClick={() => null}
        >
          <Icon name="edit" size="xl" strokeWidth={2.5} />
        </IconButton>
      </DialogTrigger>
      <DialogContent
        aria-labelledby="profile-image-dialog"
        sx={{ '& .MuiPaper-root': { maxWidth: '1000px' }, '& .MuiDialogContent-root': { border: 'none' } }}
      >
        <ProfileImageContent
          onSearch={handleSearch}
          onChangeAvatar={onChangeAvatar}
          degensInternal={degensInternal}
          avatarFee={avatarFee}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProfileImageDialog;
