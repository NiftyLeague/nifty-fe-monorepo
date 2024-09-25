'use client';

import Link from 'next/link';
import { styled } from '@nl/theme';
import { Grid2, Button } from '@mui/material';
import GameCard from '@/components/cards/GameCard';

const GridItem = styled(Grid2)(({ theme }) => ({
  paddingRight: 16,
  paddingBottom: 32,
  border: 'none',
  [theme.breakpoints.down('sm')]: {
    paddingBottom: 0,
  },
}));

const GameList = () => (
  <>
    <GridItem size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }}>
      <GameCard
        title="Nifty Smashers (Beta)"
        required="Platform Fighter"
        description="Our flagship game available on all mobile platforms! Epic & Steam listings coming soon!"
        image="/img/games/smashers/smashers.gif"
        onlineCounter={200}
        autoHeight={false}
        actions={
          <>
            <Link href="https://niftysmashers.com/ios" target="_blank" rel="noreferrer">
              <Button variant="outlined" color="primary" fullWidth sx={{ minWidth: 80, flex: 1 }}>
                Apple App Store
              </Button>
            </Link>
            <Link href="https://niftysmashers.com/android" target="_blank" rel="noreferrer">
              <Button variant="outlined" color="primary" fullWidth sx={{ minWidth: 80, flex: 1 }}>
                Google Play Store
              </Button>
            </Link>
          </>
        }
      />
    </GridItem>
    <GridItem size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }}>
      <GameCard
        title="Party Royale (Early-Alpha)"
        required="Battle Royale"
        description="Our next hit game is ready to playtest! This game is still in early development. Bugs are expected!"
        image="/img/games/nifty-royale/nifty-royale.gif"
        onlineCounter={200}
        autoHeight={false}
        actions={
          <>
            <Link href="https://testflight.apple.com/join/VXxbaZrw" target="_blank" rel="noreferrer">
              <Button variant="outlined" color="primary" fullWidth sx={{ minWidth: 80, flex: 1 }}>
                Apple TestFlight
              </Button>
            </Link>
            <Button disabled variant="outlined" color="primary" fullWidth sx={{ minWidth: 80, flex: 1 }}>
              Google Play Store
            </Button>
          </>
        }
      />
    </GridItem>
  </>
);

export default GameList;
