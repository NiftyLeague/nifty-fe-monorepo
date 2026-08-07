export interface DialogProps {
  dialogTitle?: React.ReactNode | string
  dividers?: boolean
  sx?: React.CSSProperties
  children?: React.ReactNode
  onClose?: () => void
}

export interface DialogAction {
  children: React.ReactElement
  isOpen?: boolean
}
