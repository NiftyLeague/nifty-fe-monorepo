import type { ComponentProps } from 'react'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@nl/ui/utils'

import { buttonVariants } from './button-variants'

type IconButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>

function IconButton({
  className,
  variant = 'ghost',
  size = 'icon',
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      data-slot="icon-button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { IconButton }
