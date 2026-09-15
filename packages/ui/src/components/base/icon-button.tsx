import { splitProps, type ComponentProps } from 'solid-js'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@nl/ui/utils'

import { buttonVariants } from './button-variants'

type IconButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & { className?: string }

function IconButton(props: IconButtonProps) {
  const [local, others] = splitProps(props, ['class', 'className', 'variant', 'size', 'type'])
  return (
    <button
      type={local.type ?? 'button'}
      data-slot="icon-button"
      class={cn(
        buttonVariants({
          variant: local.variant ?? 'ghost',
          size: local.size ?? 'icon',
        }),
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

export { IconButton }
