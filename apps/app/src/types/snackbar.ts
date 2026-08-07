// ==============================|| SNACKBAR TYPES  ||============================== //

export type SnackbarOrigin = {
  vertical: 'top' | 'bottom'
  horizontal: 'left' | 'center' | 'right'
}

export type AlertColor = 'success' | 'info' | 'warning' | 'error' | 'primary' | 'secondary'

export interface AlertProps {
  color?: AlertColor
  variant?: 'standard' | 'filled' | 'outlined'
}

export interface SnackbarProps {
  action: boolean
  open: boolean
  message: string
  anchorOrigin: SnackbarOrigin
  variant: string
  alert: AlertProps
  transition: string
  close: boolean
  actionButton: boolean
}
