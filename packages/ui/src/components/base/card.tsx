import { splitProps, type ComponentProps } from 'solid-js'

import { cn } from '@nl/ui/utils'

type DivProps = ComponentProps<'div'> & { className?: string }

function Card(props: DivProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <div
      data-slot="card"
      class={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

function CardHeader(props: DivProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <div
      data-slot="card-header"
      class={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

function CardTitle(props: DivProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <div
      data-slot="card-title"
      class={cn('leading-none font-semibold', local.class, local.className)}
      {...others}
    />
  )
}

function CardDescription(props: DivProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <div
      data-slot="card-description"
      class={cn('text-muted-foreground text-sm', local.class, local.className)}
      {...others}
    />
  )
}

function CardAction(props: DivProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <div
      data-slot="card-action"
      class={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

function CardContent(props: DivProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <div data-slot="card-content" class={cn('px-6', local.class, local.className)} {...others} />
  )
}

function CardFooter(props: DivProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <div
      data-slot="card-footer"
      class={cn('flex items-center px-6 [.border-t]:pt-6', local.class, local.className)}
      {...others}
    />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }
