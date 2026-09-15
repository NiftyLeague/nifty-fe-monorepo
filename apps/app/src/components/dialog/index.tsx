'use client'

import { createSignal, createContext, SetStateAction, Dispatch } from 'solid-js'
import type { DialogProps } from '@/types/dialog'
import { DialogTrigger } from './DialogActions'
import { DialogContent } from './DialogContent'

const defaultValue: [isOpen: boolean, setIsOpen: (v: boolean | ((prev: boolean) => boolean)) => void] = [
  false,
  () => {},
]

export const DialogContext = createContext(defaultValue)

const Dialog = (props: DialogProps) => {
  const [isOpen, setIsOpen] = createSignal(false)
  const handleSetIsOpen = (value: boolean | ((prev: boolean) => boolean)): void => {
    if (!value) props.onClose?.()
    setIsOpen(value)
  }
  return <DialogContext.Provider value={[isOpen, handleSetIsOpen]} {...props} />
}

export { DialogTrigger, DialogContent, Dialog }
