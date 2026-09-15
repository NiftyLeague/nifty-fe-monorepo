import { splitProps, type ComponentProps } from 'solid-js'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@nl/ui/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        destructive:
          'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

type AlertProps = ComponentProps<'div'> &
  VariantProps<typeof alertVariants> & { className?: string }

function Alert(props: AlertProps) {
  const [local, others] = splitProps(props, ['class', 'className', 'variant'])
  return (
    <div
      data-slot="alert"
      role="alert"
      class={cn(alertVariants({ variant: local.variant }), local.class, local.className)}
      {...others}
    />
  )
}

type DivProps = ComponentProps<'div'> & { className?: string }

function AlertTitle(props: DivProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <div
      data-slot="alert-title"
      class={cn(
        'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

function AlertDescription(props: DivProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <div
      data-slot="alert-description"
      class={cn(
        'text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
