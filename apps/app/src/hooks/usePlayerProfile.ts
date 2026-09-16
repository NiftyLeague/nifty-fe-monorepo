import { useQuery } from '@tanstack/solid-query'
import type { Profile } from '@/types/account'
import useAuth from './useAuth'
import { playerProfileQueryOptions } from '@/query/authed-options'

const usePlayerProfile = (): {
  readonly error?: Error
  readonly profile?: Profile
  readonly loadingProfile?: boolean
} => {
  const auth = useAuth()
  const query = useQuery(() => playerProfileQueryOptions(auth.authToken))
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
  }
}

export default usePlayerProfile
