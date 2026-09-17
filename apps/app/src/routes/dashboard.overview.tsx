import { createFileRoute } from '@tanstack/solid-router'

import DashboardOverviewRouteBoundary from '@/pages/dashboard/overview/DashboardOverviewRouteBoundary'
import { getRequestCookieHeader } from '@/runtime/request-cookies'
import { readAuthCookieToken } from '@/state/auth-storage'
import {
  authedToken,
  arcadeBalanceQueryOptions,
  gamerProfileQueryOptions,
} from '@/query/authed-options'
import { profileFavoritesQueryOptions } from '@/hooks/useGamerProfile/useProfileFavDegens'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/dashboard/overview')({
  head: () => buildHead({ path: '/dashboard/overview', title: 'Dashboard Overview' }),
  // Warm the page's token-scoped queries on navigation intent (hover) and
  // route matches so the leaf renders from cache instead of fetching after
  // its chunk waterfall resolves. On the server the token comes from the
  // cookie mirror, so the SSR stream carries real data; failures never block
  // the route (the client hooks then fetch as before). No-op when signed out.
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
