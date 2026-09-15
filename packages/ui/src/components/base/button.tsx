import { Button as ButtonPrimitive } from '@kobalte/core/button'
import { splitProps, type ComponentProps } from 'solid-js'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@nl/ui/utils'
import { buttonVariants } from './button-variants'

type ButtonProps = ComponentProps<typeof ButtonPrimitive> &
  VariantProps<typeof buttonVariants> & { className?: string }

function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, ['class', 'className', 'variant', 'size', 'type'])
  return (
    <ButtonPrimitive
      // A button outside a form ignores `type`, but inside one the implicit
      // `submit` turns every action button into a submitter. Callers that do
      // submit a form pass `type="submit"` explicitly. `asChild` renders the
      // caller's own element (an anchor, usually), which has no button type.
      {...(props.asChild ? {} : { type: local.type ?? 'button' })}
      data-slot="button"
      class={cn(
        buttonVariants({ variant: local.variant, size: local.size }),
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

export { Button }
export { buttonVariants } from './button-variants'
