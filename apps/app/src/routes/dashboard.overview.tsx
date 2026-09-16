import { createFileRoute } from '@tanstack/solid-router'

import DashboardOverviewRouteBoundary from '@/pages/dashboard/overview/DashboardOverviewRouteBoundary'
import {
  arcadeBalanceQueryOptions,
  authedToken,
  gamerProfileQueryOptions,
} from '@/query/authed-options'
import { profileFavoritesQueryOptions } from '@/hooks/useGamerProfile/useProfileFavDegens'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/dashboard/overview')({
  head: () => buildHead({ path: '/dashboard/overview', title: 'Dashboard Overview' }),
  // Warm the page's token-scoped queries on navigation intent (hover) and
  // route matches so the leaf renders from cache instead of fetching after
  // its chunk waterfall resolves. No-op server-side and when signed out.
  loader: ({ context }) => {
    const token = authedToken()
    if (!token) return
    void context.queryClient.prefetchQuery(gamerProfileQueryOptions(token))
    void context.queryClient.prefetchQuery(profileFavoritesQueryOptions(token))
    void context.queryClient.prefetchQuery(arcadeBalanceQueryOptions(token))
  },
  component: DashboardOverviewRouteBoundary,
})
