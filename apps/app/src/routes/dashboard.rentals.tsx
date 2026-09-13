import { createFileRoute } from '@tanstack/react-router'

import DashboardRentalsRouteBoundary from '@/pages/dashboard/rentals/DashboardRentalsRouteBoundary'
import { acceptSearch } from '@/url/search-schema'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/dashboard/rentals')({
  head: () => buildHead({ path: '/dashboard/rentals', title: 'Rentals' }),
  validateSearch: acceptSearch,
  component: DashboardRentalsRouteBoundary,
})
