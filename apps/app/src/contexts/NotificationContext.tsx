'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'

import type { AlertProps, SnackbarOrigin, SnackbarProps } from '@/types/snackbar'

export type SnackbarInput = {
  open?: boolean
  message?: string
  anchorOrigin?: SnackbarOrigin
  variant?: string
  alert?: AlertProps
  transition?: string
  close?: boolean
  actionButton?: boolean
}

type NotificationContextValue = {
  snackbar: SnackbarProps
  openSnackbar: (input: SnackbarInput) => void
  closeSnackbar: () => void
}

const initialSnackbar: SnackbarProps = {
  action: false,
  open: false,
  message: 'Note archived',
  anchorOrigin: { vertical: 'top', horizontal: 'right' },
  variant: 'default',
  alert: { color: 'primary', variant: 'filled' },
  transition: 'Fade',
  close: true,
  actionButton: false,
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export function NotificationProvider({ children }: PropsWithChildren) {
  const [snackbar, setSnackbar] = useState(initialSnackbar)

  const openSnackbar = useCallback((input: SnackbarInput) => {
    setSnackbar((current) => ({
      action: !current.action,
      open: input.open || initialSnackbar.open,
      message: input.message || initialSnackbar.message,
      anchorOrigin: input.anchorOrigin || initialSnackbar.anchorOrigin,
      variant: input.variant || initialSnackbar.variant,
      alert: {
        color: input.alert?.color || initialSnackbar.alert.color,
        variant: input.alert?.variant || initialSnackbar.alert.variant,
      },
      transition: input.transition || initialSnackbar.transition,
      close: input.close === false ? false : initialSnackbar.close,
      actionButton: input.actionButton || initialSnackbar.actionButton,
    }))
  }, [])

  const closeSnackbar = useCallback(() => {
    setSnackbar((current) => ({ ...current, open: false }))
  }, [])

  const value = useMemo(
    () => ({ snackbar, openSnackbar, closeSnackbar }),
    [snackbar, openSnackbar, closeSnackbar]
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotification() {
  const context = useContext(NotificationContext)

  if (!context) throw new Error('useNotification must be used inside NotificationProvider')

  return context
}
