import * as ToggleGroupPrimitive from '@kobalte/core/toggle-group'
import { createContext, splitProps, useContext, type ComponentProps } from 'solid-js'
import { type VariantProps } from 'class-variance-authority'

import { cx } from '@nl/ui/class-names'
import { toggleVariants } from '@nl/ui/base/toggle-variants'

const ToggleGroupContext = createContext<VariantProps<typeof toggleVariants>>({
  size: 'default',
  variant: 'default',
})

type ToggleGroupProps = ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    className?: string
    /** Radix-era API: `'single' | 'multiple'` maps to Kobalte's `multiple`. */
    type?: 'single' | 'multiple'
    /** Radix-era alias for Kobalte's `onChange`. */
    onValueChange?: (value: string | string[] | null) => void
  }

function ToggleGroup(props: ToggleGroupProps) {
  const [local, others] = splitProps(props, [
    'class',
    'className',
    'variant',
    'size',
    'type',
    'onValueChange',
    'children',
  ])
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={local.variant}
      data-size={local.size}
      multiple={local.type === 'multiple'}
      onChange={local.onValueChange as (value: string[] | string | null) => void}
      class={cx(
        'group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs',
        local.class,
        local.className
      )}
      {...(others as Record<string, unknown>)}
    >
      <ToggleGroupContext.Provider value={{ variant: local.variant, size: local.size }}>
        {local.children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

function ToggleGroupItem(
  props: ComponentProps<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants> & { className?: string }
) {
  const [local, others] = splitProps(props, ['class', 'className', 'variant', 'size', 'children'])
  const context = useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || local.variant}
      data-size={context.size || local.size}
      class={cx(
        toggleVariants({
          variant: context.variant || local.variant,
          size: context.size || local.size,
        }),
        'min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l',
        local.class,
        local.className
      )}
      {...others}
    >
      {local.children}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem }
