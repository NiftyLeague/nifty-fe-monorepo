import * as AccordionPrimitive from '@kobalte/core/accordion'
import { splitProps, type ComponentProps } from 'solid-js'
import { ChevronDownIcon } from 'lucide-solid'

import { cn } from '@nl/ui/utils'

type AccordionProps = Omit<
  ComponentProps<typeof AccordionPrimitive.Root>,
  'defaultValue' | 'multiple' | 'onChange' | 'value'
> & {
  className?: string
  /** Radix-era alias: `single` maps to Kobalte's `multiple={false}`. */
  type?: 'single' | 'multiple'
  value?: string | string[]
  defaultValue?: string | string[]
  /** Radix-era alias for Kobalte's `onChange`. */
  onValueChange?: (value: string[]) => void
}

const toArray = (value?: string | string[]) =>
  value === undefined ? undefined : Array.isArray(value) ? value : [value]

function Accordion(props: AccordionProps) {
  const [local, others] = splitProps(props, ['type', 'value', 'defaultValue', 'onValueChange'])
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      multiple={local.type === 'multiple'}
      value={toArray(local.value)}
      defaultValue={toArray(local.defaultValue)}
      onChange={local.onValueChange}
      {...others}
    />
  )
}

function AccordionItem(
  props: ComponentProps<typeof AccordionPrimitive.Item> & { className?: string }
) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      class={cn('border-b last:border-b-0', local.class, local.className)}
      {...others}
    />
  )
}

function AccordionTrigger(
  props: ComponentProps<typeof AccordionPrimitive.Trigger> & { className?: string }
) {
  const [local, others] = splitProps(props, ['class', 'className', 'children'])
  return (
    <AccordionPrimitive.Header class="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        class={cn(
          'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] data-disabled:pointer-events-none data-disabled:opacity-50 [&[data-expanded]>svg]:rotate-180',
          local.class,
          local.className
        )}
        {...others}
      >
        {local.children}
        <ChevronDownIcon class="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent(
  props: ComponentProps<typeof AccordionPrimitive.Content> & { className?: string }
) {
  const [local, others] = splitProps(props, ['class', 'className', 'children'])
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      class="data-closed:animate-accordion-up data-expanded:animate-accordion-down overflow-hidden text-sm"
      {...others}
    >
      <div class={cn('pt-0 pb-4', local.class, local.className)}>{local.children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
