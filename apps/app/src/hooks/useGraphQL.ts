import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { request } from 'graphql-request';

import type { CharactersQueryData, OwnerQueryData } from '@/types/graph';
import useNetworkContext from '@/hooks/useNetworkContext';
import ID_SEARCH_QUERY from '@/queries/ID_SEARCH_QUERY';
import OWNER_QUERY from '@/queries/OWNER_QUERY';
import { SUBGRAPH_URI, SUBGRAPH_DEV_URI } from '@/constants';
import { TARGET_NETWORK } from '@/constants/networks';
import useAuth from '@/hooks/useAuth';

const endpoint = TARGET_NETWORK.name === 'mainnet' ? SUBGRAPH_URI : SUBGRAPH_DEV_URI;
const headers = { Authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPH_API_KEY}` };

export function useCharacterSearch(tokenId?: string): UseQueryResult<CharactersQueryData['characters']> {
  const variables = { search: tokenId };
  return useQuery({
    queryKey: ['characters', tokenId],
    queryFn: async () => {
      const { characters } = await request<CharactersQueryData>(endpoint, ID_SEARCH_QUERY, variables, headers);
      return characters;
    },
    enabled: !!tokenId,
  });
}

export function useOwnerSearch(overrideAddress?: `0x${string}`): UseQueryResult<OwnerQueryData['owner']> {
  const { isLoggedIn } = useAuth();
  const { address } = useNetworkContext();
  const key = (overrideAddress ?? address)?.toLowerCase() ?? '';
  const variables = { address: key };
  return useQuery({
    queryKey: ['owner', key],
    queryFn: async () => {
      const { owner } = await request<OwnerQueryData>(endpoint, OWNER_QUERY, variables, headers);
      return owner;
    },
    enabled: key.length > 20 && isLoggedIn,
  });
}
