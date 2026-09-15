import { ClientOnly } from '@tanstack/solid-router'
import { Suspense, lazy, type Component, type JSX } from 'solid-js'

type DynamicLoader<Props extends object> = () => Promise<
  ComponentType<Props> | { default: ComponentType<Props> }
>

/**
 * Memo and forwardRef components are exotic objects, not functions, so
 * named-export loaders (`import(...).then((module) => module.Card)`) can
 * resolve to something React accepts as a component type without it being a
 * function. Such values must wrap as the component, never as the module.
 */
const isComponentType = (value: unknown): value is ComponentType<never> =>
  typeof value === 'function' ||
  (typeof value === 'object' && value !== null && '$$typeof' in value)

interface DynamicOptions {
  /**
   * Set to `false` to keep the component out of the server render entirely.
   * The browser then mounts it after hydration, matching the deferred
   * client-only boundaries this app relies on for wallet and WebGL surfaces.
   */
  ssr?: boolean
  loading?: () => JSX.Element
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
    if (isComponentType(loaded)) return { default: loaded as ComponentType<Props> }
    return loaded as { default: ComponentType<Props> }
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
