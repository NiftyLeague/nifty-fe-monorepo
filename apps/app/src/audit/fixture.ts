import type { Character } from '@/types/graph'
import type {
  Account,
  Profile,
  ProfileMiniGame,
  ProfileNiftySmsher,
  ProfileTotal,
} from '@/types/account'
import type { Degen } from '@/types/degens'
import {
  DEGEN_BASE_API_URL,
  GET_GAMER_PROFILE_API,
  MY_PROFILE_API_URL,
  PROFILE_FAV_DEGENS_API,
} from '@/constants/api'

export const isAuditFixtureEnabled = process.env.NEXT_PUBLIC_AUDIT_FIXTURE === 'true'

export const AUDIT_FIXTURE_ADDRESS = '0x0000000000000000000000000000000000000a01' as const
export const AUDIT_FIXTURE_TOKEN = 'audit-fixture-token'

export const AUDIT_FIXTURE_ACCOUNT: Account = {
  address: AUDIT_FIXTURE_ADDRESS,
  balance: 1250,
  created_at: 0,
  id: 'audit-account',
  is_banned: false,
  name: 'Audit Player',
  session_key: '',
  session_updated_at: 0,
}

const auditDegenList: Degen[] = [
  {
    id: '101',
    stats: {},
    rental_count: 1,
    is_active: true,
    last_rented_at: 0,
    total_rented: 12,
    price: 125,
    price_daily: 18,
    tribe: 'Ape',
    background: 'Common',
    traits_string: 'blue,cap',
    multiplier: 1,
    multipliers: { background: 1 },
    name: 'Audit Ape',
    owner: AUDIT_FIXTURE_ADDRESS,
    earning_cap: 1000,
    earning_cap_daily: 100,
  },
  {
    id: '202',
    stats: {},
    rental_count: 0,
    is_active: true,
    last_rented_at: 0,
    total_rented: 7,
    price: 250,
    price_daily: 35,
    tribe: 'Alien',
    background: 'Rare',
    traits_string: 'green,helmet',
    multiplier: 2,
    multipliers: { background: 2 },
    name: 'Audit Alien',
    owner: AUDIT_FIXTURE_ADDRESS,
    earning_cap: 1200,
    earning_cap_daily: 120,
  },
  {
    id: '303',
    stats: {},
    rental_count: 2,
    is_active: true,
    last_rented_at: 0,
    total_rented: 19,
    price: 500,
    price_daily: 70,
    tribe: 'Cat',
    background: 'Meta',
    traits_string: 'purple,visor',
    multiplier: 3,
    multipliers: { background: 3 },
    name: 'Audit Cat',
    owner: AUDIT_FIXTURE_ADDRESS,
    earning_cap: 1500,
    earning_cap_daily: 150,
  },
  {
    id: '9999',
    stats: {},
    rental_count: 0,
    is_active: true,
    last_rented_at: 0,
    total_rented: 3,
    price: 900,
    price_daily: 125,
    tribe: 'Rugman',
    background: 'Legendary',
    traits_string: 'gold,crown',
    multiplier: 4,
    multipliers: { background: 4 },
    name: 'Audit Rugman',
    owner: AUDIT_FIXTURE_ADDRESS,
    earning_cap: 2000,
    earning_cap_daily: 200,
  },
]

export const AUDIT_FIXTURE_DEGENS = Object.fromEntries(
  auditDegenList.map((degen) => [degen.id, degen])
) as Record<string, Degen>

export const AUDIT_FIXTURE_CHARACTERS: Character[] = auditDegenList.slice(0, 3).map((degen) => ({
  id: degen.id,
  tokenId: BigInt(degen.id),
  createdAt: 0n,
  name: degen.name,
  nameHistory: [],
  owner: { address: AUDIT_FIXTURE_ADDRESS },
  traits: {},
}))

const auditTotals: ProfileTotal = {
  wins: 24,
  xp: 4800,
  rental_earnings: 320,
  rental_royalty_earnings: 120,
  rental_earnings_as_owner: 200,
  rental_earnings_as_renter: 120,
  rental_game_earnings: 40,
  earnings: 360,
  matches: 60,
  time_played: 7200,
  rank: 12,
  rank_xp_previous: 4000,
  rank_xp_next: 5500,
}

const auditSmashers: ProfileNiftySmsher = {
  ...auditTotals,
  hits: 90,
  kills: 42,
  suicides: 2,
  round_wins: 28,
  deaths: 30,
  rounds: 60,
}

const auditMiniGame: ProfileMiniGame = {
  dodges: 8,
  hits: 18,
  machine_hits: 4,
  matches: 20,
  misses: 3,
  rank: 8,
  rank_xp_next: 1200,
  rank_xp_previous: 900,
  score: 860,
  time_played: 1800,
  xp: 1050,
}

export const AUDIT_FIXTURE_PROFILE: Profile = {
  id: 'audit-profile',
  updated_at: 0,
  name: 'Audit Player',
  name_cased: 'Audit Player',
  stats: {
    total: auditTotals,
    nifty_smashers: auditSmashers,
    wen_game: auditMiniGame,
    crypto_winter: auditMiniGame,
  },
}

export function getAuditFixtureData(url: string): unknown {
  if (!isAuditFixtureEnabled) return undefined
  if (url === `${DEGEN_BASE_API_URL}/cache/rentals/rentables.json`) return AUDIT_FIXTURE_DEGENS
  if (url === PROFILE_FAV_DEGENS_API) return { favorites: '' }
  if (url === GET_GAMER_PROFILE_API || url === MY_PROFILE_API_URL) return AUDIT_FIXTURE_PROFILE

  // Fixture mode is an explicit visual-audit sandbox: never fall through to a real request.
  return null
}
