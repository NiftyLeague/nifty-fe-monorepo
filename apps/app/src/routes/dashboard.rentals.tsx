import { createFileRoute } from '@tanstack/solid-router'

import DashboardRentalsRouteBoundary from '@/pages/dashboard/rentals/DashboardRentalsRouteBoundary'
import { authedToken, playerProfileQueryOptions, rentalsQueryOptions } from '@/query/authed-options'
import { acceptSearch } from '@/url/search-schema'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/dashboard/rentals')({
  head: () => buildHead({ path: '/dashboard/rentals', title: 'Rentals' }),
  validateSearch: acceptSearch,
  // Warm the nickname-edit profile and the default category's rentals before
  // the grid chunks load. Category switches prefetch through the same cache.
  loader: ({ context }) => {
    const token = authedToken()
    if (!token) return
    void context.queryClient.prefetchQuery(playerProfileQueryOptions(token))
    void context.queryClient.prefetchQuery(rentalsQueryOptions(token, 'all'))
  },
  component: DashboardRentalsRouteBoundary,
})
