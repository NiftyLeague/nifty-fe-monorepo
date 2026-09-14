import { QueryClientProvider } from '@tanstack/react-query'
import { act, render, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'
import type { Mock } from 'bun:test'
import type { PropsWithChildren } from 'react'

import { createAppQueryClient, getAuthQueryScope, queryKeys } from '@/query/app-query'
import { useAuthToken } from '@/hooks/useAuthStorage'
import useFavoriteDegens, { parseFavorites } from './useFavoriteDegens'
import AuthTokenContext from '@/contexts/AuthTokenContext'

const favoritesResponse = (favorites: string, status = 200) =>
  new Response(JSON.stringify({ favorites }), { status })

const FAVORITES_KEY = queryKeys.profile.favorites(getAuthQueryScope('test-token'))

// Module-scope placeholder assignments keep the deferred capture pattern
// readable without triggering consistent-function-scoping.
const noResolve = () => {}
const pendingToggle = () => Promise.resolve()

let fetchMock: Mock

afterEach(() => {
  fetchMock?.mockRestore()
  fetchMock = undefined as unknown as Mock
})

beforeEach(() => {
  window.localStorage.clear()
})

const wrapperFor =
  (client: ReturnType<typeof createAppQueryClient>) =>
  ({ children }: PropsWithChildren) => (
    <AuthTokenContext.Provider
      value={{
        authToken: 'test-token',
        handleConnectWallet: () => Promise.resolve(),
        isConnected: true,
        isLoggedIn: true,
      }}
    >
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </AuthTokenContext.Provider>
  )

describe('favorite DEGEN mutation', () => {
  it('derives the favorites list from the profile-favorites cache', async () => {
    const client = createAppQueryClient()
    client.setQueryData(FAVORITES_KEY, { favorites: '1,2,3' })
    const { result } = renderHook(() => useFavoriteDegens(), {
      wrapper: wrapperFor(client),
    })

    await waitFor(() => expect(result.current.favDegens).toEqual(['1', '2', '3']))
  })

  it('writes the cache optimistically before the POST resolves', async () => {
    let resolvePost: (response: Response) => void = noResolve
    fetchMock = spyOn(globalThis, 'fetch').mockImplementation((_, init) => {
      if (init?.method === 'POST') {
        return new Promise<Response>((resolve) => {
          resolvePost = resolve
        })
      }
      return Promise.resolve(favoritesResponse(''))
    })
    const client = createAppQueryClient()
    const { result } = renderHook(() => useFavoriteDegens(), {
      wrapper: wrapperFor(client),
    })
    await waitFor(() => expect(result.current.favDegens).toEqual([]))

    let pending: Promise<unknown> = Promise.resolve()
    await act(async () => {
      pending = result.current.toggleFavorite('7')
      await waitFor(() => expect(client.getQueryData(FAVORITES_KEY)).toEqual({ favorites: '7' }))
    })

    await act(async () => {
      resolvePost(new Response('{}', { status: 200 }))
      await pending
    })
    expect(client.getQueryData(FAVORITES_KEY)).toEqual({ favorites: '7' })
  })

  it('rolls the cache back when the POST fails', async () => {
    fetchMock = spyOn(globalThis, 'fetch').mockImplementation((_, init) =>
      Promise.resolve(
        init?.method === 'POST' ? new Response('{}', { status: 500 }) : favoritesResponse('5')
      )
    )
    const client = createAppQueryClient()
    const { result } = renderHook(() => useFavoriteDegens(), {
      wrapper: wrapperFor(client),
    })
    await waitFor(() => expect(result.current.favDegens).toEqual(['5']))

    await act(async () => {
      await result.current.toggleFavorite('7').catch(() => {})
    })

    expect(client.getQueryData(FAVORITES_KEY)).toEqual({ favorites: '5' })
  })

  it('parses the favorites string with the legacy sync-effect semantics', () => {
    expect(parseFavorites('1,2,3')).toEqual(['1', '2', '3'])
    expect(parseFavorites('1,,2')).toEqual(['1', '2'])
    expect(parseFavorites('')).toEqual([])
    expect(parseFavorites(null)).toEqual([])
    expect(parseFavorites('null')).toEqual([])
  })

  it('does not re-render an auth-only consumer when favorites change', async () => {
    fetchMock = spyOn(globalThis, 'fetch').mockImplementation((_, init) =>
      Promise.resolve(
        init?.method === 'POST' ? new Response('{}', { status: 200 }) : favoritesResponse('')
      )
    )
    let authRenders = 0
    let toggleFavorite: (degenId: string) => Promise<unknown> = pendingToggle

    const AuthOnlyConsumer = () => {
      useAuthToken()
      authRenders += 1
      return null
    }
    const FavoritesConsumer = () => {
      const api = useFavoriteDegens()
      toggleFavorite = api.toggleFavorite
      return null
    }

    const client = createAppQueryClient()
    render(
      <AuthTokenContext.Provider
        value={{
          authToken: 'test-token',
          handleConnectWallet: () => Promise.resolve(),
          isConnected: true,
          isLoggedIn: true,
        }}
      >
        <QueryClientProvider client={client}>
          <AuthOnlyConsumer />
          <FavoritesConsumer />
        </QueryClientProvider>
      </AuthTokenContext.Provider>
    )
    await waitFor(() => expect(authRenders).toBeGreaterThan(0))
    const rendersBeforeToggle = authRenders

    await act(async () => {
      await toggleFavorite('7')
    })

    expect(authRenders).toBe(rendersBeforeToggle)
    expect(client.getQueryData(FAVORITES_KEY)).toEqual({ favorites: '7' })
  })
})
