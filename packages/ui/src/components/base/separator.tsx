import * as SeparatorPrimitive from '@kobalte/core/separator'
import { splitProps, type ComponentProps } from 'solid-js'

import { cn } from '@nl/ui/utils'

type SeparatorProps = ComponentProps<typeof SeparatorPrimitive.Root> & {
  className?: string
  /** Radix-era prop: decorative separators stay out of the accessibility tree. */
  decorative?: boolean
}

function Separator(props: SeparatorProps) {
  const [local, others] = splitProps(props, ['class', 'className', 'orientation', 'decorative'])
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      orientation={local.orientation ?? 'horizontal'}
      role={(local.decorative ?? true) ? 'none' : undefined}
      class={cn(
        'bg-separator shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

export { Separator }
