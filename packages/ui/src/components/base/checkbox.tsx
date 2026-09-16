import * as CheckboxPrimitive from '@kobalte/core/checkbox'
import { splitProps, type ComponentProps } from 'solid-js'
import { CheckIcon } from 'lucide-solid'

import { cn } from '@nl/ui/utils'

type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root> & {
  className?: string
  /** Radix-era alias for Kobalte's `onChange`. */
  onCheckedChange?: (checked: boolean) => void
}

function Checkbox(props: CheckboxProps) {
  const [local, others] = splitProps(props, [
    'class',
    'className',
    'onCheckedChange',
    'id',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
  ])
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      onChange={local.onCheckedChange}
      class="contents"
      {...others}
    >
      {/* The id/name/description belong on the input, which carries the checkbox
      role and is the element `<label for>` associates with. */}
      <CheckboxPrimitive.Input
        id={local.id}
        aria-label={local['aria-label']}
        aria-labelledby={local['aria-labelledby']}
        aria-describedby={local['aria-describedby']}
      />
      <CheckboxPrimitive.Control
        class={cn(
          'peer border-input dark:bg-input/30 data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary data-checked:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-3 data-disabled:cursor-not-allowed data-disabled:opacity-50',
          local.class,
          local.className
        )}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          class="flex items-center justify-center text-current transition-none"
        >
          <CheckIcon class="size-3.5" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Control>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
