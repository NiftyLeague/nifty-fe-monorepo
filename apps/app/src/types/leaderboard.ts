interface Stats {
  win_rate: string;
  hits: string;
  kills: string;
  wins: string;
  earnings: string;
  suicides: string;
  round_wins: string;
  xp: string;
  time_played: string;
  matches: string;
  deaths: string;
  rounds: string;
  rank: string;
  'avg_NFTL/match': string;
}

export interface ReturnDataType {
  data: DataType[];
  count: number;
}
export interface DataType {
  [key: string]: unknown;
  rank: number;
  user_id: string;
  score: string;
  stats: Stats;
  name: string;
}

export interface TableRowType {
  key: string;
  display: string;
  primary?: boolean;
}
export interface TableType {
  key: string;
  display: string;
  rows: TableRowType[];
}

export enum Game {
  NiftySmashers = 'NIFTY SMASHERS 2D',
  WenGame = 'WEN GAME',
  MtGawx = 'MT. GAWX',
  CryptoWinter = 'CRYPTO WINTER',
}

export enum TimeFilter {
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  AllTime = 'All Time',
}

export type LeaderboardGame = {
  key: string;
  display: Game;
  tables: TableType[];
};

export type Order = 'asc' | 'desc';

export interface EnhancedTableProps {
  rows: TableRowType[];
  handleCheckYourRank: React.MouseEventHandler<HTMLSpanElement>;
}

export interface TableProps {
  selectedGame: string;
  selectedTable: TableType;
  selectedTimeFilter: string;
}
