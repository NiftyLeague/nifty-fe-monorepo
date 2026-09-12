import { createLoader } from 'nuqs/server'

import {
  degenSearchParsers,
  leaderboardSearchParsers,
  mintSearchParsers,
  rentalSearchParsers,
  type DegenSearchState,
} from './search-state'

/**
 * Route search handling.
 *
 * URL state belongs to nuqs in this app: the components read and write it with
 * `useQueryStates`, and the parsers supply defaults as values are read. Route
 * `validateSearch` therefore only has to accept the incoming params — it must
 * not inject defaults, because anything it returns is written back to the URL
 * and `/degens` would start redirecting to a URL carrying every default key.
 *
 * Loaders that need typed values parse them explicitly with the helpers below.
 */
type SearchInput = Record<string, string | string[] | undefined>

const loadDegenSearch = createLoader(degenSearchParsers)
const loadLeaderboardSearch = createLoader(leaderboardSearchParsers)
const loadRentalSearch = createLoader(rentalSearchParsers)
const loadMintSearch = createLoader(mintSearchParsers)

export type DegenSearch = DegenSearchState
export type LeaderboardSearch = ReturnType<typeof parseLeaderboardSearch>
export type RentalSearch = ReturnType<typeof parseRentalSearch>
export type MintSearch = ReturnType<typeof parseMintSearch>

/** Search params exactly as they appear in the URL, with no defaults applied. */
export type RawSearch = Record<string, unknown>

export const acceptSearch = (search: RawSearch): RawSearch => search

export const parseDegenSearch = (search: RawSearch): DegenSearchState =>
  loadDegenSearch(search as SearchInput)

export const parseLeaderboardSearch = (search: RawSearch) =>
  loadLeaderboardSearch(search as SearchInput)

export const parseRentalSearch = (search: RawSearch) => loadRentalSearch(search as SearchInput)

export const parseMintSearch = (search: RawSearch) => loadMintSearch(search as SearchInput)
