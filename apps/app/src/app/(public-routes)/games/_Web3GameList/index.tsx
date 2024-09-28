'use client';

import { useCallback, useState } from 'react';
import { styled } from '@nl/theme';
import { useRouter } from 'next/navigation';
import { Grid2, Button } from '@mui/material';
import BuyArcadeTokensDialog from '@/components/dialog/BuyArcadeTokensDialog';
import ConnectWrapper from '@/components/wrapper/ConnectWrapper';
import GameCard from '@/components/cards/GameCard';
import DownloadGameDialog from '@/components/dialog/DownloadGameDialog';
import useTokensBalances from '@/hooks/balances/useTokensBalances';

const GridItem = styled(Grid2)(({ theme }) => ({
  paddingRight: 16,
  paddingBottom: 32,
  border: 'none',
  [theme.breakpoints.down('sm')]: {
    paddingBottom: 0,
  },
}));

const MobileGameList = () => {
  const router = useRouter();
  const { arcadeBalance, refetchArcadeBal } = useTokensBalances();
  const [openBuyAT, setOpenBuyAT] = useState(false);

  const goToPlayOnGame = useCallback(() => {
    router.push('/games/smashers');
  }, [router]);

  const goToPlayWENGame = useCallback(() => {
    if (Number(arcadeBalance) > 0) {
      router.push('/games/wen-game');
    } else {
      setOpenBuyAT(true);
    }
  }, [arcadeBalance, router]);

  const goToPlayMtGawx = useCallback(() => {
    router.push('/games/mt-gawx');
  }, [router]);

  const goToPlayCryptoWinter = useCallback(() => {
    if (Number(arcadeBalance) > 0) {
      router.push('/games/crypto-winter');
    } else {
      setOpenBuyAT(true);
    }
  }, [arcadeBalance, router]);

  return (
    <>
      <GridItem size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }}>
        <GameCard
          title="2D Smashers"
          externalLink={{
            title: 'Smashers Mobile',
            src: 'https://niftysmashers.com/',
          }}
          required="DEPRECATED - Please download our mobile app!"
          description="The first NFT brawler on the Ethereum blockchain. Now available free-to-play on all mobile platforms!"
          image="/img/games/smashers/nifty-smashers.gif"
          onlineCounter={200}
          autoHeight={false}
          actions={
            <>
              <DownloadGameDialog />
              <ConnectWrapper color="primary" fullWidth buttonText="Connect Wallet to play">
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{ minWidth: 80, flex: 1 }}
                  onClick={goToPlayOnGame}
                >
                  Play in Browser
                </Button>
              </ConnectWrapper>
            </>
          }
        />
      </GridItem>
      <GridItem size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }}>
        <GameCard
          title="WEN Game"
          required="Arcade Tokens Required"
          description="Nifty League's first arcade mini-game! This single-player baseball game is sure to test your reflexes."
          image="/img/games/wen.gif"
          autoHeight={false}
          actions={
            <ConnectWrapper color="primary" fullWidth buttonText="Connect Wallet to play">
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ minWidth: 80, flex: 1 }}
                onClick={goToPlayWENGame}
              >
                {Number(arcadeBalance) > 0 ? 'Play in Browser' : 'Buy Arcade Tokens'}
              </Button>
            </ConnectWrapper>
          }
        />
      </GridItem>
      <GridItem size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }}>
        <GameCard
          title="Crypto Winter"
          required="Arcade Tokens Required"
          description="Winter is here... Play this single-player dodgeball-inspired arcade game and rank as high as you can!"
          image="/img/games/crypto-winter.webp"
          autoHeight={false}
          actions={
            <ConnectWrapper color="primary" fullWidth buttonText="Connect Wallet to play">
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ minWidth: 80, flex: 1 }}
                onClick={goToPlayCryptoWinter}
              >
                {Number(arcadeBalance) > 0 ? 'Play in Browser' : 'Buy Arcade Tokens'}
              </Button>
            </ConnectWrapper>
          }
        />
      </GridItem>
      <GridItem size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }}>
        <GameCard
          title="Mt. Gawx"
          required="NFTL required"
          description={`Hearing the DEGENs' desperate pleas to spend their hard-earned NFTL and with bigger sinks still under his development, Satoshi suggests the DEGENs climb to the top of the Mt. Gawx volcano to offer their NFTL sacrifices to the fiery depths to see who might burn the most, and to discover whether the rumors of Rugman offering interesting rewards to burners are true.\n\nStrange thing is, every time they lob in NFTL, it's almost as if the volcano's… responding.\n\nCould the fabled 7th tribe be waking up from their centuries-long slumber, deep in the caves where Rugman resides?`}
          showMore={true}
          image="/img/games/mt-gawx.gif"
          autoHeight={true}
          actions={
            <ConnectWrapper color="primary" fullWidth buttonText="Connect Wallet to play">
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ minWidth: 80, flex: 1 }}
                onClick={goToPlayMtGawx}
              >
                Burn Now
              </Button>
            </ConnectWrapper>
          }
        />
      </GridItem>
      <GridItem size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }}>
        <GameCard
          title="Nifty Tennis"
          required="Unreleased"
          description={
            'An early concept of the first Web3 Tennis game. We developed the early prototype to test the waters and see if we could create a fun and engaging game. The game is currently on hold and may be revisited in the future.'
          }
          showMore={true}
          image="/img/games/nifty-tennis.webp"
          autoHeight={true}
          actions={
            <>
              <Button
                disabled
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ minWidth: 80, flex: 1 }}
                onClick={goToPlayMtGawx}
              >
                Not Available
              </Button>
            </>
          }
        />
      </GridItem>
      <BuyArcadeTokensDialog
        open={openBuyAT}
        onSuccess={() => {
          setOpenBuyAT(false);
          refetchArcadeBal();
        }}
        onClose={() => setOpenBuyAT(false)}
      />
    </>
  );
};

export default MobileGameList;
