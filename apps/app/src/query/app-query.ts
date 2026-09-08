import { QueryClient } from '@tanstack/react-query'

import { getAuditFixtureData, isAuditFixtureEnabled } from '@/audit/fixture'

export const PUBLIC_STALE_TIME_MS = 5 * 60 * 1000
export const AUTHENTICATED_STALE_TIME_MS = 30 * 1000

export class ApiQueryError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = 'ApiQueryError'
  }
}

const shouldRetryQuery = (failureCount: number, error: Error) => {
  if (error instanceof ApiQueryError && error.status >= 400 && error.status < 500) return false
  return failureCount < 1
}

export const createAppQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: PUBLIC_STALE_TIME_MS,
        gcTime: 30 * 60 * 1000,
        retry: shouldRetryQuery,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: { retry: false },
    },
  })

export const queryKeys = {
  publicDegens: {
    all: ['public-degens'] as const,
    list: (search: string) => ['public-degens', 'list', search] as const,
    byIds: (ids: string[]) => ['public-degens', 'by-ids', ...ids] as const,
  },
  profile: {
    all: ['profile'] as const,
    current: (scope: string) => ['profile', 'current', scope] as const,
    player: (scope: string) => ['profile', 'player', scope] as const,
    avatars: (scope: string) => ['profile', 'avatars', scope] as const,
    renameFee: (scope: string) => ['profile', 'rename-fee', scope] as const,
    favorites: (scope: string) => ['profile', 'favorites', scope] as const,
  },
  account: {
    all: ['account'] as const,
    game: (scope: string) => ['account', 'game', scope] as const,
    arcadeBalance: (scope: string) => ['account', 'arcade-balance', scope] as const,
  },
  leaderboards: {
    all: ['leaderboards'] as const,
    page: (game: string, score: string, time: string, count: number, offset: number) =>
      ['leaderboards', 'page', game, score, time, count, offset] as const,
    rank: (userId: string, game: string, score: string, time: string) =>
      ['leaderboards', 'rank', userId, game, score, time] as const,
  },
  owner: (address: string) => ['owner', address] as const,
  product: (productId: string, currency: string, scope: string) =>
    ['product', productId, currency, scope] as const,
  rentals: (scope: string, category: string) => ['rentals', scope, category] as const,
  rentalsAll: ['rentals'] as const,
  rentalPass: (scope: string) => ['rentals', 'pass-balance', scope] as const,
  merkleClaim: (chainId: number, address: string) => ['merkle-claim', chainId, address] as const,
  launcherVersion: (environment: string, platform: string) =>
    ['launcher-version', environment, platform] as const,
} as const

export const getAuthQueryScope = (authToken?: string): string => {
  if (!authToken) return 'anonymous'
  let hash = 2166136261
  for (let index = 0; index < authToken.length; index += 1) {
    hash ^= authToken.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return `session-${authToken.length}-${(hash >>> 0).toString(36)}`
}

type FetchApiQueryOptions = {
  signal?: AbortSignal
  init?: RequestInit
  textOnly?: boolean
  fetcher?: typeof fetch
}

export async function fetchApiQuery<T>(
  url: string,
  { signal, init, textOnly = false, fetcher = fetch }: FetchApiQueryOptions = {}
): Promise<T> {
  if (isAuditFixtureEnabled) return getAuditFixtureData(url) as T

  const response = await fetcher(url, { ...init, signal })
  if (!response.ok)
    throw new ApiQueryError(response.statusText || 'Request failed', response.status)
  if (textOnly) return (await response.text()) as T

  const payload = (await response.json()) as T
  if (
    payload &&
    typeof payload === 'object' &&
    'statusCode' in payload &&
    typeof payload.statusCode === 'number' &&
    payload.statusCode >= 400
  ) {
    const message =
      'body' in payload && typeof payload.body === 'string' ? payload.body : 'Request failed'
    throw new ApiQueryError(message, payload.statusCode)
  }
  return payload
}
