'use client';

import { useEffect, useState } from 'react';
import { Stack, Typography, Box, IconButton } from '@mui/material';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { useTheme } from '@nl/theme';

import { useGamerProfileContext } from '@/hooks/useGamerProfile';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import type { Profile } from '@/types/account';

import ProgressGamer from './ProgressGamer';
import ChangeProfileNameDialog from './ChangeProfileNameDialog';
import TopInfoSkeleton from './TopInfoSkeleton';

interface TopInfoProps {
  profile: Profile | undefined;
  walletAddress: string;
}

const TopInfo = ({ profile, walletAddress }: TopInfoProps): JSX.Element => {
  const theme = useTheme();
  const [profileName, setProfileName] = useState<string>('Unknown');
  const { isLoadingProfile } = useGamerProfileContext();
  const [, copy] = useCopyToClipboard();
  const total = profile?.stats?.total;

  useEffect(() => {
    if (profile && profile?.name_cased) {
      setProfileName(profile.name_cased);
    }
  }, [profile]);

  const handleUpdateNewName = (newName: string) => {
    setProfileName(newName);
  };

  const renderTopInfo = () => {
    return (
      <Stack>
        <Stack direction="row" alignItems="center" spacing={5}>
          <Box width="50%">
            <Typography variant="h2" component="div">
              {profileName} <ChangeProfileNameDialog handleUpdateNewName={handleUpdateNewName} />
            </Typography>
          </Box>
          <Box width="50%">{total && <ProgressGamer data={total} />}</Box>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={5}>
          <Typography width="50%" variant="h4" component="div" color={theme.palette.grey[400]}>
            {`${walletAddress.slice(0, 5)}...${walletAddress.slice(
              walletAddress.length - 5,
              walletAddress.length - 1,
            )}`}{' '}
            <IconButton
              sx={{
                cursor: 'pointer',
              }}
              aria-label="copy"
              onClick={() => walletAddress && copy(walletAddress)}
            >
              <ContentCopyOutlinedIcon
                fontSize="small"
                sx={{
                  color: theme.palette.grey[400],
                }}
              />
            </IconButton>
          </Typography>
          <Typography width="50%" variant="h4" component="div">
            {Math.round(total?.xp || 0)}/{total?.rank_xp_next}
            <Typography variant="h4" component="div" color={theme.palette.grey[400]} display="inline" ml="4px">
              XP
            </Typography>
          </Typography>
        </Stack>
      </Stack>
    );
  };

  return isLoadingProfile ? <TopInfoSkeleton /> : renderTopInfo();
};

export default TopInfo;
