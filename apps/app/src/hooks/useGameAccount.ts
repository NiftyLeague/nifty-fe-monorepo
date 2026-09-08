'use client'

import { useQuery } from '@tanstack/react-query'
import { GAMER_ACCOUNT_API } from '@/constants/url'
import type { Account } from '@/types/account'
import { AUDIT_FIXTURE_ACCOUNT, isAuditFixtureEnabled } from '@/audit/fixture'
import useAuth from './useAuth'
import {
  AUTHENTICATED_STALE_TIME_MS,
  fetchApiQuery,
  getAuthQueryScope,
  queryKeys,
} from '@/query/app-query'

interface GameAccountState {
  account: Account | undefined
  accountError: Error | null
  loadingAccount: boolean
  refetchAccount: () => void
}

const useGameAccount = (): GameAccountState => {
  const { authToken, isLoggedIn } = useAuth()
  const scope = getAuthQueryScope(authToken)
  const { data, isLoading, error, refetch } = useQuery<Account>({
    queryKey: queryKeys.account.game(scope),
    queryFn: ({ signal }) =>
      fetchApiQuery<Account>(GAMER_ACCOUNT_API, {
        signal,
        init: { headers: { authorizationToken: authToken || '' } },
      }),
    enabled: !isAuditFixtureEnabled && !!authToken && isLoggedIn,
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  })

  return {
    account: isAuditFixtureEnabled && isLoggedIn ? AUDIT_FIXTURE_ACCOUNT : data,
    accountError: isAuditFixtureEnabled ? null : error,
    loadingAccount: isAuditFixtureEnabled ? false : isLoading,
    refetchAccount: isAuditFixtureEnabled ? () => {} : refetch,
  }
}

export default useGameAccount
