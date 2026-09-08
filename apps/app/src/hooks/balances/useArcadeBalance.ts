'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
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
  balance: number
  error: Error | null
  loading: boolean
  refetch: () => void
}

export default function useArcadeBalance(): ArcadeBalanceState {
  const { authToken, isLoggedIn } = useAuth()
  const scope = getAuthQueryScope(authToken)
  const { data, isLoading, error, refetch } = useQuery<ArcadeBalanceInfo>({
    queryKey: queryKeys.account.arcadeBalance(scope),
    queryFn: ({ signal }) =>
      fetchApiQuery<ArcadeBalanceInfo>(GET_ARCADE_TOKEN_BALANCE_API, {
        signal,
        init: { headers: { authorizationToken: authToken || '' } },
      }),
    enabled: !!authToken && isLoggedIn,
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  })

  const balance = useMemo(() => data?.balance ?? 0, [data])

  return { balance, error, loading: isLoading, refetch }
}
