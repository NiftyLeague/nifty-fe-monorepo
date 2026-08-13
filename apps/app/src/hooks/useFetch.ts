'use client'

import { useEffect, useMemo, useReducer, useRef } from 'react'

import { getAuditFixtureData, isAuditFixtureEnabled } from '@/audit/fixture'

interface State<T> {
  data?: T
  error?: Error
  loading?: boolean
  reset?: boolean
}

type Cache<T> = Record<string, T>

type SharedCacheEntry = {
  value: unknown
  expiresAt: number
}

const SHARED_CACHE_TTL_MS = 5 * 60 * 1000
const sharedCache = new Map<string, SharedCacheEntry>()
const pendingRequests = new Map<string, Promise<unknown>>()

type Action<T> =
  | { type: 'loading' }
  | { type: 'reset' }
  | { type: 'fetched'; payload: T }
  | { type: 'error'; payload: Error }

const initialState: State<unknown> = {
  data: undefined,
  error: undefined,
  loading: undefined,
  reset: undefined,
}

function fetchReducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'loading':
      return { ...initialState, loading: true } as State<T>
    case 'fetched':
      return { ...initialState, loading: false, data: action.payload } as State<T>
    case 'error':
      return { ...initialState, loading: false, error: action.payload } as State<T>
    case 'reset':
      return { ...initialState, loading: false } as State<T>
    default:
      return state
  }
}

type Options = RequestInit & { enabled?: boolean; sharedCache?: boolean }

const getRequestKey = (url: string, requestInit: RequestInit, textOnly: boolean): string => {
  const normalizedHeaders = new Headers(requestInit.headers)
  const headers = Array.from(normalizedHeaders.entries()).sort(([left], [right]) =>
    left.localeCompare(right)
  )

  return JSON.stringify({
    url,
    method: requestInit.method ?? 'GET',
    headers,
    body: typeof requestInit.body === 'string' ? requestInit.body : undefined,
    cache: requestInit.cache,
    credentials: requestInit.credentials,
    mode: requestInit.mode,
    redirect: requestInit.redirect,
    textOnly,
  })
}

async function fetchOnce<T>(
  url: string,
  requestInit: RequestInit,
  textOnly: boolean,
  requestKey: string,
  shareRequest: boolean
): Promise<T> {
  if (shareRequest) {
    const pending = pendingRequests.get(requestKey)
    if (pending) return pending as Promise<T>
  }

  const request = fetch(url, { ...requestInit, headers: requestInit.headers })
    .then(async (response) => {
      if (!response.ok) throw new Error(response.statusText)
      return (textOnly ? await response.text() : await response.json()) as T
    })
    .finally(() => shareRequest && pendingRequests.delete(requestKey))

  if (shareRequest) pendingRequests.set(requestKey, request)
  return request
}

function useFetch<T = unknown>(url?: string, options?: Options, textOnly = false): State<T> {
  const cache = useRef<Cache<T>>({})
  const enabled = useMemo(() => options?.enabled ?? true, [options?.enabled])
  const shouldShareCache = useMemo(() => options?.sharedCache ?? false, [options?.sharedCache])
  const optionsKey = JSON.stringify(options)
  // The serialized key keeps inline request option objects from restarting the
  // request when a consuming component re-renders.
  const requestInit = useMemo(() => {
    const { enabled: _enabled, sharedCache: _sharedCache, ...init } = options ?? {}
    return init
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey])
  const requestKey = useMemo(
    () => (url ? getRequestKey(url, requestInit, textOnly) : undefined),
    [requestInit, textOnly, url]
  )
  const hasReset = useRef(false)
  const [state, dispatch] = useReducer(fetchReducer, initialState)

  useEffect(() => {
    if (!url) return
    if (enabled === false) {
      if (!hasReset.current) {
        dispatch({ type: 'reset' })
        hasReset.current = true
      }
      return
    }

    hasReset.current = false
    let active = true
    dispatch({ type: 'loading' })

    const fetchData = async () => {
      if (isAuditFixtureEnabled) {
        if (active) dispatch({ type: 'fetched', payload: getAuditFixtureData(url) as T })
        return
      }

      const cacheKey = requestKey ?? url
      if (Object.prototype.hasOwnProperty.call(cache.current, cacheKey)) {
        if (active) dispatch({ type: 'fetched', payload: cache.current[cacheKey] })
        return
      }

      if (shouldShareCache && requestKey) {
        const cached = sharedCache.get(requestKey)
        if (cached?.expiresAt && cached.expiresAt > Date.now()) {
          cache.current[cacheKey] = cached.value as T
          if (active) dispatch({ type: 'fetched', payload: cached.value as T })
          return
        }
        if (cached) sharedCache.delete(requestKey)
      }

      try {
        const data = await fetchOnce<T>(url, requestInit, textOnly, cacheKey, shouldShareCache)
        cache.current[cacheKey] = data
        if (shouldShareCache && requestKey) {
          sharedCache.set(requestKey, {
            value: data,
            expiresAt: Date.now() + SHARED_CACHE_TTL_MS,
          })
        }
        if (active) dispatch({ type: 'fetched', payload: data })
      } catch (error) {
        if (active) dispatch({ type: 'error', payload: error as Error })
      }
    }

    void fetchData()

    return () => {
      active = false
    }
  }, [enabled, requestInit, requestKey, shouldShareCache, textOnly, url])

  return state as State<T>
}

export default useFetch
