import { splitProps, type ComponentProps } from 'solid-js'

import { cn } from '@nl/ui/utils'

/**
 * Pulsing placeholder for pending content.
 *
 * Decorative by default: it carries no information a screen reader can use, and
 * the region that owns the loading state announces it (see `route-loading` and
 * `deferred-skeleton`). A caller that wants it exposed can pass its own
 * `aria-hidden` or `role`, which override this default. The pulse is suppressed
 * under `prefers-reduced-motion`.
 */
type SkeletonProps = ComponentProps<'div'> & { className?: string }

function Skeleton(props: SkeletonProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      class={cn(
        'bg-accent animate-pulse rounded-md motion-reduce:animate-none',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

export { Skeleton }
