import { useEffect } from 'react'

import { toast } from 'sonner'

import { useDispatch, useSelector } from '@/store/hooks'
import { closeSnackbar } from '@/store/slices/snackbar'

// ==============================|| SNACKBAR ||============================== //

const Snackbar = () => {
  const dispatch = useDispatch()
  const snackbar = useSelector((state) => state.snackbar)
  const { alert, close, message, open, variant } = snackbar

  useEffect(() => {
    if (!open) return

    const type =
      variant === 'alert'
        ? alert.color === 'primary' || alert.color === 'secondary'
          ? 'info'
          : alert.color
        : 'default'
    const options = { duration: 6000, closeButton: close !== false }
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
  }, [alert.color, close, dispatch, message, open, variant])

  return null
}

export default Snackbar
