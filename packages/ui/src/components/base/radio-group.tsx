import * as RadioGroupPrimitive from '@kobalte/core/radio-group'
import { splitProps, type ComponentProps } from 'solid-js'
import { CircleIcon } from 'lucide-solid'

import { cn } from '@nl/ui/utils'

type RadioGroupProps = ComponentProps<typeof RadioGroupPrimitive.Root> & {
  className?: string
  /** Radix-era alias for Kobalte's `onChange`. */
  onValueChange?: (value: string) => void
}

function RadioGroup(props: RadioGroupProps) {
  const [local, others] = splitProps(props, ['class', 'className', 'onValueChange'])
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      onChange={local.onValueChange}
      class={cn('grid gap-3', local.class, local.className)}
      {...others}
    />
  )
}

function RadioGroupItem(
  props: ComponentProps<typeof RadioGroupPrimitive.Item> & { className?: string }
) {
  const [local, others] = splitProps(props, [
    'class',
    'className',
    'id',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
  ])
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      class="flex items-center gap-3"
      {...others}
    >
      {/* The id/name/description belong on the input, which carries the radio role. */}
      <RadioGroupPrimitive.ItemInput
        id={local.id}
        aria-label={local['aria-label']}
        aria-labelledby={local['aria-labelledby']}
        aria-describedby={local['aria-describedby']}
      />
      <RadioGroupPrimitive.ItemControl
        class={cn(
          'border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] data-disabled:cursor-not-allowed data-disabled:opacity-50',
          local.class,
          local.className
        )}
      >
        <RadioGroupPrimitive.ItemIndicator
          data-slot="radio-group-indicator"
          class="relative flex items-center justify-center"
        >
          <CircleIcon class="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
        </RadioGroupPrimitive.ItemIndicator>
      </RadioGroupPrimitive.ItemControl>
      {props.children}
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
