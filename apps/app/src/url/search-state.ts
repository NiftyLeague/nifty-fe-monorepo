import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  type inferParserType,
} from 'nuqs/server'

const sortValues = ['idUp', 'idDown'] as const
const leaderboardGames = ['nifty_smashers', 'wen_game', 'nftl_burner', 'crypto_winter'] as const
const leaderboardTimes = ['weekly', 'monthly', 'all_time'] as const
const rentalCategories = [
  'all',
  'direct-rental',
  'direct-renter',
  'recruited',
  'owned-sponsorship',
  'non-owned-sponsorship',
  'terminated',
  'full-history',
] as const

export const degenSearchParsers = {
  page: parseAsInteger.withDefault(1),
  sort: parseAsStringLiteral(sortValues).withDefault('idUp'),
  searchTerm: parseAsString.withDefault(''),
  prices: parseAsArrayOf(parseAsInteger, '-').withDefault([]),
  multipliers: parseAsArrayOf(parseAsString, '-').withDefault([]),
  rentals: parseAsArrayOf(parseAsString, '-').withDefault([]),
  tribes: parseAsArrayOf(parseAsString, '-').withDefault([]),
  backgrounds: parseAsArrayOf(parseAsString, '-').withDefault([]),
  cosmetics: parseAsArrayOf(parseAsString, '-').withDefault([]),
  wearables: parseAsArrayOf(parseAsString, '-').withDefault([]),
  tokenId: parseAsString.withDefault(''),
  walletAddress: parseAsString.withDefault(''),
}

export const leaderboardSearchParsers = {
  game: parseAsStringLiteral(leaderboardGames).withDefault('nifty_smashers'),
  table: parseAsString.withDefault('win_rate'),
  time: parseAsStringLiteral(leaderboardTimes).withDefault('all_time'),
}

export const rentalSearchParsers = {
  category: parseAsStringLiteral(rentalCategories).withDefault('all'),
  search: parseAsString.withDefault(''),
}

export type DegenSearchState = inferParserType<typeof degenSearchParsers>
export type LeaderboardGameKey = (typeof leaderboardGames)[number]

const uniqueNonEmpty = (values: string[]) => [...new Set(values.filter(Boolean))]

export const normalizeDegenSearchState = (state: Partial<DegenSearchState>): DegenSearchState => ({
  ...state,
  page: Number.isInteger(state.page) && (state.page ?? 0) > 0 ? (state.page as number) : 1,
  sort: state.sort && sortValues.includes(state.sort) ? state.sort : 'idUp',
  searchTerm: state.searchTerm?.trim() ?? '',
  prices: (state.prices ?? []).filter((value) => Number.isFinite(value) && value >= 0),
  multipliers: uniqueNonEmpty(state.multipliers ?? []),
  rentals: uniqueNonEmpty(state.rentals ?? []),
  tribes: uniqueNonEmpty(state.tribes ?? []),
  backgrounds: uniqueNonEmpty(state.backgrounds ?? []),
  cosmetics: uniqueNonEmpty(state.cosmetics ?? []),
  wearables: uniqueNonEmpty(state.wearables ?? []),
  tokenId: state.tokenId?.trim() ?? '',
  walletAddress: state.walletAddress?.trim() ?? '',
})

export const normalizeLeaderboardGame = (value: string | null): LeaderboardGameKey =>
  leaderboardGames.includes(value as LeaderboardGameKey)
    ? (value as LeaderboardGameKey)
    : 'nifty_smashers'

export const buildPublicDegensRequestQuery = (
  rawState: Partial<DegenSearchState>,
  pageSize: number
): string => {
  const state = normalizeDegenSearchState(rawState)
  const params = new URLSearchParams({
    page: String(state.page),
    pageSize: String(pageSize),
    sort: state.sort,
  })
  if (state.searchTerm) params.set('searchTerm', state.searchTerm)
  if (state.prices.length) params.set('prices', state.prices.join('-'))
  if (state.tribes.length) params.set('tribes', state.tribes.join('-'))
  if (state.backgrounds.length) params.set('backgrounds', state.backgrounds.join('-'))
  if (state.cosmetics.length) params.set('cosmetics', state.cosmetics.join('-'))
  if (state.tokenId) params.set('tokenId', state.tokenId)
  if (state.walletAddress) params.set('walletAddress', state.walletAddress)
  return params.toString()
}
