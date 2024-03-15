import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { request } from 'graphql-request';

import type { CharactersQueryData, OwnerQueryData } from '@/types/graph';
import useNetworkContext from '@/hooks/useNetworkContext';
import ID_SEARCH_QUERY from '@/queries/ID_SEARCH_QUERY';
import OWNER_QUERY from '@/queries/OWNER_QUERY';
import { SUBGRAPH_URI } from '@/constants';
import useAuth from '@/hooks/useAuth';

const endpoint = SUBGRAPH_URI;

export function useCharacterSearch(tokenId?: string): UseQueryResult<CharactersQueryData['characters']> {
  const variables = { search: tokenId };
  return useQuery({
    queryKey: ['characters', tokenId],
    queryFn: async () => {
      const { characters } = await request<CharactersQueryData>(endpoint, ID_SEARCH_QUERY, variables);
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
      const { owner } = await request<OwnerQueryData>(SUBGRAPH_URI, OWNER_QUERY, variables);
      return owner;
    },
    enabled: key.length > 20 && isLoggedIn,
  });
}
