export interface Account {
  address: string;
  balance?: number;
  created_at: number;
  id: string;
  update_counter?: number;
  updated_at?: number;
  is_banned: boolean;
  session_key: string;
  session_updated_at: number;
  name: string;
  name_cased?: string;
}

export interface Profile {
  id: string;
  updated_at: number;
  avatar?: ProfileAvatar;
  stats: {
    nifty_smashers: ProfileNiftySmsher;
    total: ProfileTotal;
    wen_game: ProfileMiniGame;
    crypto_winter: ProfileMiniGame;
  };
  name: string;
  name_cased: string;
}

export interface ProfileAvatar {
  id: string;
  url: string;
}

export interface ProfileTotal {
  wins: number;
  xp: number;
  rental_earnings: number;
  rental_royalty_earnings: number;
  rental_earnings_as_owner: number;
  rental_earnings_as_renter: number;
  rental_game_earnings: number;
  earnings: number;
  matches: number;
  time_played: number;
  rank: number;
  rank_xp_previous: number;
  rank_xp_next: number;
}

export interface ProfileNiftySmsher extends ProfileTotal {
  hits: number;
  kills: number;
  suicides: number;
  round_wins: number;
  deaths: number;
  rounds: number;
}
export interface ProfileMiniGame {
  dodges: number;
  hits: number;
  machine_hits: number;
  matches: number;
  misses: number;
  rank: number;
  rank_xp_next: number;
  rank_xp_previous: number;
  score: number;
  time_played: number;
  xp: number;
}

export interface WithdrawalHistory {
  address: string;
  amount: number;
  balance_before: number;
  balance_tx_id: string;
  created_at: number;
  expire_at: number;
  nonce: number;
  request_id: string;
  signature: string;
  state: 'pending' | 'void' | 'complete';
  user_id: string;
}
