import * as DialogPrimitive from '@kobalte/core/dialog'
import { createEffect, onCleanup, splitProps, type ComponentProps } from 'solid-js'
import { XIcon } from 'lucide-solid'

import { cn, closeButtonAriaLabel } from '@nl/ui/utils'

const openDialogLocks = new Set<symbol>()
let previousHtmlOverflow = ''

function lockDialogScroll(lockId: symbol) {
  if (openDialogLocks.has(lockId)) return

  if (openDialogLocks.size === 0) {
    const htmlElement = document.documentElement
    previousHtmlOverflow = htmlElement.style.overflow
    htmlElement.style.overflow = 'hidden'
  }

  openDialogLocks.add(lockId)
}

function unlockDialogScroll(lockId: symbol) {
  if (!openDialogLocks.delete(lockId) || openDialogLocks.size > 0) return

  document.documentElement.style.overflow = previousHtmlOverflow
  previousHtmlOverflow = ''
}

type DialogProps = ComponentProps<typeof DialogPrimitive.Root>

function Dialog(props: DialogProps) {
  const [local, others] = splitProps(props, ['open', 'defaultOpen', 'onOpenChange'])
  const lockId = Symbol()

  const syncLock = (open: boolean) => (open ? lockDialogScroll(lockId) : unlockDialogScroll(lockId))

  createEffect(() => {
    if (local.open !== undefined) syncLock(local.open)
    else if (local.defaultOpen) lockDialogScroll(lockId)
  })
  onCleanup(() => unlockDialogScroll(lockId))

  const handleOpenState = (open: boolean) => {
    syncLock(open)
    local.onOpenChange?.(open)
  }

  return (
    <DialogPrimitive.Root
      data-slot="dialog"
      open={local.open}
      defaultOpen={local.defaultOpen}
      onOpenChange={handleOpenState}
      {...others}
    />
  )
}

function DialogTrigger(props: ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal(props: ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose(props: ComponentProps<typeof DialogPrimitive.CloseButton>) {
  return (
    <DialogPrimitive.CloseButton
      data-slot="dialog-close"
      {...props}
      aria-label={closeButtonAriaLabel(props)}
    />
  )
}

function DialogOverlay(
  props: ComponentProps<typeof DialogPrimitive.Overlay> & { className?: string }
) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      class={cn(
        'data-expanded:animate-in data-closed:animate-out data-closed:fade-out-0 data-expanded:fade-in-0 fixed inset-0 z-[1200] bg-black/50',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

function DialogContent(
  props: ComponentProps<typeof DialogPrimitive.Content> & {
    className?: string
    showCloseButton?: boolean
  }
) {
  const [local, others] = splitProps(props, ['class', 'className', 'children', 'showCloseButton'])
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        class={cn(
          'bg-background data-expanded:animate-in data-closed:animate-out data-closed:fade-out-0 data-expanded:fade-in-0 data-closed:zoom-out-95 data-expanded:zoom-in-95 fixed top-1/2 left-1/2 z-[1201] grid max-h-[calc(100vh-2rem)] min-w-0 w-full max-w-full -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-lg border p-6 shadow-lg duration-200 sm:max-w-[calc(100%-2rem)] md:max-w-xl lg:max-w-2xl',
          local.class,
          local.className
        )}
        {...others}
      >
        {local.children}
        {local.showCloseButton !== false && (
          <DialogPrimitive.CloseButton
            data-slot="dialog-close"
            aria-label="Close"
            class="ring-offset-background focus:ring-ring data-expanded:bg-accent data-expanded:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer"
          >
            <XIcon strokeWidth={6} class="size-4" />
            <span class="sr-only">Close</span>
          </DialogPrimitive.CloseButton>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

type DivProps = import('solid-js').ComponentProps<'div'> & { className?: string }

function DialogHeader(props: DivProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <div
      data-slot="dialog-header"
      class={cn('flex flex-col gap-2 text-center sm:text-left', local.class, local.className)}
      {...others}
    />
  )
}

function DialogFooter(props: DivProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <div
      data-slot="dialog-footer"
      class={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

function DialogTitle(props: ComponentProps<typeof DialogPrimitive.Title> & { className?: string }) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      class={cn('text-3xl leading-none font-semibold', local.class, local.className)}
      {...others}
    />
  )
}

function DialogDescription(
  props: ComponentProps<typeof DialogPrimitive.Description> & { className?: string }
) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      class={cn('text-muted-foreground text-sm', local.class, local.className)}
      {...others}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
