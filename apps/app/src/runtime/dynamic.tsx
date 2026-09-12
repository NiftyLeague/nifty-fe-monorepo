import { ClientOnly } from '@tanstack/react-router'
import { Suspense, lazy, type ComponentType, type ReactNode } from 'react'

type DynamicLoader<Props extends object> = () => Promise<
  ComponentType<Props> | { default: ComponentType<Props> }
>

interface DynamicOptions {
  /**
   * Set to `false` to keep the component out of the server render entirely.
   * The browser then mounts it after hydration, matching the deferred
   * client-only boundaries this app relies on for wallet and WebGL surfaces.
   */
  ssr?: boolean
  loading?: () => ReactNode
}

/**
 * Drop-in replacement for the previous lazy-loading helper so the deferred
 * boundaries keep their code splitting.
 *
 * Both loader shapes are supported: a module with a `default`
 * export, or a promise that resolves straight to a component (the
 * `.then((module) => module.Named)` form).
 */
export default function dynamic<Props extends object>(
  loader: DynamicLoader<Props>,
  options: DynamicOptions = {}
): ComponentType<Props> {
  const { ssr = true, loading } = options
  const fallback = loading?.() ?? null

  const LazyComponent = lazy(async () => {
    const loaded = await loader()
    return typeof loaded === 'function' ? { default: loaded } : loaded
  })

  const DynamicComponent = (props: Props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  )

  if (ssr) return DynamicComponent

  const ClientDynamicComponent = (props: Props) => (
    <ClientOnly fallback={fallback}>
      <DynamicComponent {...props} />
    </ClientOnly>
  )

  return ClientDynamicComponent
}
