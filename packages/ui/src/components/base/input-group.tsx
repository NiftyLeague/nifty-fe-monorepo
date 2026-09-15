import { splitProps, type ComponentProps } from 'solid-js'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@nl/ui/utils'

import { Button } from './button'
import { Input } from './input'

type DivProps = ComponentProps<'div'> & { className?: string }
type SpanProps = ComponentProps<'span'> & { className?: string }

function InputGroup(props: DivProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <div
      data-slot="input-group"
      role="group"
      class={cn(
        'group/input-group relative flex w-full items-center rounded-md border border-input shadow-xs transition-[color,box-shadow] outline-none dark:bg-input/30',
        'h-9 min-w-0',
        'has-[>[data-align=inline-start]]:[&>input]:pl-2',
        'has-[>[data-align=inline-end]]:[&>input]:pr-2',
        'has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50',
        'has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-destructive/20 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        'inline-start': 'order-first pl-3',
        'inline-end': 'order-last pr-3',
      },
    },
    defaultVariants: { align: 'inline-start' },
  }
)

function InputGroupAddon(props: DivProps & VariantProps<typeof inputGroupAddonVariants>) {
  const [local, others] = splitProps(props, ['class', 'className', 'align'])
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={local.align ?? 'inline-start'}
      class={cn(inputGroupAddonVariants({ align: local.align }), local.class, local.className)}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest('button')) return
        event.currentTarget.parentElement?.querySelector('input')?.focus()
      }}
      {...others}
    />
  )
}

const inputGroupButtonVariants = cva('flex items-center gap-2 text-sm shadow-none', {
  variants: {
    size: {
      xs: 'h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 has-[>svg]:px-2 [&>svg:not([class*="size-"])]:size-3.5',
      sm: 'h-8 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2.5',
    },
  },
  defaultVariants: { size: 'xs' },
})

type ButtonProps = Parameters<typeof Button>[0]

function InputGroupButton(
  props: Omit<ButtonProps, 'size'> & VariantProps<typeof inputGroupButtonVariants>
) {
  const [local, others] = splitProps(props, ['class', 'className', 'type', 'variant', 'size'])
  return (
    <Button
      type={local.type ?? 'button'}
      data-size={local.size ?? 'xs'}
      variant={local.variant ?? 'ghost'}
      class={cn(inputGroupButtonVariants({ size: local.size }), local.class, local.className)}
      {...others}
    />
  )
}

type InputGroupPasswordToggleProps = {
  visible: boolean
  onVisibleChange: (visible: boolean) => void
  disabled?: boolean
}

function InputGroupPasswordToggle(props: InputGroupPasswordToggleProps) {
  return (
    <InputGroupButton
      size="sm"
      disabled={props.disabled}
      onClick={() => props.onVisibleChange(!props.visible)}
      aria-label={props.visible ? 'Hide' : 'Reveal'}
    >
      {props.visible ? 'Hide' : 'Reveal'}
    </InputGroupButton>
  )
}

function InputGroupText(props: SpanProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <span
      class={cn(
        "flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

function InputGroupInput(props: ComponentProps<'input'> & { className?: string }) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <Input
      data-slot="input-group-control"
      class={cn(
        'flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupPasswordToggle,
  InputGroupText,
  InputGroupInput,
}
