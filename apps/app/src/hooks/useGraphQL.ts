'use client'

import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

import type { OwnerQueryData } from '@/types/graph'
import OWNER_QUERY from '@/queries/OWNER_QUERY'
import { SUBGRAPH_URI, SUBGRAPH_DEV_URI } from '@/constants'
import { TARGET_NETWORK } from '@/constants/networks'
import useAuth from '@/hooks/useAuth'
import { requestGraphQL } from '@/utils/graphql'

const endpoint = TARGET_NETWORK.name === 'mainnet' ? SUBGRAPH_URI : SUBGRAPH_DEV_URI
const headers = { Authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPH_API_KEY}` }

export function useOwnerSearch(
  overrideAddress?: `0x${string}`
): UseQueryResult<OwnerQueryData['owner']> {
  const { isLoggedIn } = useAuth()
  const { address } = useAccount()
  const key = (overrideAddress ?? address)?.toLowerCase() ?? ''
  const variables = { address: key }
  return useQuery({
    queryKey: ['owner', key],
    queryFn: async () => {
      const { owner } = await requestGraphQL<OwnerQueryData>({
        endpoint,
        query: OWNER_QUERY,
        variables,
        headers,
      })
      return owner
    },
    enabled: key.length > 20 && isLoggedIn,
  })
}
