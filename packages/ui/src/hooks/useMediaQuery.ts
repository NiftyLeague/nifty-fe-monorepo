import { createSignal, onCleanup, onMount, type Accessor } from 'solid-js'

type UseMediaQueryOptions = { defaultValue?: boolean }

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
  { defaultValue = false }: UseMediaQueryOptions = {}
): Accessor<boolean> => {
  const [matches, setMatches] = createSignal(
    IS_SERVER ? defaultValue : (getMediaQueryEntry(query)?.media.matches ?? defaultValue)
  )

  onMount(() => {
    const update = () => setMatches(getMediaQueryEntry(query)?.media.matches ?? defaultValue)
    update()
    onCleanup(subscribeToMediaQuery(query, update))
  })

  return matches
}

export default useMediaQuery
