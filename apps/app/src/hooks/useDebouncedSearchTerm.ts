'use client'

import { createEffect, createSignal } from 'solid-js'

/**
 * Decouples typing from the URL-owned search term.
 *
 * The input updates a component-local draft on every keystroke, while only the
 * settled value commits to the URL state owner — one history replace and one
 * catalogue request per pause in typing instead of per keypress. The draft
 * follows committed changes (back/forward, programmatic resets), which is also
 * what re-syncs it right after the debounce commits.
 */
export function useDebouncedSearchTerm(
  committed: string,
  commit: (searchTerm: string | null) => void,
  delayMs = 300
): [string, JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement>] {
  const [draft, setDraft] = createSignal(committed)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  let commitRef: any = commit
  commitRef.current = commit

  createEffect(() => {
    setDraft(committed)
  }, [committed])

  createEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  const handleChange = useCallback<
    JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement>
  >(
    (event) => {
      const value = event.target.value
      setDraft(value)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        timer.current = null
        commitRef.current(value || null)
      }, delayMs)
    },
    [delayMs]
  )

  return [draft, handleChange]
}
