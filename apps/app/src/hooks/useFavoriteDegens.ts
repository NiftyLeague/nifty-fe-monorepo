'use client'

import { useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { PROFILE_FAV_DEGENS_API } from '@/constants/url'
import { useProfileFavDegens } from '@/hooks/useGamerProfile'
import useAuth from '@/hooks/useAuth'
import useLocalStorageContext from '@/hooks/useLocalStorageContext'
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

export default function useFavoriteDegens() {
  const { authToken } = useAuth()
  const scope = getAuthQueryScope(authToken)
  const queryClient = useQueryClient()
  const { favs } = useProfileFavDegens()
  const { favDegens, setFavDegens } = useLocalStorageContext()

  useEffect(() => {
    if (favs && favs !== 'null') setFavDegens(favs.split(',').filter(Boolean))
  }, [favs, setFavDegens])

  const mutation = useMutation({
    mutationFn: (favorites: string[]) => saveFavoriteDegens(favorites, authToken),
    onMutate: async (favorites) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.profile.favorites(scope) })
      const previous = favDegens
      setFavDegens(favorites)
      return { previous }
    },
    onError: (_error, _favorites, context) => setFavDegens(context?.previous),
    onSuccess: (favorites) => {
      queryClient.setQueryData(queryKeys.profile.favorites(scope), {
        favorites: favorites.toString(),
      })
    },
  })

  return {
    favDegens,
    isUpdatingFavorites: mutation.isPending,
    toggleFavorite: (degenId: string) =>
      mutation.mutateAsync(toggleValue(favDegens?.filter(Boolean) ?? [], degenId)),
  }
}
