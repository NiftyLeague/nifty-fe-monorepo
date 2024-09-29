'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Button, Stack, Typography } from '@mui/material';

import useAuth from '@/hooks/useAuth';
import useNFTsBalances from '@/hooks/balances/useNFTsBalances';
import ErrorBoundary from '@/components/wrapper/ErrorBoundary';
import Preloader from '@/components/Preloader';
import { DEGEN_COLLECTION_URL } from '@/constants/url';

const CharacterCreator = dynamic(() => import('./_CharacterCreator'), {
  ssr: false,
});

const MintPage = () => {
  const [isLoaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const { isDegenOwner } = useNFTsBalances();
  const { isConnected, isLoggedIn, handleConnectWallet } = useAuth();

  const searchParams = useSearchParams();
  const { nifty_artists: isForNiftyArtists } = Object.fromEntries(searchParams.entries());

  if (!isForNiftyArtists) {
    if (!isLoggedIn) {
      return (
        <Stack width="100%" height="100%" sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h3" component="div" textAlign="center">
            Please connect your wallet
          </Typography>
          <Button variant="contained" color="primary" onClick={handleConnectWallet} sx={{ mt: 4 }}>
            {isConnected ? 'Log In' : 'Connect Wallet'}
          </Button>
        </Stack>
      );
    }

    if (!isDegenOwner) {
      return (
        <Stack width="100%" height="100%" sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h3" component="div" textAlign="center">
            This page is accessible to DEGEN owners only.
          </Typography>
          <Link href={DEGEN_COLLECTION_URL} target="_blank" rel="noreferrer">
            <Button variant="contained" color="primary" sx={{ mt: 4 }}>
              Buy A DEGEN
            </Button>
          </Link>
        </Stack>
      );
    }
  }

  return (
    <div style={{ textAlign: 'center', overflowX: 'hidden' }}>
      <ErrorBoundary>
        <Preloader ready={isLoaded} progress={progress} />
        <CharacterCreator isLoaded={isLoaded} setLoaded={setLoaded} setProgress={setProgress} />
      </ErrorBoundary>
    </div>
  );
};

export default MintPage;
