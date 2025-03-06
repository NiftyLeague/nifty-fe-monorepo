'use client';

import { useEffect, useMemo, useState } from 'react';
import { useEnsAvatar, useEnsName } from 'wagmi';
import { normalize } from 'viem/ens';
import { Avatar, Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import { useTheme } from '@nl/theme';

import { formatNumberToDisplay } from '@/utils/numbers';
import { sendUserId } from '@/utils/google-analytics';
import { useGamerProfile } from '@/hooks/useGamerProfile';
import type { ProfileAvatar } from '@/types/account';
import ConnectWrapper from '@/components/wrapper/ConnectWrapper';
import useNetworkContext from '@/hooks/useNetworkContext';
import useClaimNFTL from '@/hooks/writeContracts/useClaimNFTL';
import useAuth from '@/hooks/useAuth';

const ClaimNFTLView = () => {
  const { isConnected } = useNetworkContext();
  const { balance, claimCallback, loading } = useClaimNFTL();

  return (
    <>
      <Stack direction="column" marginY={2} sx={{ alignItems: 'center' }}>
        {loading ? (
          <Skeleton variant="text" animation="wave" width={80} />
        ) : (
          <Typography fontWeight="bold">{balance ? formatNumberToDisplay(balance) : '0.00'} NFTL</Typography>
        )}
        <Typography>Available to Claim</Typography>
      </Stack>

      <Button variant="contained" fullWidth disabled={!(balance > 0.0 && isConnected)} onClick={claimCallback}>
        Claim NFTL
      </Button>
    </>
  );
};

const UserProfile = () => {
  const { isLoggedIn, isConnected } = useAuth();
  const { palette } = useTheme();
  const { address } = useNetworkContext();
  const ensName = useEnsName({ address, chainId: 1, query: { enabled: isConnected && !!address } });
  const ensAvatar = useEnsAvatar({
    name: normalize(ensName.data as string),
    chainId: 1,
    query: { enabled: isConnected && !!ensName.data },
  });
  const [username, setUserName] = useState<string | undefined>();
  const [avatar, setAvatar] = useState<ProfileAvatar | undefined>(undefined);
  const { profile } = useGamerProfile();

  useEffect(() => {
    if (isLoggedIn && profile) {
      setUserName(profile?.name_cased);
      setAvatar(profile?.avatar);
      sendUserId(profile?.id);
    } else {
      setUserName(undefined);
      setAvatar(undefined);
    }
  }, [profile, isLoggedIn]);

  const displayName = useMemo(() => {
    if (!address) return 'Login to view dashboards';
    const addressSubstring = `${address?.slice(0, 5)}..${address?.slice(-4)}`.toLowerCase();
    if (username?.length && username !== addressSubstring) return username;
    if (ensName.isError || ensName.isLoading) return addressSubstring;
    return ensName.data || addressSubstring;
  }, [address, ensName, username]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      bgcolor={palette.background.default}
      borderRadius={2}
      p={4}
      sx={{ border: `1px solid ${palette.border}` }}
    >
      <Avatar alt="avatar" src={ensAvatar.data || avatar?.url} sx={{ height: 80, width: 80 }} />
      <Stack direction="column" marginY={2} sx={{ alignItems: 'center' }}>
        <Typography whiteSpace="nowrap">{displayName}</Typography>
      </Stack>
      <ConnectWrapper fullWidth>
        <ClaimNFTLView />
      </ConnectWrapper>
    </Box>
  );
};

export default UserProfile;
