'use client'

import {  } from 'solid-js'
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
  const { authToken } = useAuth()
  const scope = getAuthQueryScope(authToken)
  const queryClient = useQueryClient()

  // The profile-favorites query cache is the only favorites owner; the
  // derived list updates wherever the cache updates.
  const { data: favDegens = EMPTY_FAVORITES } = useQuery({
    ...profileFavoritesQueryOptions(authToken),
    select: selectFavorites,
  })

  const mutation = useMutation({
    mutationFn: (favorites: string[]) => saveFavoriteDegens(favorites, authToken),
    onMutate: async (favorites) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.profile.favorites(scope) })
      const previous = queryClient.getQueryData<{ favorites: string }>(
        queryKeys.profile.favorites(scope)
      )
      queryClient.setQueryData(queryKeys.profile.favorites(scope), {
        favorites: favorites.toString(),
      })
      return { previous }
    },
    onError: (_error, _favorites, context) => {
      if (context) {
        queryClient.setQueryData(queryKeys.profile.favorites(scope), context.previous)
      }
    },
    onSuccess: (favorites) => {
      queryClient.setQueryData(queryKeys.profile.favorites(scope), {
        favorites: favorites.toString(),
      })
    },
  })

  const toggleFavorite = (
    (degenId: string) => mutation.mutateAsync(toggleValue(favDegens.filter(Boolean), degenId)),
    [favDegens, mutation.mutateAsync]
  )

  return {
    favDegens,
    isUpdatingFavorites: mutation.isPending,
    toggleFavorite,
  }
}
