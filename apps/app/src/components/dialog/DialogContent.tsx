import { useContext } from 'react'

import {
  Dialog as DialogBase,
  DialogContent as DialogContentPrimitive,
  DialogHeader,
  DialogTitle,
} from '@nl/ui/base/dialog'

import { DialogContext } from '.'
import type { DialogProps } from '@/types/dialog'
import { CloseIconButton } from './DialogActions'

const DialogContentBase = ({
  children,
  sx,
  dialogTitle,
  dividers,
  onClose,
  ...props
}: DialogProps) => {
  const [isOpen, setIsOpen] = useContext(DialogContext)

  if (!isOpen) return null
  return (
    <DialogBase open={isOpen} onOpenChange={(open) => !open && setIsOpen(false)}>
      <DialogContentPrimitive {...props} showCloseButton={false} style={{ ...props.style, ...sx }}>
        {children}
      </DialogContentPrimitive>
    </DialogBase>
  )
}

const DialogContent = ({
  dialogTitle,
  children,
  dividers,
  ...props
}: DialogProps): React.ReactNode => (
  <DialogContentBase {...props}>
    <DialogHeader className={dividers ? 'border-b pb-4' : ''}>
      <DialogTitle>
        {dialogTitle}
        <CloseIconButton />
      </DialogTitle>
    </DialogHeader>
    {children}
  </DialogContentBase>
)

export { DialogContent, DialogContentBase }
