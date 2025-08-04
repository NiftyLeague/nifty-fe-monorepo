'use client';

import { type VariantProps } from 'class-variance-authority';
import { Button, buttonVariants } from '@nl/ui/base/button';
import {
  Dialog as DialogBase,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@nl/ui/base/dialog';
import React from 'react';

interface DialogProps {
  cancelText?: string;
  cancelVariant?: VariantProps<typeof buttonVariants>['variant'];
  confirmText?: string;
  confirmVariant?: VariantProps<typeof buttonVariants>['variant'];
  defaultOpen?: boolean;
  description: string | React.ReactNode;
  hideDescription?: boolean;
  hideTitle?: boolean;
  onCancel?: React.MouseEventHandler<HTMLButtonElement>;
  onConfirm?: React.MouseEventHandler<HTMLButtonElement>;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  showCloseButton?: boolean;
  title: string | React.ReactNode;
  triggerElement?: React.ReactNode;
}

export function Dialog({
  children: content,
  cancelText = 'Cancel',
  cancelVariant = 'outline',
  confirmText = 'Continue',
  confirmVariant = 'default',
  defaultOpen,
  description,
  hideDescription = false,
  hideTitle = false,
  onCancel,
  onConfirm,
  onOpenChange,
  open,
  showCloseButton = true,
  title,
  triggerElement,
}: React.PropsWithChildren<DialogProps>) {
  return (
    <DialogBase defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle
            className={hideTitle ? 'hidden' : 'bg-background grid grid-cols-[50px_1fr_50px] gap-4 items-center'}
          >
            <img src="/img/logos/NL/white.webp" alt="Company Logo" width={50} height={48} />
            {title}
          </DialogTitle>
          <DialogDescription className={hideDescription ? 'hidden' : ''}>{description}</DialogDescription>
        </DialogHeader>

        <div className="max-h-[75vh] overflow-y-auto overflow-x-hidden -m-6 p-6 mt-0 pt-0">
          <div className="grid grid-cols-1 gap-4 text-center sm:text-left">{content}</div>
        </div>

        {onConfirm && (
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={cancelVariant} onClick={onCancel} className="cursor-pointer">
                {cancelText}
              </Button>
            </DialogClose>
            <Button type="submit" variant={confirmVariant} onClick={onConfirm} className="cursor-pointer">
              {confirmText}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </DialogBase>
  );
}

export default Dialog;
