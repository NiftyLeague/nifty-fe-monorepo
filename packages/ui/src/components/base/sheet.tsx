import * as SheetPrimitive from '@kobalte/core/dialog'
import { splitProps, type ComponentProps, type JSX } from 'solid-js'

import { cn, closeButtonAriaLabel } from '@nl/ui/utils'

type SheetProps = ComponentProps<typeof SheetPrimitive.Root>

function Sheet(props: SheetProps) {
  const [local, others] = splitProps(props, ['onOpenChange'])
  const handleOpenState = (open: boolean) => {
    const htmlElement = document.querySelector('html') as HTMLElement
    htmlElement.style.overflow = open ? 'hidden' : ''
    document.body.style.paddingRight = open ? 'var(--scrollbar-width, 0)' : ''
    local.onOpenChange?.(open)
  }

  return <SheetPrimitive.Root data-slot="sheet" onOpenChange={handleOpenState} {...others} />
}

function SheetTrigger(props: ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose(props: ComponentProps<typeof SheetPrimitive.CloseButton>) {
  return (
    <SheetPrimitive.CloseButton
      data-slot="sheet-close"
      {...props}
      aria-label={closeButtonAriaLabel(props)}
    />
  )
}

function SheetPortal(props: ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay(
  props: ComponentProps<typeof SheetPrimitive.Overlay> & { className?: string }
) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      class={cn(
        'data-expanded:animate-in data-closed:animate-out data-closed:fade-out-0 data-expanded:fade-in-0 fixed inset-0 z-50 bg-black/50',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

type SheetContentProps = ComponentProps<typeof SheetPrimitive.Content> & {
  className?: string
  closeClassName?: string
  closeLabel?: string
  overlayClassName?: string
  overlayStyle?: JSX.CSSProperties | string
  side?: 'top' | 'right' | 'bottom' | 'left'
}

function SheetContent(props: SheetContentProps) {
  const [local, others] = splitProps(props, [
    'class',
    'className',
    'children',
    'side',
    'closeClassName',
    'closeLabel',
    'overlayClassName',
    'overlayStyle',
  ])
  const side = () => local.side ?? 'right'
  return (
    <SheetPortal>
      <SheetOverlay class={local.overlayClassName} style={local.overlayStyle} />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        class={cn(
          'bg-background data-expanded:animate-in data-closed:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-closed:duration-300 data-expanded:duration-500',
          side() === 'right' &&
            'data-closed:slide-out-to-right data-expanded:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
          side() === 'left' &&
            'data-closed:slide-out-to-left data-expanded:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
          side() === 'top' &&
            'data-closed:slide-out-to-top data-expanded:slide-in-from-top inset-x-0 top-0 h-auto border-b',
          side() === 'bottom' &&
            'data-closed:slide-out-to-bottom data-expanded:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
          local.class,
          local.className
        )}
        {...others}
      >
        {local.children}
        <SheetPrimitive.CloseButton
          aria-label={local.closeLabel ?? 'Close'}
          class={cn(
            'ring-offset-background focus:ring-ring data-expanded:bg-secondary absolute top-4 right-4 cursor-pointer rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none',
            local.closeClassName
          )}
        >
          <span aria-hidden="true" class="relative block size-4">
            <span class="bg-current absolute top-1/2 left-0 block h-0.5 w-4 rotate-45" />
            <span class="bg-current absolute top-1/2 left-0 block h-0.5 w-4 -rotate-45" />
          </span>
          <span class="sr-only">{local.closeLabel ?? 'Close'}</span>
        </SheetPrimitive.CloseButton>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

type DivProps = import('solid-js').ComponentProps<'div'> & { className?: string }

function SheetHeader(props: DivProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <div
      data-slot="sheet-header"
      class={cn('flex flex-col gap-1.5 p-4', local.class, local.className)}
      {...others}
    />
  )
}

function SheetFooter(props: DivProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <div
      data-slot="sheet-footer"
      class={cn('mt-auto flex flex-col gap-2 p-4', local.class, local.className)}
      {...others}
    />
  )
}

function SheetTitle(props: ComponentProps<typeof SheetPrimitive.Title> & { className?: string }) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      class={cn('text-foreground font-semibold', local.class, local.className)}
      {...others}
    />
  )
}

function SheetDescription(
  props: ComponentProps<typeof SheetPrimitive.Description> & { className?: string }
) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      class={cn('text-muted-foreground text-sm', local.class, local.className)}
      {...others}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
