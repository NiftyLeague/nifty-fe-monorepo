import { createFileRoute } from '@tanstack/solid-router'

import GamerProfileRouteBoundary from '@/pages/dashboard/gamer-profile/GamerProfileRouteBoundary'
import { getRequestCookieHeader } from '@/runtime/request-cookies'
import { readAuthCookieToken } from '@/state/auth-storage'
import { authedToken, gamerProfileQueryOptions } from '@/query/authed-options'
import { profileFavoritesQueryOptions } from '@/hooks/useGamerProfile/useProfileFavDegens'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/dashboard/gamer-profile')({
  head: () => buildHead({ path: '/dashboard/gamer-profile', title: 'Gamer Profile' }),
  loader: async ({ context }) => {
    const token = readAuthCookieToken(getRequestCookieHeader()) ?? authedToken()
    if (!token) return
    await Promise.allSettled([
      context.queryClient.prefetchQuery(gamerProfileQueryOptions(token)),
      context.queryClient.prefetchQuery(profileFavoritesQueryOptions(token)),
    ])
  },
  component: GamerProfileRouteBoundary,
})
