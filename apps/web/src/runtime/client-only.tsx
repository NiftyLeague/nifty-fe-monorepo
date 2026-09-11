import { lazy, Suspense, useEffect, useState } from 'react'
import type { ComponentType } from 'react'

/**
 * Narrow adapter for the existing client-only GLTF boundaries.
 * The import does not start during static rendering. ModelView retains its
 * separate user-action-gated import inside DegenViews.
 */
export default function clientOnly<P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  options: { ssr?: boolean; loading?: ComponentType } = {}
) {
  const Component = lazy(loader)
  return function ClientOnly(props: P) {
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    const Loading = options.loading
    const fallback = Loading ? <Loading /> : null
    if (!mounted) return fallback
    return (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    )
  }
}
