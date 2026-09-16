import { createEffect, untrack } from 'solid-js'

import { toast } from 'solid-sonner'
import type { ExternalToast } from 'solid-sonner'

import { useCloseSnackbar, useSnackbar } from '@/contexts/NotificationContext'
import type { SnackbarOrigin } from '@/types/snackbar'

// ==============================|| SNACKBAR ||============================== //

const snackbarPositions = {
  top: { left: 'top-left', center: 'top-center', right: 'top-right' },
  bottom: { left: 'bottom-left', center: 'bottom-center', right: 'bottom-right' },
} as const

const snackbarTransitions = {
  Fade: 'animate-in fade-in-0',
  Grow: 'animate-in zoom-in-95',
  SlideDown: 'animate-in slide-in-from-top',
  SlideLeft: 'animate-in slide-in-from-right',
  SlideRight: 'animate-in slide-in-from-left',
  SlideUp: 'animate-in slide-in-from-bottom',
} as const

export const getSnackbarPosition = ({ vertical, horizontal }: SnackbarOrigin) =>
  snackbarPositions[vertical][horizontal]

export const getSnackbarTransitionClass = (transition: string) =>
  snackbarTransitions[transition as keyof typeof snackbarTransitions] ?? snackbarTransitions.Fade

const Snackbar = () => {
  const snackbar = useSnackbar()
  const closeSnackbar = useCloseSnackbar()

  createEffect(() => {
    const { actionButton, alert, anchorOrigin, close, message, open, transition, variant } =
      snackbar()
    if (!open) return

    const type =
      variant === 'alert'
        ? alert.color === 'primary' || alert.color === 'secondary'
          ? 'info'
          : alert.color
        : 'default'
    const options: ExternalToast = {
      action:
        actionButton || variant !== 'alert' ? { label: 'UNDO', onClick: closeSnackbar } : undefined,
      class: getSnackbarTransitionClass(transition),
      closeButton: close !== false,
      duration: 6000,
      position: getSnackbarPosition(anchorOrigin),
    }

    if (variant === 'alert' && alert.variant === 'outlined') {
      options.class = `${options.class} border border-current bg-background`
    }
    switch (type) {
      case 'success':
      case 'error':
      case 'warning':
      case 'info':
        toast[type](message, options)
        break
      default:
        toast(message, options)
    }

    // Closing writes `open` back to the store this effect tracks; untrack it
    // so the write does not schedule a pointless second run.
    untrack(closeSnackbar)
  })

  return null
}

export default Snackbar
