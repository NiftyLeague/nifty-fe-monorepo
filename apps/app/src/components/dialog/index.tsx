'use client';

import { useState, createContext, SetStateAction, Dispatch } from 'react';
import type { DialogProps } from '@/types/dialog';
import { DialogDismissButton, DialogTrigger, CloseIconButton } from './DialogActions';
import { DialogContent, DialogContentBase } from './DialogContent';

const defaultValue: [isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>] = [false, () => {}];

export const DialogContext = createContext(defaultValue);

const Dialog = (props: DialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSetIsOpen: Dispatch<SetStateAction<boolean>> = (value: SetStateAction<boolean>) => {
    if (!value) props.onClose?.();
    setIsOpen(value);
  };
  return <DialogContext.Provider value={[isOpen, handleSetIsOpen]} {...props} />;
};

export { CloseIconButton, DialogDismissButton, DialogTrigger, DialogContent, DialogContentBase, Dialog };
