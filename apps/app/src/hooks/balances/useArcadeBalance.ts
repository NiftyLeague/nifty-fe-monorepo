import { useQuery } from '@tanstack/solid-query'
import useAuth from '@/hooks/useAuth'
import { arcadeBalanceQueryOptions } from '@/query/authed-options'

/*
  ~ What it does? ~

  Gets your arcade balance

  ~ How can I use? ~

  const { balance, error, loading, refetch } = useArcadeBalance();
*/

interface ArcadeBalanceState {
  readonly balance: number
  readonly error: Error | null
  readonly loading: boolean
  refetch: () => void
}

export default function useArcadeBalance(): ArcadeBalanceState {
  const auth = useAuth()
  const query = useQuery(() => ({
    ...arcadeBalanceQueryOptions(auth.authToken),
    enabled: !!auth.authToken && auth.isLoggedIn,
  }))

  return {
    get balance() {
      return query.data?.balance ?? 0
    },
    get error() {
      return (query.error as Error | null) ?? null
    },
    get loading() {
      return query.isLoading
    },
    refetch: () => void query.refetch(),
  }
}
