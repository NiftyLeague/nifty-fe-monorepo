import type { ComponentProps, JSX } from 'solid-js'

import type { DialogContent } from '@nl/ui/base/dialog'

export interface DialogProps extends Omit<ComponentProps<typeof DialogContent>, 'children'> {
  dialogTitle?: JSX.Element | string
  dividers?: boolean
  sx?: JSX.CSSProperties
  children?: JSX.Element
  onClose?: () => void
}

export interface DialogAction {
  children: JSX.Element
  isOpen?: boolean
}
