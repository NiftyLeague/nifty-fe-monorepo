'use client'

import { useSyncExternalStore } from 'react'

const listeners = new Set<() => void>()

const handleVisibilityChange = () => {
  for (const listener of listeners) listener()
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)

  if (listeners.size === 1) {
    document.addEventListener('visibilitychange', handleVisibilityChange)
  }

  return () => {
    listeners.delete(listener)

    if (listeners.size === 0) {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }
}

const getSnapshot = () => typeof document === 'undefined' || !document.hidden
const getServerSnapshot = () => true

/**
 * Shares the document visibility listener across UI primitives that own
 * background timers. The server snapshot is visible so hydration stays
 * stable, while consumers stop work as soon as the tab is hidden.
 */
export function useDocumentVisibility(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export default useDocumentVisibility
