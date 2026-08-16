'use client'

import { useEffect, useState } from 'react'

import { scheduleDeferredActivation } from '@nl/ui/lib/deferred-activation'

const loadSnackbar = () => import('@/components/extended/Snackbar')
const loadToaster = () => import('@nl/ui/base/sonner')

const loadNotifications = () =>
  Promise.all([loadSnackbar(), loadToaster()]).then(([{ default: Snackbar }, { Toaster }]) => ({
    default: function LoadedNotifications() {
      return (
        <>
          <Snackbar />
          <Toaster position="top-right" closeButton richColors />
        </>
      )
    },
  }))

export default function DeferredNotifications(): React.ReactNode {
  const [Notifications, setNotifications] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    let cancelled = false

    const activate = async () => {
      if (cancelled) return

      try {
        const { default: LoadedNotifications } = await loadNotifications()
        if (!cancelled) setNotifications(() => LoadedNotifications)
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
