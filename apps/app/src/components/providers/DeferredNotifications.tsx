'use client'

import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'

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
  const { Component: Notifications } = useDeferredComponent(loadNotifications)

  return Notifications ? <Notifications /> : null
}
