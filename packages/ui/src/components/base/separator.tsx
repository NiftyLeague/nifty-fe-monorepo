import * as SeparatorPrimitive from '@kobalte/core/separator'
import { splitProps, type ComponentProps } from 'solid-js'

import { cn } from '@nl/ui/utils'

type SeparatorProps = ComponentProps<typeof SeparatorPrimitive.Root> & {
  className?: string
  /** Radix-era prop: decorative separators stay out of the accessibility tree. */
  decorative?: boolean
}

const separatorClass = (className: string | undefined, classProp: string | undefined) =>
  cn(
    'bg-separator shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
    className,
    classProp
  )

function Separator(props: SeparatorProps) {
  const [local, others] = splitProps(props, ['class', 'className', 'orientation', 'decorative'])
  const orientation = () => local.orientation ?? 'horizontal'
  const decorative = () => local.decorative ?? true
  return (
    // Decorative separators carry no semantics, so they render a plain <hr>:
    // the Kobalte primitive always emits aria-orientation for vertical
    // orientation, which role="none" is not allowed to have (axe
    // aria-allowed-attr), and SSR spreads cannot remove it.
    decorative() ? (
      <hr
        data-slot="separator"
        data-orientation={orientation()}
        role="none"
        class={separatorClass(local.className, local.class)}
        {...others}
      />
    ) : (
      <SeparatorPrimitive.Root
        data-slot="separator"
        orientation={orientation()}
        class={separatorClass(local.className, local.class)}
        {...others}
      />
    )
  )
}

export { Separator }
