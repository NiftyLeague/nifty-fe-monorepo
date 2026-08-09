import { useEffect } from 'react'

import { toast } from 'sonner'
import type { ExternalToast } from 'sonner'

import { useDispatch, useSelector } from '@/store/hooks'
import { closeSnackbar } from '@/store/slices/snackbar'
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
  const dispatch = useDispatch()
  const snackbar = useSelector((state) => state.snackbar)
  const { actionButton, alert, anchorOrigin, close, message, open, transition, variant } = snackbar

  useEffect(() => {
    if (!open) return

    const type =
      variant === 'alert'
        ? alert.color === 'primary' || alert.color === 'secondary'
          ? 'info'
          : alert.color
        : 'default'
    const options: ExternalToast = {
      action:
        actionButton || variant !== 'alert'
          ? { label: 'UNDO', onClick: () => dispatch(closeSnackbar()) }
          : undefined,
      className: getSnackbarTransitionClass(transition),
      closeButton: close !== false,
      duration: 6000,
      position: getSnackbarPosition(anchorOrigin),
    }

    if (variant === 'alert' && alert.variant === 'outlined') {
      options.className = `${options.className} border border-current bg-background`
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

    dispatch(closeSnackbar())
  }, [
    actionButton,
    alert.color,
    alert.variant,
    anchorOrigin,
    close,
    dispatch,
    message,
    open,
    transition,
    variant,
  ])

  return null
}

export default Snackbar
