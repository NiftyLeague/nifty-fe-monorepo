import type { ComponentProps } from 'react'

import type { DialogContent } from '@nl/ui/base/dialog'

export interface DialogProps extends Omit<ComponentProps<typeof DialogContent>, 'children'> {
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
