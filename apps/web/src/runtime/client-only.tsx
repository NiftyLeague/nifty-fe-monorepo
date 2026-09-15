import { Show, createSignal, lazy, onMount, type Component, type JSX } from 'solid-js'

/**
 * Narrow adapter for the existing client-only GLTF boundaries.
 * The import does not start during static rendering. ModelView retains its
 * separate user-action-gated import inside DegenViews.
 */
export default function clientOnly<P extends object>(
  loader: () => Promise<{ default: Component<P> }>,
  options: { ssr?: boolean; loading?: Component } = {}
) {
  const Component = lazy(loader)
  return function ClientOnly(props: P): JSX.Element {
    const [mounted, setMounted] = createSignal(false)
    onMount(() => setMounted(true))
    const Loading = options.loading
    return (
      <Show when={mounted()} fallback={Loading ? <Loading /> : null}>
        <Component {...props} />
      </Show>
    )
  }
}
