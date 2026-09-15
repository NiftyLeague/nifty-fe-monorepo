'use client'

import { createEffect, createSignal, onCleanup, type Accessor, type JSX } from 'solid-js'

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
  committed: string | Accessor<string>,
  commit: (searchTerm: string | null) => void,
  delayMs = 300
): [Accessor<string>, JSX.EventHandlerUnion<HTMLInputElement | HTMLTextAreaElement, Event>] {
  const committedValue = () => (typeof committed === 'function' ? committed() : committed)
  const [draft, setDraft] = createSignal(committedValue())
  let timer: ReturnType<typeof setTimeout> | null = null

  createEffect(() => {
    setDraft(committedValue())
  })

  onCleanup(() => {
    if (timer) clearTimeout(timer)
  })

  const handleChange: JSX.EventHandlerUnion<HTMLInputElement | HTMLTextAreaElement, Event> = (
    event
  ) => {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value
    setDraft(value)
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      commit(value || null)
    }, delayMs)
  }

  return [draft, handleChange]
}
