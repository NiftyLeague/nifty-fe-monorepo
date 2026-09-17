import { queryOptions } from '@tanstack/solid-query'
import { isServer } from 'solid-js/web'

import { isLoggedIn } from '@/state/auth-store'
import { authTokenStore } from '@/state/auth-storage'

import type { Profile } from '@/types/account'
import type { Rentals, RentalType } from '@/types/rentals'
import {
  ALL_RENTAL_API_URL,
  ALL_RENTAL_API_URL_INACTIVE,
  MY_RENTAL_API_URL,
  MY_RENTAL_API_URL_INACTIVE,
  RENTED_FROM_ME_API_URL,
  GET_ARCADE_TOKEN_BALANCE_API,
} from '@/constants/url'
import { GET_GAMER_PROFILE_API, MY_PROFILE_API_URL } from '@/constants/api'
import { getUniqueListBy } from '@/utils/array'
import {
  AUTHENTICATED_STALE_TIME_MS,
  fetchApiQuery,
  getAuthQueryScope,
  queryKeys,
} from '@/query/app-query'

/**
 * Shared query definitions for the token-scoped REST endpoints. Route loaders
 * prefetch these on navigation intent (and during SPA route matches) so the
 * dashboard leaves render from cache instead of fetching after their chunk
 * waterfall resolves; the consuming hooks use the exact same definitions, so
 * keys and payloads can never diverge between prefetch and render.
 */

const authedHeaders = (authToken: string | undefined) => ({
  headers: { authorizationToken: authToken || '' },
})

export const playerProfileQueryOptions = (authToken?: string) =>
  queryOptions({
    queryKey: queryKeys.profile.player(getAuthQueryScope(authToken)),
    queryFn: ({ signal }) =>
      fetchApiQuery<Profile>(MY_PROFILE_API_URL, { signal, init: authedHeaders(authToken) }),
    enabled: !!authToken,
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  })

export const gamerProfileQueryOptions = (authToken?: string) =>
  queryOptions({
    queryKey: queryKeys.profile.current(getAuthQueryScope(authToken)),
    queryFn: ({ signal }) =>
      fetchApiQuery<Profile>(GET_GAMER_PROFILE_API, { signal, init: authedHeaders(authToken) }),
    enabled: !!authToken,
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  })

export const arcadeBalanceQueryOptions = (authToken?: string) =>
  queryOptions({
    queryKey: queryKeys.account.arcadeBalance(getAuthQueryScope(authToken)),
    queryFn: ({ signal }) =>
      fetchApiQuery<{ balance: number }>(GET_ARCADE_TOKEN_BALANCE_API, {
        signal,
        init: authedHeaders(authToken),
      }),
    enabled: !!authToken,
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  })

const rentalFetchUrls = (category: RentalType | 'full-history'): string[] => {
  switch (category) {
    case 'all':
      return [
        ALL_RENTAL_API_URL,
        ALL_RENTAL_API_URL_INACTIVE,
        RENTED_FROM_ME_API_URL,
        MY_RENTAL_API_URL,
        MY_RENTAL_API_URL_INACTIVE,
      ]
    case 'terminated':
    case 'owned-sponsorship':
    case 'non-owned-sponsorship':
      return [ALL_RENTAL_API_URL, ALL_RENTAL_API_URL_INACTIVE]
    case 'direct-rental':
    case 'recruited':
      return [MY_RENTAL_API_URL, MY_RENTAL_API_URL_INACTIVE]
    case 'direct-renter':
      return [RENTED_FROM_ME_API_URL]
    default:
      return [ALL_RENTAL_API_URL, ALL_RENTAL_API_URL_INACTIVE]
  }
}

export const rentalsQueryOptions = (authToken: string | undefined, category: RentalType) =>
  queryOptions({
    queryKey: queryKeys.rentals(getAuthQueryScope(authToken), category),
    queryFn: async ({ signal }): Promise<Rentals[]> => {
      const rentalArrays = await Promise.all(
        rentalFetchUrls(category).map((url) =>
          fetchApiQuery<Rentals[]>(url, { signal, init: authedHeaders(authToken) })
        )
      )
      const totalRentals = rentalArrays.reduce((flattened, arr) => [...flattened, ...arr])
      return getUniqueListBy(totalRentals as Rentals[], 'id')
    },
    enabled: !!authToken,
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  })

/**
 * The session token only when a logged-in client is asking: route loaders
 * call this before prefetching so the server render and signed-out visitors
 * stay fetch-free.
 */
export const authedToken = (): string | undefined => {
  if (isServer) return undefined
  const token = authTokenStore.value()
  return token && isLoggedIn() ? token : undefined
}
