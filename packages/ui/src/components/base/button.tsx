import * as React from 'react'
import * as SlotPrimitive from 'radix-ui/slot'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@nl/ui/utils'
import { buttonVariants } from './button-variants'

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? SlotPrimitive.Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button }
export { buttonVariants } from './button-variants'
