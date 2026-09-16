import * as AlertDialogPrimitive from '@kobalte/core/alert-dialog'
import { splitProps, type ComponentProps } from 'solid-js'
import { type VariantProps } from 'class-variance-authority'
import { buttonVariants } from '@nl/ui/base/button'
import { cn, closeButtonAriaLabel } from '@nl/ui/utils'

function AlertDialog(props: ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger(props: ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
}

function AlertDialogPortal(props: ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
}

function AlertDialogOverlay(
  props: ComponentProps<typeof AlertDialogPrimitive.Overlay> & { className?: string }
) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      class={cn(
        'data-expanded:animate-in data-closed:animate-out data-closed:fade-out-0 data-expanded:fade-in-0 fixed inset-0 z-50 bg-black/50',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

function AlertDialogContent(
  props: ComponentProps<typeof AlertDialogPrimitive.Content> & { className?: string }
) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        class={cn(
          'bg-background data-expanded:animate-in data-closed:animate-out data-closed:fade-out-0 data-expanded:fade-in-0 data-closed:zoom-out-95 data-expanded:zoom-in-95 fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
          local.class,
          local.className
        )}
        {...others}
      />
    </AlertDialogPortal>
  )
}

type DivProps = import('solid-js').ComponentProps<'div'> & { className?: string }

function AlertDialogHeader(props: DivProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <div
      data-slot="alert-dialog-header"
      class={cn('flex flex-col gap-2 text-center sm:text-left', local.class, local.className)}
      {...others}
    />
  )
}

function AlertDialogFooter(props: DivProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <div
      data-slot="alert-dialog-footer"
      class={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

function AlertDialogTitle(
  props: ComponentProps<typeof AlertDialogPrimitive.Title> & { className?: string }
) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      class={cn('text-lg font-semibold', local.class, local.className)}
      {...others}
    />
  )
}

function AlertDialogDescription(
  props: ComponentProps<typeof AlertDialogPrimitive.Description> & { className?: string }
) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      class={cn('text-muted-foreground text-sm', local.class, local.className)}
      {...others}
    />
  )
}

// Kobalte has no separate Action/Cancel primitives — both close the dialog, so
// they wrap CloseButton with the corresponding button variants.
type CloseButtonProps = ComponentProps<typeof AlertDialogPrimitive.CloseButton> &
  VariantProps<typeof buttonVariants> & { className?: string }

function AlertDialogAction(props: CloseButtonProps) {
  const [local, others] = splitProps(props, ['class', 'className', 'variant'])
  return (
    <AlertDialogPrimitive.CloseButton
      class={cn(
        buttonVariants({ variant: local.variant ?? 'default' }),
        local.class,
        local.className
      )}
      {...others}
      aria-label={closeButtonAriaLabel(props)}
    />
  )
}

function AlertDialogCancel(props: CloseButtonProps) {
  const [local, others] = splitProps(props, ['class', 'className', 'variant'])
  return (
    <AlertDialogPrimitive.CloseButton
      class={cn(
        buttonVariants({ variant: local.variant ?? 'outline' }),
        local.class,
        local.className
      )}
      {...others}
      aria-label={closeButtonAriaLabel(props)}
    />
  )
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
