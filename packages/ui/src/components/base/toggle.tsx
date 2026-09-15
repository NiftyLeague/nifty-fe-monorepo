import { ToggleButton as TogglePrimitive } from '@kobalte/core/toggle-button'
import { splitProps, type ComponentProps } from 'solid-js'
import { type VariantProps } from 'class-variance-authority'

import { cn } from '@nl/ui/utils'
import { toggleVariants } from '@nl/ui/base/toggle-variants'

type ToggleProps = ComponentProps<typeof TogglePrimitive> &
  VariantProps<typeof toggleVariants> & {
    className?: string
    /** Radix-era alias for Kobalte's `onChange`. */
    onPressedChange?: (pressed: boolean) => void
  }

function Toggle(props: ToggleProps) {
  const [local, others] = splitProps(props, [
    'class',
    'className',
    'variant',
    'size',
    'onPressedChange',
  ])
  return (
    <TogglePrimitive
      data-slot="toggle"
      onChange={local.onPressedChange}
      class={cn(
        toggleVariants({ variant: local.variant, size: local.size }),
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

export { Toggle, toggleVariants }
