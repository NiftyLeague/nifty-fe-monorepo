import * as TabsPrimitive from '@kobalte/core/tabs'
import { splitProps, type ComponentProps } from 'solid-js'

import { cn } from '@nl/ui/utils'

type TabsProps = ComponentProps<typeof TabsPrimitive.Root> & {
  className?: string
  /** Radix-era alias for Kobalte's `onChange`. */
  onValueChange?: (value: string) => void
}

function Tabs(props: TabsProps) {
  const [local, others] = splitProps(props, ['class', 'className', 'onValueChange'])
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      onChange={local.onValueChange}
      class={cn('flex flex-col gap-2', local.class, local.className)}
      {...others}
    />
  )
}

function TabsList(props: ComponentProps<typeof TabsPrimitive.List> & { className?: string }) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      class={cn(
        'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-0.75',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

function TabsTrigger(props: ComponentProps<typeof TabsPrimitive.Trigger> & { className?: string }) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      class={cn(
        "data-selected:bg-background dark:data-selected:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-selected:border-input dark:data-selected:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-3 focus-visible:outline-1 data-disabled:pointer-events-none data-disabled:opacity-50 data-selected:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

function TabsContent(props: ComponentProps<typeof TabsPrimitive.Content> & { className?: string }) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      class={cn('flex-1 outline-none', local.class, local.className)}
      {...others}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
