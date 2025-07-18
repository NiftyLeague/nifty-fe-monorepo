import { GTM_EVENTS } from '@nl/ui/gtm';
import type { TableType, LeaderboardGame } from '@/types/leaderboard';
import { Game, TimeFilter } from '@/types/leaderboard';

import { SMASHERS_LEADERBOARDS } from './leaderboard-smashers';
import { WEN_GAME_LEADERBOARDS } from './leaderboard-wen-game';
import { CRYPTO_WINTER_LEADERBOARDS } from './leaderboard-crypto-winter';
import { MT_GAWX_LEADERBOARDS } from './leaderboard-mt-gawx';

export const NiftySmashersTables: TableType[] = [
  {
    key: 'win_rate',
    display: 'WIN RATE',
    rows: [
      { key: 'win_rate', display: 'WIN RATE', primary: true },
      { key: 'matches', display: 'MATCHES PLAYED' },
    ],
  },
  {
    key: 'earnings',
    display: 'TOP EARNERS',
    rows: [
      { key: 'earnings', display: 'TOTAL NFTL EARNED', primary: true },
      { key: 'matches', display: 'MATCHES PLAYED' },
      { key: 'avg_NFTL/match', display: 'AVG, NFTL/MATCH' },
      { key: 'kills', display: 'KILLS' },
    ],
  },
  {
    key: 'kills',
    display: 'TOP KILLS',
    rows: [
      { key: 'matches', display: 'MATCHES PLAYED' },
      { key: 'kills', display: 'KILLS', primary: true },
    ],
  },
];

const WenGameTables: TableType[] = [
  { key: 'score', display: 'HIGH SCORE', rows: [{ key: 'score', display: 'HIGH SCORE', primary: true }] },
];

const MtGawxTables: TableType[] = [
  { key: 'burnings', display: 'NFTL BURNED', rows: [{ key: 'score', display: 'NFTL BURNED', primary: true }] },
];

const CryptoWinterTables: TableType[] = [
  { key: 'score', display: 'HIGH SCORE', rows: [{ key: 'score', display: 'HIGH SCORE', primary: true }] },
];

export const LEADERBOARD_GAME_LIST: LeaderboardGame[] = [
  { key: 'nifty_smashers', display: Game.NiftySmashers, tables: NiftySmashersTables },
  { key: 'wen_game', display: Game.WenGame, tables: WenGameTables },
  { key: 'nftl_burner', display: Game.MtGawx, tables: MtGawxTables },
  { key: 'crypto_winter', display: Game.CryptoWinter, tables: CryptoWinterTables },
];

export const LEADERBOARD_TIME_FILTERS = [
  { key: 'weekly', display: TimeFilter.Weekly },
  { key: 'monthly', display: TimeFilter.Monthly },
  { key: 'all_time', display: TimeFilter.AllTime },
];

export const getGameLeaderboardViewedAnalyticsEventName = (selectedGame: string) => {
  let eventName = '';
  switch (selectedGame) {
    case 'nifty_smashers':
      eventName = GTM_EVENTS.NIFTY_SMASHERS_LEADERBOARD_VIEWED;
      break;
    case 'wen_game':
      eventName = GTM_EVENTS.WEN_GAME_LEADERBOARD_VIEWED;
      break;
    case 'nftl_burner':
      eventName = GTM_EVENTS.MT_GAWX_LEADERBOARD_VIEWED;
      break;
    case 'crypto_winter':
      eventName = GTM_EVENTS.CRYPTO_WINTER_LEADERBOARD_VIEWED;
      break;
    default:
      break;
  }
  return eventName;
};

export const getLeaderboardRankAnalyticsEventName = (selectedGame: string) => {
  let eventName = '';
  switch (selectedGame) {
    case 'nifty_smashers':
      eventName = GTM_EVENTS.LEADERBOARD_CHECK_YOUR_RANK_CLICKED_SMASHERS;
      break;
    case 'wen_game':
      eventName = GTM_EVENTS.LEADERBOARD_CHECK_YOUR_RANK_CLICKED_WEN;
      break;
    case 'nftl_burner':
      eventName = GTM_EVENTS.LEADERBOARD_CHECK_YOUR_RANK_CLICKED_MT_GAWX;
      break;
    case 'crypto_winter':
      eventName = GTM_EVENTS.LEADERBOARD_CHECK_YOUR_RANK_CLICKED_CRYPTO_WINTER;
      break;
    default:
      break;
  }
  return eventName;
};

// Leaderboard Data

export const LEADERBOARDS = {
  crypto_winter: CRYPTO_WINTER_LEADERBOARDS,
  nftl_burner: MT_GAWX_LEADERBOARDS,
  nifty_smashers: SMASHERS_LEADERBOARDS,
  wen_game: WEN_GAME_LEADERBOARDS,
};
