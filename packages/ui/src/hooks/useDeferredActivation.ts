import { createEffect, createSignal, onCleanup, type Accessor } from 'solid-js'

import { scheduleDeferredActivation } from '@nl/ui/lib/deferred-activation'

export interface UseDeferredActivationOptions {
  delay?: number
  /** Reactive accessors let callers gate activation on viewport signals. */
  enabled?: boolean | Accessor<boolean>
}

/**
 * Gates non-essential client work behind shared interaction/idle activation.
 * Multiple consumers share the underlying listeners and timer through
 * scheduleDeferredActivation, so mounting more deferred features does not
 * multiply global event handlers.
 */
export default function useDeferredActivation(
  options: UseDeferredActivationOptions = {}
): Accessor<boolean> {
  const [isActivated, setIsActivated] = createSignal(false)

  createEffect(() => {
    const enabled =
      typeof options.enabled === 'function' ? options.enabled() : (options.enabled ?? true)
    if (!enabled) return

    const cleanup = scheduleDeferredActivation({
      delay: options.delay,
      onActivate: () => setIsActivated(true),
    })
    onCleanup(cleanup)
  })

  return isActivated
}
