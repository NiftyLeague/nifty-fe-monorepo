'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useEnsAvatar, useEnsName } from 'wagmi';
import { normalize } from 'viem/ens';
import { Avatar, Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import { useTheme } from '@nl/theme';

import { DEBUG } from '@/constants/index';
import { formatNumberToDisplay } from '@/utils/numbers';
import { NFTL_CONTRACT } from '@/constants/contracts';
import { sendUserId } from '@/utils/google-analytics';
import { useGamerProfile } from '@/hooks/useGamerProfile';
import type { ProfileAvatar } from '@/types/account';
import useNFTsBalances from '@/hooks/balances/useNFTsBalances';
import useTokensBalances from '@/hooks/balances/useTokensBalances';
import ConnectWrapper from '@/components/wrapper/ConnectWrapper';
import useNetworkContext from '@/hooks/useNetworkContext';
import useAuth from '@/hooks/useAuth';

const ClaimNFTLView = () => {
  const { writeContracts, tx } = useNetworkContext();
  const { degenTokenIndices } = useNFTsBalances();
  const { totalAccruedNFTL, loadingNFTLAccrued, refreshClaimableNFTL } = useTokensBalances();
  const [mockAccumulated, setMockAccumulated] = useState(0);

  useEffect(() => {
    if (totalAccruedNFTL) setMockAccumulated(totalAccruedNFTL);
  }, [totalAccruedNFTL]);

  const handleClaimNFTL = useCallback(async () => {
    // eslint-disable-next-line no-console
    if (DEBUG) console.log('CLAIM NFTL', degenTokenIndices, totalAccruedNFTL);
    await tx(writeContracts[NFTL_CONTRACT].claim(degenTokenIndices));
    setMockAccumulated(0);
    setTimeout(refreshClaimableNFTL, 5000);
  }, [refreshClaimableNFTL, degenTokenIndices, totalAccruedNFTL, tx, writeContracts]);

  return (
    <>
      <Stack direction="column" marginY={2} sx={{ alignItems: 'center' }}>
        {loadingNFTLAccrued ? (
          <Skeleton variant="text" animation="wave" width={80} />
        ) : (
          <Typography fontWeight="bold">
            {mockAccumulated ? formatNumberToDisplay(mockAccumulated) : '0.00'} NFTL
          </Typography>
        )}
        <Typography>Available to Claim</Typography>
      </Stack>

      <Button
        variant="contained"
        fullWidth
        disabled={!(mockAccumulated > 0.0 && writeContracts[NFTL_CONTRACT])}
        onClick={handleClaimNFTL}
      >
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
    }
  }, [profile, isLoggedIn]);

  const displayName = useMemo(() => {
    if (username?.length) return username;
    if (!address) return 'Login to view dashboards';
    const addressSubstring = `${address?.slice(0, 5)}...${address?.slice(address.length - 5, address.length - 1)}`;
    if (ensName.isError || ensName.isLoading) return addressSubstring;
    return ensName.data || addressSubstring;
  }, [ensName, username, address]);

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
