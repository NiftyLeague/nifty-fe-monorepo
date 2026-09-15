import { Show, createSignal, onCleanup, onMount } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import { scheduleDeferredActivation } from '@nl/ui/lib/deferred-activation'

const loadGtm = () => import('./GoogleTagManager').then((module) => ({ default: module.default }))

/** Loads only the shared GTM client boundary, without Next-only Web Vitals code. */
export default function DeferredGoogleTagManager() {
  const [activated, setActivated] = createSignal(false)
  const { Component: GoogleTagManager } = useDeferredComponent(loadGtm, activated)

  onMount(() => {
    const cleanup = scheduleDeferredActivation({ onActivate: () => setActivated(true) })
    onCleanup(cleanup)
  })

  return <Show when={GoogleTagManager()}>{(Gtm) => <Dynamic component={Gtm()} />}</Show>
}
