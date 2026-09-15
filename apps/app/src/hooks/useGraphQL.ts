'use client'

import { useQuery } from '@tanstack/solid-query'
import { useAccount } from '@/runtime/wagmi'

import type { OwnerQueryData } from '@/types/graph'
import OWNER_QUERY from '@/queries/OWNER_QUERY'
import { SUBGRAPH_URI, SUBGRAPH_DEV_URI } from '@/constants'
import { TARGET_NETWORK } from '@/constants/networks'
import useAuth from '@/hooks/useAuth'
import { requestGraphQL } from '@/utils/graphql'
import { AUTHENTICATED_STALE_TIME_MS, queryKeys } from '@/query/app-query'
import { GRAPH_API_KEY } from '@/runtime/env'

const endpoint = TARGET_NETWORK.name === 'mainnet' ? SUBGRAPH_URI : SUBGRAPH_DEV_URI
const headers = { Authorization: `Bearer ${GRAPH_API_KEY}` }

export function useOwnerSearch(overrideAddress?: `0x${string}`) {
  const auth = useAuth()
  const account = useAccount()
  const key = () => (overrideAddress ?? account.address)?.toLowerCase() ?? ''

  return useQuery(() => ({
    queryKey: queryKeys.owner(key()),
    queryFn: async ({ signal }) => {
      const { owner } = await requestGraphQL<OwnerQueryData>({
        endpoint,
        query: OWNER_QUERY,
        variables: { address: key() },
        headers,
        signal,
      })
      return owner
    },
    enabled: key().length > 20 && auth.isLoggedIn,
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  }))
}
