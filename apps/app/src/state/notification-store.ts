import { createStore } from 'zustand/vanilla'

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

export const initialSnackbar: SnackbarProps = {
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

export type NotificationState = {
  snackbar: SnackbarProps
  openSnackbar: (input: SnackbarInput) => void
  closeSnackbar: () => void
  reset: () => void
}

export type NotificationStore = ReturnType<typeof createNotificationStore>

export const createNotificationStore = () =>
  createStore<NotificationState>()((set) => ({
    snackbar: initialSnackbar,
    openSnackbar: (input) =>
      set((state) => ({
        snackbar: {
          action: !state.snackbar.action,
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
        },
      })),
    closeSnackbar: () => set((state) => ({ snackbar: { ...state.snackbar, open: false } })),
    reset: () => set({ snackbar: initialSnackbar }),
  }))
