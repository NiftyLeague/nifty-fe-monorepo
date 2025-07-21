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

// Leaderboard Data

export const LEADERBOARDS = {
  crypto_winter: CRYPTO_WINTER_LEADERBOARDS,
  nftl_burner: MT_GAWX_LEADERBOARDS,
  nifty_smashers: SMASHERS_LEADERBOARDS,
  wen_game: WEN_GAME_LEADERBOARDS,
};
