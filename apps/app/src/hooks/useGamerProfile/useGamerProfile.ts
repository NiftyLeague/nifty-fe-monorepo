import { useQuery } from '@tanstack/solid-query'
import useAuth from '@/hooks/useAuth'
import { gamerProfileQueryOptions } from '@/query/authed-options'
import type { Profile } from '@/types/account'

const useGamerProfile = (): {
  readonly error?: Error
  readonly profile?: Profile
  readonly loadingProfile?: boolean
  fetchUserProfile?: () => Promise<Profile>
} => {
  const auth = useAuth()

  const query = useQuery(() => ({
    ...gamerProfileQueryOptions(auth.authToken),
    enabled: auth.isLoggedIn && !!auth.authToken,
  }))

  const fetchUserProfile = async () => {
    const result = await query.refetch({ throwOnError: true })
    if (!result.data) throw new Error('Profile unavailable')
    return result.data
  }

  return {
    get error() {
      return (query.error as Error | undefined) ?? undefined
    },
    get profile() {
      return query.data
    },
    get loadingProfile() {
      return query.isLoading
    },
    fetchUserProfile,
  }
}

export default useGamerProfile
