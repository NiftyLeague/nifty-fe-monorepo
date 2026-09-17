import { createFileRoute } from '@tanstack/solid-router'

import DashboardOverviewRouteBoundary from '@/pages/dashboard/overview/DashboardOverviewRouteBoundary'
import { getRequestCookieHeader } from '@/runtime/request-cookies'
import { readAuthCookieToken } from '@/state/auth-storage'
import {
  arcadeBalanceQueryOptions,
  authedToken,
  gamerProfileQueryOptions,
} from '@/query/authed-options'
import { profileFavoritesQueryOptions } from '@/hooks/useGamerProfile/useProfileFavDegens'

export const Route = createFileRoute('/dashboard/')({
  // Warm the page's token-scoped queries on navigation intent (hover) and
  // route matches so the leaf renders from cache instead of fetching after
  // its chunk waterfall resolves. No-op server-side and when signed out.
  loader: async ({ context }) => {
    const token = readAuthCookieToken(getRequestCookieHeader()) ?? authedToken()
    if (!token) return
    await Promise.allSettled([
      context.queryClient.prefetchQuery(gamerProfileQueryOptions(token)),
      context.queryClient.prefetchQuery(profileFavoritesQueryOptions(token)),
      context.queryClient.prefetchQuery(arcadeBalanceQueryOptions(token)),
    ])
  },
  component: DashboardOverviewRouteBoundary,
})
