import { createSignal, onCleanup, onMount, type Accessor } from 'solid-js'

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

/**
 * Shares the document visibility listener across UI primitives that own
 * background timers. SSR renders start visible so hydration stays stable,
 * while consumers stop work as soon as the tab is hidden.
 */
export function useDocumentVisibility(): Accessor<boolean> {
  const [visible, setVisible] = createSignal(typeof document === 'undefined' || !document.hidden)

  onMount(() => {
    const update = () => setVisible(!document.hidden)
    update()
    onCleanup(subscribe(update))
  })

  return visible
}

export default useDocumentVisibility
