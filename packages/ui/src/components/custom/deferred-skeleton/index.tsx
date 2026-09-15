import { splitProps, type ComponentProps } from 'solid-js'

/**
 * Lightweight loading surface for deferred boundaries.
 *
 * Deferred boundaries are part of the initial client graph, so they avoid the
 * full class-merging helper used by interactive shadcn components. The visual
 * tokens and reduced-motion behaviour match the shared Skeleton primitive.
 *
 * Unlike Skeleton it is not hidden from assistive technology by default: callers
 * use it as the loading state itself (`role="status"` with an `aria-label`, as
 * DeferredYouTubeEmbed does), so the boundary decides how it is announced.
 */
function DeferredSkeleton(props: ComponentProps<'div'> & { className?: string }) {
  const [local, others] = splitProps(props, ['class', 'className'])
  const baseClasses = ['bg-accent', 'animate-pulse motion-reduce:animate-none', 'rounded-md']
  const customClasses = (local.class ?? local.className)?.split(/\s+/).filter(Boolean) ?? []

  if (customClasses.some((cls) => cls.startsWith('rounded'))) {
    baseClasses.pop()
  }

  return (
    <div data-slot="skeleton" class={[...baseClasses, ...customClasses].join(' ')} {...others} />
  )
}

export { DeferredSkeleton }
export default DeferredSkeleton
