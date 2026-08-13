import type { ComponentProps } from 'react'

/**
 * Lightweight loading surface for deferred boundaries.
 *
 * Deferred boundaries are part of the initial client graph, so they avoid the
 * full class-merging helper used by interactive shadcn components. The
 * visual tokens intentionally match the shared Skeleton primitive.
 */
function DeferredSkeleton({ className, ...props }: ComponentProps<'div'>) {
  const baseClasses = ['bg-accent', 'animate-pulse', 'rounded-md']
  const customClasses = className?.split(/\s+/).filter(Boolean) ?? []

  if (customClasses.some((className) => className.startsWith('rounded'))) {
    baseClasses.pop()
  }

  return (
    <div
      data-slot="skeleton"
      className={[...baseClasses, ...customClasses].join(' ')}
      {...props}
    />
  )
}

export { DeferredSkeleton }
export default DeferredSkeleton
