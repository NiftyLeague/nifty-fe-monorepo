import * as ImagePrimitive from '@kobalte/core/image'
import { splitProps, type ComponentProps } from 'solid-js'

import { cn } from '@nl/ui/utils'

type AvatarProps = ComponentProps<typeof ImagePrimitive.Root> & { className?: string }

function Avatar(props: AvatarProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <ImagePrimitive.Root
      data-slot="avatar"
      class={cn(
        'relative flex size-8 shrink-0 overflow-hidden rounded-full',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

function AvatarImage(props: ComponentProps<typeof ImagePrimitive.Img> & { className?: string }) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <ImagePrimitive.Img
      data-slot="avatar-image"
      class={cn('aspect-square size-full', local.class, local.className)}
      {...others}
    />
  )
}

function AvatarFallback(
  props: ComponentProps<typeof ImagePrimitive.Fallback> & { className?: string }
) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <ImagePrimitive.Fallback
      data-slot="avatar-fallback"
      class={cn(
        'bg-muted flex size-full items-center justify-center rounded-full',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
