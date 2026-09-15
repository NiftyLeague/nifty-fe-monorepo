'use client'

import { useQuery } from '@tanstack/solid-query'
import { GET_ARCADE_TOKEN_BALANCE_API } from '@/constants/url'
import useAuth from '@/hooks/useAuth'
import {
  AUTHENTICATED_STALE_TIME_MS,
  fetchApiQuery,
  getAuthQueryScope,
  queryKeys,
} from '@/query/app-query'

/*
  ~ What it does? ~

  Gets your arcade balance

  ~ How can I use? ~

  const { balance, error, loading, refetch } = useArcadeBalance();
*/

interface ArcadeBalanceInfo {
  updated_at: number
  balance_used: number
  balance: number
  user_id: string
  item_id: string
}

interface ArcadeBalanceState {
  readonly balance: number
  readonly error: Error | null
  readonly loading: boolean
  refetch: () => void
}

export default function useArcadeBalance(): ArcadeBalanceState {
  const auth = useAuth()
  const query = useQuery(() => ({
    queryKey: queryKeys.account.arcadeBalance(getAuthQueryScope(auth.authToken)),
    queryFn: ({ signal }) =>
      fetchApiQuery<ArcadeBalanceInfo>(GET_ARCADE_TOKEN_BALANCE_API, {
        signal,
        init: { headers: { authorizationToken: auth.authToken || '' } },
      }),
    enabled: !!auth.authToken && auth.isLoggedIn,
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  }))

  return {
    get balance() {
      return query.data?.balance ?? 0
    },
    get error() {
      return (query.error as Error | null) ?? null
    },
    get loading() {
      return query.isLoading
    },
    refetch: () => void query.refetch(),
  }
}
