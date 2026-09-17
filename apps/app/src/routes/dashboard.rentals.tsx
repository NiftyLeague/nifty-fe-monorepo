import { createFileRoute } from '@tanstack/solid-router'

import DashboardRentalsRouteBoundary from '@/pages/dashboard/rentals/DashboardRentalsRouteBoundary'
import { getRequestCookieHeader } from '@/runtime/request-cookies'
import { readAuthCookieToken } from '@/state/auth-storage'
import { authedToken, playerProfileQueryOptions, rentalsQueryOptions } from '@/query/authed-options'
import { acceptSearch } from '@/url/search-schema'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/dashboard/rentals')({
  head: () => buildHead({ path: '/dashboard/rentals', title: 'Rentals' }),
  validateSearch: acceptSearch,
  // Warm the nickname-edit profile and the default category's rentals before
  // the grid chunks load; on the server the cookie-mirrored token puts the
  // rentals into the SSR stream. Category switches prefetch through the same
  // cache.
  loader: async ({ context }) => {
    const token = readAuthCookieToken(getRequestCookieHeader()) ?? authedToken()
    if (!token) return
    await Promise.allSettled([
      context.queryClient.prefetchQuery(playerProfileQueryOptions(token)),
      context.queryClient.prefetchQuery(rentalsQueryOptions(token, 'all')),
    ])
  },
  component: DashboardRentalsRouteBoundary,
})
