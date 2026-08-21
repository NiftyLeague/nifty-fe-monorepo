'use client'

import * as React from 'react'
import * as TogglePrimitive from 'radix-ui/toggle'
import { type VariantProps } from 'class-variance-authority'

import { cn } from '@nl/ui/utils'
import { toggleVariants } from '@nl/ui/base/toggle-variants'

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
