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
  type,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? SlotPrimitive.Slot : 'button'

  return (
    <Comp
      // A button outside a form ignores `type`, but inside one the implicit
      // `submit` turns every action button into a submitter. Callers that do
      // submit a form pass `type="submit"` explicitly. `asChild` renders the
      // caller's own element (an anchor, usually), which has no button type.
      {...(asChild ? {} : { type: type ?? 'button' })}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button }
export { buttonVariants } from './button-variants'
