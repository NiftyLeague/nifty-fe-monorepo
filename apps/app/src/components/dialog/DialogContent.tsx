import { Show, splitProps, useContext, type JSX } from 'solid-js'

import {
  Dialog as DialogBase,
  DialogContent as DialogContentPrimitive,
  DialogHeader,
  DialogTitle,
} from '@nl/ui/base/dialog'

import { DialogContext } from '.'
import type { DialogProps } from '@/types/dialog'
import { CloseIconButton } from './DialogActions'

// `sx` is the MUI-era prop; Solid style objects need kebab-case keys, so
// camelCase entries are translated before merging with `style`.
const sxToStyle = (sx: DialogProps['sx']): JSX.CSSProperties =>
  Object.fromEntries(
    Object.entries(sx ?? {}).map(([key, value]) => [
      key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`),
      value,
    ])
  ) as JSX.CSSProperties

const DialogContentBase = (props: DialogProps) => {
  const [local, others] = splitProps(props, [
    'children',
    'sx',
    'dialogTitle',
    'dividers',
    'onClose',
  ])
  const [isOpen, setIsOpen] = useContext(DialogContext)

  return (
    <Show when={isOpen()}>
      <DialogBase open={isOpen()} onOpenChange={(open) => !open && setIsOpen(false)}>
        <DialogContentPrimitive
          {...others}
          showCloseButton={false}
          style={{ ...others.style, ...sxToStyle(local.sx) }}
        >
          {local.children}
        </DialogContentPrimitive>
      </DialogBase>
    </Show>
  )
}

const DialogContent = (props: DialogProps): JSX.Element => {
  const [local, others] = splitProps(props, ['dialogTitle', 'children', 'dividers'])
  return (
    <DialogContentBase {...others}>
      <DialogHeader class={local.dividers ? 'border-b pb-4' : ''}>
        <DialogTitle>
          {local.dialogTitle}
          <CloseIconButton />
        </DialogTitle>
      </DialogHeader>
      {local.children}
    </DialogContentBase>
  )
}

export { DialogContent }
