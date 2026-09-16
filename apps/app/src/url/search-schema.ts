import { createLoader, type inferParserType } from '@/url/parsers'

import { degenSearchParsers, leaderboardSearchParsers, type DegenSearchState } from './search-state'

/**
 * Route search handling.
 *
 * URL state belongs to the typed parsers in this app: the components read and
 * write it with `useQueryStates`, and the parsers supply defaults as values
 * are read. Route `validateSearch` therefore only has to accept the incoming
 * params — it must not inject defaults, because anything it returns is
 * written back to the URL and `/degens` would start redirecting to a URL
 * carrying every default key.
 *
 * Loaders that need typed values parse them explicitly with the helper below.
 */
type SearchInput = Record<string, string | string[] | undefined>

const loadDegenSearch = createLoader(degenSearchParsers)
const loadLeaderboardSearch = createLoader(leaderboardSearchParsers)

/** Search params exactly as they appear in the URL, with no defaults applied. */
export type RawSearch = Record<string, unknown>

export const acceptSearch = (search: RawSearch): RawSearch => search

export const parseDegenSearch = (search: RawSearch): DegenSearchState =>
  loadDegenSearch(search as SearchInput)

export const parseLeaderboardSearch = (
  search: RawSearch
): inferParserType<typeof leaderboardSearchParsers> => loadLeaderboardSearch(search as SearchInput)
