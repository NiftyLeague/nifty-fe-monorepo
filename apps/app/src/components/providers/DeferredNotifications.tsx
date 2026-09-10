'use client'

import { useEffect, useState } from 'react'

import { scheduleDeferredActivation } from '@nl/ui/lib/deferred-activation'

const loadSnackbar = () => import('@/components/extended/Snackbar')
const loadToaster = () => import('@nl/ui/base/sonner')

const LoadedNotifications = ({
  Snackbar,
  Toaster,
}: {
  Snackbar: React.ComponentType
  Toaster: React.ComponentType<{
    position: 'top-right'
    closeButton: boolean
    richColors: boolean
  }>
}) => (
  <>
    <Snackbar />
    <Toaster position="top-right" closeButton richColors />
  </>
)

const createLoadedNotifications = (
  Snackbar: React.ComponentType,
  Toaster: React.ComponentType<{
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

export default function DeferredNotifications(): React.ReactNode {
  const [Notifications, setNotifications] = useState<React.ComponentType | null>(null)

  useEffect(() => {
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

    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  return Notifications ? <Notifications /> : null
}
