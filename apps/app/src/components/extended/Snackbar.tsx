import { useEffect } from 'react'

import { toast } from 'react-toastify'

import { useDispatch, useSelector } from '@/store/hooks'
import { closeSnackbar } from '@/store/slices/snackbar'

// ==============================|| SNACKBAR ||============================== //

const Snackbar = () => {
  const dispatch = useDispatch()
  const snackbar = useSelector((state) => state.snackbar)
  const { alert, close, message, open, variant } = snackbar

  useEffect(() => {
    if (!open) return

    const color = alert.color === 'primary' || alert.color === 'secondary' ? 'info' : alert.color
    toast(message, {
      type: variant === 'alert' ? color : 'default',
      autoClose: 6000,
      closeButton: close !== false,
    })

    dispatch(closeSnackbar())
  }, [alert.color, close, dispatch, message, open, variant])

  return null
}

export default Snackbar
