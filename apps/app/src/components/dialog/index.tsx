'use client'

import { createSignal, createContext, type Accessor } from 'solid-js'
import type { DialogProps } from '@/types/dialog'
import { DialogTrigger } from './DialogActions'
import { DialogContent } from './DialogContent'

const defaultValue: [
  isOpen: Accessor<boolean>,
  setIsOpen: (v: boolean | ((prev: boolean) => boolean)) => void,
] = [() => false, () => {}]

export const DialogContext = createContext(defaultValue)

const Dialog = (props: DialogProps) => {
  const [isOpen, setIsOpen] = createSignal(false)
  const handleSetIsOpen = (value: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof value === 'function' ? value(isOpen()) : value
    if (!next) props.onClose?.()
    setIsOpen(next)
  }
  return (
    <DialogContext.Provider value={[isOpen, handleSetIsOpen]}>
      {props.children}
    </DialogContext.Provider>
  )
}

export { DialogTrigger, DialogContent, Dialog }
