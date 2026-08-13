'use client'

import { useEffect, useLayoutEffect, useState } from 'react'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

type UseMediaQueryOptions = { defaultValue?: boolean; initializeWithValue?: boolean }

const IS_SERVER = typeof window === 'undefined'

type MediaQueryEntry = {
  media: MediaQueryList
  listeners: Set<() => void>
  handleChange: () => void
}

const mediaQueries = new Map<string, MediaQueryEntry>()

const getMediaQueryEntry = (query: string): MediaQueryEntry | undefined => {
  if (typeof window === 'undefined') return undefined

  const existingEntry = mediaQueries.get(query)
  if (existingEntry) return existingEntry

  const media = window.matchMedia(query)
  const entry: MediaQueryEntry = {
    media,
    listeners: new Set(),
    handleChange: () => {
      for (const listener of entry.listeners) listener()
    },
  }

  mediaQueries.set(query, entry)
  return entry
}

const subscribeToMediaQuery = (query: string, listener: () => void): (() => void) => {
  const entry = getMediaQueryEntry(query)
  if (!entry) return () => undefined

  entry.listeners.add(listener)
  if (entry.listeners.size === 1) {
    if (entry.media.addListener) {
      entry.media.addListener(entry.handleChange)
    } else {
      entry.media.addEventListener('change', entry.handleChange)
    }
  }

  return () => {
    entry.listeners.delete(listener)
    if (entry.listeners.size > 0) return

    if (entry.media.removeListener) {
      entry.media.removeListener(entry.handleChange)
    } else {
      entry.media.removeEventListener('change', entry.handleChange)
    }
    mediaQueries.delete(query)
  }
}

export const useMediaQuery = (
  query: string,
  { defaultValue = false, initializeWithValue = true }: UseMediaQueryOptions = {}
): boolean => {
  const getMatches = (query: string): boolean => {
    return IS_SERVER ? defaultValue : (getMediaQueryEntry(query)?.media.matches ?? defaultValue)
  }

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query)
    }
    return defaultValue
  })

  // Handles the change event of the media query.
  function handleChange() {
    setMatches(getMatches(query))
  }

  useIsomorphicLayoutEffect(() => {
    // Triggered at the first client-side load and if query changes
    handleChange()

    return subscribeToMediaQuery(query, handleChange)
  }, [query])

  return matches
}

export default useMediaQuery
