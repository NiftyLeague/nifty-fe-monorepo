import { useContext } from 'solid-js'
import { X } from 'lucide-react'

import { Button } from '@nl/ui/base/button'

import { DialogContext } from '.'
import type { DialogAction } from '@/types/dialog'
import callAll from '@/utils/callAll'

import styles from './DialogActions.module.css'

const DialogActionComp = ({ children, isOpen }: DialogAction) => {
  const [, setIsOpen] = useContext(DialogContext)
  if (!children || typeof children !== 'object' || !('props' in children)) {
    throw new Error('DialogActionComp expects a valid ReactElement as children')
  }
  const childElement = children as JSX.Element<any, any>
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
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="close"
        class={styles.closeIconButton}
      >
        <X aria-hidden="true" absoluteStrokeWidth size={24} stroke-width={1.5} />
      </Button>
    </DialogDismissButton>
  )
}
export { DialogTrigger, CloseIconButton }
