import { useContext } from 'solid-js'
import { X } from 'lucide-solid'

import { Button } from '@nl/ui/base/button'

import { DialogContext } from '.'
import type { DialogAction } from '@/types/dialog'

import styles from './DialogActions.module.css'

const DialogActionComp = (props: DialogAction) => {
  const [, setIsOpen] = useContext(DialogContext)
  // Clicks bubble up from the wrapped trigger; the child's own onClick still
  // runs first, matching the old cloneElement + callAll behavior.
  return (
    <span class="contents" onClick={() => setIsOpen(props.isOpen ?? false)}>
      {props.children}
    </span>
  )
}

const DialogTrigger = (props: DialogAction) => <DialogActionComp {...props} isOpen={true} />

const DialogDismissButton = (props: DialogAction) => <DialogActionComp {...props} isOpen={false} />

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
        <X aria-hidden="true" size={24} stroke-width={1.5} />
      </Button>
    </DialogDismissButton>
  )
}
export { DialogTrigger, CloseIconButton }
