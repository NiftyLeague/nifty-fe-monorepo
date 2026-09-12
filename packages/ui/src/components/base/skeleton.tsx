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
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn('bg-accent animate-pulse rounded-md motion-reduce:animate-none', className)}
      {...props}
    />
  )
}

export { Skeleton }
