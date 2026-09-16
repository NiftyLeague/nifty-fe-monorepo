import { createFileRoute } from '@tanstack/solid-router'

import GamerProfileRouteBoundary from '@/pages/dashboard/gamer-profile/GamerProfileRouteBoundary'
import { authedToken, gamerProfileQueryOptions } from '@/query/authed-options'
import { profileFavoritesQueryOptions } from '@/hooks/useGamerProfile/useProfileFavDegens'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/dashboard/gamer-profile')({
  head: () => buildHead({ path: '/dashboard/gamer-profile', title: 'Gamer Profile' }),
  loader: ({ context }) => {
    const token = authedToken()
    if (!token) return
    void context.queryClient.prefetchQuery(gamerProfileQueryOptions(token))
    void context.queryClient.prefetchQuery(profileFavoritesQueryOptions(token))
  },
  component: GamerProfileRouteBoundary,
})
