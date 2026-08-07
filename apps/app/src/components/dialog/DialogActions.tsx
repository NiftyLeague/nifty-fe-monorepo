import { useContext, cloneElement } from 'react'
import { IconButton } from '@mui/material'
import { Icon } from '@nl/ui/base/icon'
import { DialogContext } from '.'
import type { DialogAction } from '@/types/dialog'
import callAll from '@/utils/callAll'

import styles from './DialogActions.module.css'

const DialogActionComp = ({ children, isOpen }: DialogAction) => {
  const [, setIsOpen] = useContext(DialogContext)
  if (!children || typeof children !== 'object' || !('props' in children)) {
    throw new Error('DialogActionComp expects a valid ReactElement as children')
  }
  const childElement = children as React.ReactElement<any, any>
  return cloneElement(childElement, {
    onClick: callAll(() => setIsOpen(isOpen || false), childElement.props.onClick),
  })
}

const DialogTrigger = ({ children }: DialogAction) => DialogActionComp({ children, isOpen: true })

const DialogDismissButton = ({ children }: DialogAction) =>
  DialogActionComp({ children, isOpen: false })

const CloseIconButton = () => {
  return (
    <DialogDismissButton>
      <IconButton aria-label="close" className={styles.closeIconButton}>
        <Icon name="x" size="lg" />
      </IconButton>
    </DialogDismissButton>
  )
}
export { DialogTrigger, DialogDismissButton, CloseIconButton }
