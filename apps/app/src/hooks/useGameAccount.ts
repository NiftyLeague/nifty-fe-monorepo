'use client'

import { useQuery } from '@tanstack/solid-query'
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
  readonly account: Account | undefined
  readonly accountError: Error | null
  readonly loadingAccount: boolean
  refetchAccount: () => void
}

const useGameAccount = (): GameAccountState => {
  const auth = useAuth()
  const query = useQuery(() => ({
    queryKey: queryKeys.account.game(getAuthQueryScope(auth.authToken)),
    queryFn: ({ signal }) =>
      fetchApiQuery<Account>(GAMER_ACCOUNT_API, {
        signal,
        init: { headers: { authorizationToken: auth.authToken || '' } },
      }),
    enabled: !isAuditFixtureEnabled && !!auth.authToken && auth.isLoggedIn,
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  }))

  return {
    get account() {
      return isAuditFixtureEnabled && auth.isLoggedIn ? AUDIT_FIXTURE_ACCOUNT : query.data
    },
    get accountError() {
      return isAuditFixtureEnabled ? null : ((query.error as Error | null) ?? null)
    },
    get loadingAccount() {
      return isAuditFixtureEnabled ? false : query.isLoading
    },
    refetchAccount: () => {
      if (!isAuditFixtureEnabled) void query.refetch()
    },
  }
}

export default useGameAccount
