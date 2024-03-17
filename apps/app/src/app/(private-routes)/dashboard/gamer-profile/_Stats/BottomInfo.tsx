import Link from 'next/link';
import { Stack, Typography, Grid, Skeleton, Button } from '@mui/material';
import { useTheme } from '@nl/theme';
import ProgressGamer from './ProgressGamer';
import GameCard from '@/components/cards/GameCard';
import LeftInfo from './LeftInfo';
import MiniGameContent from './MiniGameContent';
import { useGamerProfileContext } from '@/hooks/useGamerProfile';

import type { ProfileNiftySmsher, ProfileMiniGame } from '@/types/account';

interface BottomInfoProps {
  nifty_smashers: ProfileNiftySmsher | undefined;
  wen_game: ProfileMiniGame | undefined;
  crypto_winter: ProfileMiniGame | undefined;
}

const BottomInfo = ({ nifty_smashers, wen_game, crypto_winter }: BottomInfoProps): JSX.Element => {
  const { isLoadingProfile } = useGamerProfileContext();

  const theme = useTheme();

  return (
    <Grid container flexDirection="row" flexWrap="wrap" spacing={2}>
      <Grid item sm={12} md={6} lg={4} xl={3}>
        <GameCard
          image="/images/games/nifty-smashers.gif"
          contents={
            <Stack padding="16px" gap={2}>
              {nifty_smashers && <ProgressGamer size="sm" data={nifty_smashers} />}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" component="div">
                  Nifty Smashers
                </Typography>
                <Typography variant="h4" component="div">
                  {isLoadingProfile ? (
                    <Skeleton variant="rectangular" sx={{ display: 'inline-block' }} width="15%" height="19.76px" />
                  ) : (
                    `${Math.round(nifty_smashers?.xp || 0)}/${nifty_smashers?.rank_xp_next}`
                  )}
                  <Typography variant="h4" component="div" color={theme.palette.grey[400]} display="inline" ml="4px">
                    XP
                  </Typography>
                </Typography>
              </Stack>
              <LeftInfo data={nifty_smashers} />
              <Button color="secondary" component={Link} href="/leaderboards?game=nifty_smashers">
                View Leaderboards
              </Button>
            </Stack>
          }
        />
      </Grid>
      <Grid item sm={12} md={6} lg={4} xl={3}>
        <GameCard
          image="/images/games/wen.gif"
          contents={
            <Stack padding="16px" gap={2} flex={1} justifyContent="space-between">
              {wen_game && <ProgressGamer size="sm" data={wen_game} />}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" component="div">
                  WEN?
                </Typography>
                <Typography variant="h4" component="div">
                  {isLoadingProfile ? (
                    <Skeleton variant="rectangular" sx={{ display: 'inline-block' }} width="15%" height="19.76px" />
                  ) : (
                    `${Math.round(wen_game?.xp || 0)}/${wen_game?.rank_xp_next}`
                  )}
                  <Typography variant="h4" component="div" color={theme.palette.grey[400]} display="inline" ml="4px">
                    XP
                  </Typography>
                </Typography>
              </Stack>
              <MiniGameContent data={wen_game} />
              <Button color="secondary" component={Link} href="/leaderboards?game=wen_game">
                View Leaderboards
              </Button>
            </Stack>
          }
        />
      </Grid>
      {crypto_winter && (
        <Grid item sm={12} md={6} lg={4} xl={3}>
          <GameCard
            image="/images/games/crypto-winter.png"
            contents={
              <Stack padding="16px" gap={2} flex={1} justifyContent="space-between">
                <ProgressGamer size="sm" data={crypto_winter} />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h3" component="div">
                    CRYPTO WINTER
                  </Typography>
                  <Typography variant="h4" component="div">
                    {isLoadingProfile ? (
                      <Skeleton variant="rectangular" sx={{ display: 'inline-block' }} width="15%" height="19.76px" />
                    ) : (
                      `${Math.round(crypto_winter?.xp || 0)}/${crypto_winter?.rank_xp_next}`
                    )}
                    <Typography variant="h4" component="div" color={theme.palette.grey[400]} display="inline" ml="4px">
                      XP
                    </Typography>
                  </Typography>
                </Stack>
                <MiniGameContent data={crypto_winter} />
                <Button color="secondary" component={Link} href="/leaderboards?game=crypto_winter">
                  View Leaderboards
                </Button>
              </Stack>
            }
          />
        </Grid>
      )}
    </Grid>
  );
};

export default BottomInfo;
