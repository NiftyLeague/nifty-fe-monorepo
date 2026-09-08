import { QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'
import type { PropsWithChildren } from 'react'

import { createAppQueryClient, getAuthQueryScope, queryKeys } from '@/query/app-query'

const setFavDegens = mock()
let favDegens: string[] = []

mock.module('@/hooks/useAuth', () => ({ default: () => ({ authToken: 'test-token' }) }))
mock.module('@/hooks/useGamerProfile', () => ({ useProfileFavDegens: () => ({}) }))
mock.module('@/hooks/useLocalStorageContext', () => ({
  default: () => ({ favDegens, setFavDegens }),
}))

let useFavoriteDegens: typeof import('./useFavoriteDegens').default

beforeEach(async () => {
  favDegens = []
  setFavDegens.mockClear()
  useFavoriteDegens = (await import('./useFavoriteDegens')).default
})

describe('favorite DEGEN mutation', () => {
  it('optimistically updates and commits the exact favorites cache', async () => {
    const fetchMock = spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('{}', { status: 200 })
    )
    const client = createAppQueryClient()
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )
    const { result } = renderHook(() => useFavoriteDegens(), { wrapper })

    await act(async () => {
      await result.current.toggleFavorite('7')
    })

    expect(setFavDegens).toHaveBeenCalledWith(['7'])
    expect(fetchMock).toHaveBeenCalledTimes(1)
    await waitFor(() =>
      expect(
        client.getQueryData(queryKeys.profile.favorites(getAuthQueryScope('test-token')))
      ).toEqual({ favorites: '7' })
    )
  })
})
