'use client';

import Link from 'next/link';
import Image from 'next/image';
import { styled } from '@nl/theme';
import Grid from '@mui/material/Grid';
import GameCard from '@/components/cards/GameCard';

const GridItem = styled(Grid)(({ theme }) => ({
  paddingRight: 16,
  paddingBottom: 32,
  border: 'none',
  [theme.breakpoints.down('sm')]: { paddingBottom: 0 },
}));

const AppleBadge = ({ disabled = false }) => (
  <Image
    src="/img/badges/apple-store-badge.svg"
    alt="Apple Store Badge"
    width={120}
    height={40}
    loading="eager"
    style={{
      width: '91%',
      maxWidth: '100%',
      height: 'auto',
      display: 'flex',
      margin: 'auto',
      opacity: disabled ? 0.25 : 1,
    }}
  />
);

const GoogleBadge = ({ disabled = false }) => (
  <Image
    src="/img/badges/google-play-badge.webp"
    alt="Get it on Google Play"
    width={564}
    height={169}
    loading="eager"
    style={{ width: '100%', maxWidth: '100%', height: 'auto', opacity: disabled ? 0.25 : 1 }}
  />
);

const SteamBadge = ({ disabled = false }) => (
  <Image
    src="/img/badges/steam-badge.webp"
    alt="Steam Store Badge"
    width={564}
    height={168}
    loading="eager"
    style={{ width: '100%', maxWidth: '100%', height: 'auto', opacity: disabled ? 0.25 : 1 }}
  />
);

type StoreButtonsProps = { android?: string; ios?: string; steam?: string };

const StoreButtons = ({ android, ios, steam }: StoreButtonsProps) => (
  <Grid container spacing={2} style={{ width: '100%' }}>
    <Grid size={4}>
      {android ? (
        <Link href={android} target="_blank" rel="noreferrer">
          <GoogleBadge />
        </Link>
      ) : (
        <GoogleBadge disabled />
      )}
    </Grid>
    <Grid size={4}>
      {ios ? (
        <Link href={ios} target="_blank" rel="noreferrer">
          <AppleBadge />
        </Link>
      ) : (
        <AppleBadge disabled />
      )}
    </Grid>
    <Grid size={4}>
      {steam ? (
        <Link href={steam} target="_blank" rel="noreferrer">
          <SteamBadge />
        </Link>
      ) : (
        <SteamBadge disabled />
      )}
    </Grid>
  </Grid>
);

const F2PGameList = () => (
  <>
    <GridItem size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }}>
      <GameCard
        title="Nifty Smashers (Beta)"
        required="Party Platform Fighter"
        description="Our flagship game - free-to-play, online multiplayer, PARTY platform fighter. Play on iOS, Android, and Steam with full cross-play support!"
        image="/img/games/smashers/smashers.gif"
        onlineCounter={200}
        autoHeight={false}
        actions={
          <StoreButtons
            android="https://niftysmashers.com/android"
            ios="https://niftysmashers.com/ios"
            steam="https://niftysmashers.com/steam"
          />
        }
      />
    </GridItem>
    <GridItem size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }}>
      <GameCard
        title="Party Royale (Early-Alpha)"
        required="Party Battle Royale"
        description="Step into the NiftyVerse - our next hit game is ready to playtest! This game is still in early development so bugs are expected!"
        image="/img/games/nifty-royale/nifty-royale.gif"
        onlineCounter={200}
        autoHeight={false}
        actions={<StoreButtons ios="https://testflight.apple.com/join/VXxbaZrw" />}
      />
    </GridItem>
  </>
);

export default F2PGameList;
