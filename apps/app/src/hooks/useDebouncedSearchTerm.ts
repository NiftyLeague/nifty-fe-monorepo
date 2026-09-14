'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

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
): [string, React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>] {
  const [draft, setDraft] = useState(committed)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const commitRef = useRef(commit)
  commitRef.current = commit

  useEffect(() => {
    setDraft(committed)
  }, [committed])

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  const handleChange = useCallback<
    React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
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
