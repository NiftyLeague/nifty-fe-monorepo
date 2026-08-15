'use client'

import { useState, createContext, SetStateAction, Dispatch } from 'react'
import type { DialogProps } from '@/types/dialog'
import { DialogTrigger } from './DialogActions'
import { DialogContent } from './DialogContent'

const defaultValue: [isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>] = [
  false,
  () => {},
]

export const DialogContext = createContext(defaultValue)

const Dialog = (props: DialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleSetIsOpen: Dispatch<SetStateAction<boolean>> = (value: SetStateAction<boolean>) => {
    if (!value) props.onClose?.()
    setIsOpen(value)
  }
  return <DialogContext.Provider value={[isOpen, handleSetIsOpen]} {...props} />
}

export { DialogTrigger, DialogContent, Dialog }
