'use client'

import { useEffect, useState } from 'react'

type SnackbarComponent = typeof import('@/components/extended/Snackbar').default
type ToasterComponent = typeof import('@nl/ui/base/sonner').Toaster

const loadSnackbar = () => import('@/components/extended/Snackbar')
const loadToaster = () => import('@nl/ui/base/sonner')

export default function DeferredNotifications(): React.ReactNode {
  const [Snackbar, setSnackbar] = useState<SnackbarComponent | null>(null)
  const [Toaster, setToaster] = useState<ToasterComponent | null>(null)

  useEffect(() => {
    let active = true

    void Promise.all([loadSnackbar(), loadToaster()])
      .then(([{ default: nextSnackbar }, { Toaster: nextToaster }]) => {
        if (!active) return
        setSnackbar(() => nextSnackbar)
        setToaster(() => nextToaster)
      })
      .catch(() => undefined)

    return () => {
      active = false
    }
  }, [])

  if (!Snackbar || !Toaster) return null

  return (
    <>
      <Snackbar />
      <Toaster position="top-right" closeButton richColors />
    </>
  )
}
