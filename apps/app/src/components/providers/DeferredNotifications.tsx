'use client'

import { Dynamic } from 'solid-js/web'
import { createSignal, onCleanup, onMount, type Component, type JSX } from 'solid-js'

import { scheduleDeferredActivation } from '@nl/ui/lib/deferred-activation'

const loadSnackbar = () => import('@/components/extended/Snackbar')
const loadToaster = () => import('@nl/ui/base/sonner')

const LoadedNotifications = (props: {
  Snackbar: Component
  Toaster: Component<{
    position: 'top-right'
    closeButton: boolean
    richColors: boolean
  }>
}) => (
  <>
    <props.Snackbar />
    <props.Toaster position="top-right" closeButton richColors />
  </>
)

const createLoadedNotifications = (
  Snackbar: Component,
  Toaster: Component<{
    position: 'top-right'
    closeButton: boolean
    richColors: boolean
  }>
) =>
  function LoadedNotificationChunk() {
    return <LoadedNotifications Snackbar={Snackbar} Toaster={Toaster} />
  }

const loadNotifications = () =>
  Promise.all([loadSnackbar(), loadToaster()]).then(([{ default: Snackbar }, { Toaster }]) => ({
    default: createLoadedNotifications(Snackbar, Toaster),
  }))

export default function DeferredNotifications(): JSX.Element {
  const [Notifications, setNotifications] = createSignal<Component | null>(null)

  onMount(() => {
    let cancelled = false

    const activate = async () => {
      if (cancelled) return

      try {
        const { default: LoadedNotificationComponent } = await loadNotifications()
        if (!cancelled) setNotifications(() => LoadedNotificationComponent)
      } catch {
        // Notifications are non-critical. Keep the shell usable if an optional
        // notification chunk fails to load.
      }
    }

    const cleanup = scheduleDeferredActivation({ onActivate: activate })

    onCleanup(() => {
      cancelled = true
      cleanup()
    })
  })

  return <Dynamic component={Notifications() ?? undefined} />
}
