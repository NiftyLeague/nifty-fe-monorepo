'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/solid-query'

import { PROFILE_FAV_DEGENS_API } from '@/constants/url'
import { profileFavoritesQueryOptions } from '@/hooks/useGamerProfile/useProfileFavDegens'
import useAuth from '@/hooks/useAuth'
import { getAuthQueryScope, queryKeys } from '@/query/app-query'
import { toggleValue } from '@/utils/collections'

const saveFavoriteDegens = async (favorites: string[], authToken?: string) => {
  const response = await fetch(PROFILE_FAV_DEGENS_API, {
    method: 'POST',
    body: JSON.stringify({ favorites: favorites.toString() }),
    headers: { authorizationToken: authToken || '' },
  })
  if (!response.ok) throw new Error(response.statusText || 'Unable to update favorites')
  return favorites
}

const EMPTY_FAVORITES: string[] = []

/** Same split-and-filter semantics the removed FAV_DEGENS sync effect applied. */
export const parseFavorites = (favorites?: string | null): string[] =>
  favorites && favorites !== 'null' ? favorites.split(',').filter(Boolean) : []

// Module-level so TanStack's select memoization keeps the array reference
// stable between cache changes, which keeps memoized DegenCards out of
// unrelated re-renders.
const selectFavorites = (data?: { favorites: string }): string[] =>
  data ? parseFavorites(data.favorites) : EMPTY_FAVORITES

export default function useFavoriteDegens() {
  const auth = useAuth()
  const scope = () => getAuthQueryScope(auth.authToken)
  const queryClient = useQueryClient()

  // The profile-favorites query cache is the only favorites owner; the
  // derived list updates wherever the cache updates.
  const favoritesQuery = useQuery(() => ({
    ...profileFavoritesQueryOptions(auth.authToken),
    select: selectFavorites,
  }))

  const mutation = useMutation(() => ({
    mutationFn: (favorites: string[]) => saveFavoriteDegens(favorites, auth.authToken),
    onMutate: async (favorites: string[]) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.profile.favorites(scope()) })
      const previous = queryClient.getQueryData<{ favorites: string }>(
        queryKeys.profile.favorites(scope())
      )
      queryClient.setQueryData(queryKeys.profile.favorites(scope()), {
        favorites: favorites.toString(),
      })
      return { previous }
    },
    onError: (
      _error: unknown,
      _favorites: string[],
      context: { previous?: { favorites: string } } | undefined
    ) => {
      if (context) {
        queryClient.setQueryData(queryKeys.profile.favorites(scope()), context.previous)
      }
    },
    onSuccess: (favorites: string[]) => {
      queryClient.setQueryData(queryKeys.profile.favorites(scope()), {
        favorites: favorites.toString(),
      })
    },
  }))

  const toggleFavorite = (degenId: string) =>
    mutation.mutateAsync(
      toggleValue((favoritesQuery.data ?? EMPTY_FAVORITES).filter(Boolean), degenId)
    )

  return {
    get favDegens() {
      return favoritesQuery.data ?? EMPTY_FAVORITES
    },
    get isUpdatingFavorites() {
      return mutation.isPending
    },
    toggleFavorite,
  }
}
