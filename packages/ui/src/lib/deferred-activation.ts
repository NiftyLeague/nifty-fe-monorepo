const ACTIVATION_EVENTS = ['pointerdown', 'keydown', 'touchstart'] as const
const DEFAULT_DELAY = 5000

interface DeferredActivationOptions {
  delay?: number
  onActivate: () => void
}

/**
 * Schedules non-essential work after user interaction or an idle timeout.
 * Keeping the listener and timer lifecycle in one place prevents deferred
 * features from drifting into subtly different activation behavior.
 */
export function scheduleDeferredActivation({
  delay = DEFAULT_DELAY,
  onActivate,
}: DeferredActivationOptions): () => void {
  let activated = false
  let idleId: number | null = null
  let timeoutId: number | null = null

  const removeActivationListeners = () => {
    for (const eventName of ACTIVATION_EVENTS) {
      window.removeEventListener(eventName, activate)
    }
  }

  const cancelIdleActivation = () => {
    if (idleId !== null) {
      window.cancelIdleCallback?.(idleId)
      idleId = null
    }
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const activate = () => {
    if (activated) return
    activated = true
    removeActivationListeners()
    cancelIdleActivation()
    onActivate()
  }

  for (const eventName of ACTIVATION_EVENTS) {
    window.addEventListener(eventName, activate, { once: true, passive: true })
  }

  if (window.requestIdleCallback) {
    timeoutId = window.setTimeout(() => {
      timeoutId = null
      idleId = window.requestIdleCallback(activate, { timeout: 1000 })
    }, delay)
  } else {
    timeoutId = window.setTimeout(activate, delay)
  }

  return () => {
    removeActivationListeners()
    cancelIdleActivation()
  }
}
